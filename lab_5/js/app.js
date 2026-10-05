import { NoiseSensor, MobileNoiseSensor, NOISE_LIMITS } from "./models/NoiseSensor.js";
import { NoiseMeasurement } from "./models/NoiseMeasurement.js";
import { MonitoringSystem } from "./services/MonitoringSystem.js";

const sensorsData = [
  { id: "NS-01", district: "Галицький", location: "просп. Свободи", noiseLevel: 58 },
  { id: "NS-02", district: "Франківський", location: "вул. Наукова", noiseLevel: 74 },
  { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола", noiseLevel: 83 },
];

const system = new MonitoringSystem();

sensorsData
  .map((data) => NoiseSensor.fromObject(data))
  .forEach((sensor) => system.addSensor(sensor));

// Inheritance demo (not shown on main grid by default)
const mobile = new MobileNoiseSensor("NS-M1", "Личаківський", "вул. Зелена", 49, 15);
system.addSensor(mobile);

// --- Console experiments (Lab requirements) ---
const a = system.findSensorById("NS-01");
const b = system.findSensorById("NS-02");
console.log("getStatus same function?", a.getStatus === b.getStatus); // true
console.log("hasOwn noiseLevel?", Object.hasOwn(a, "noiseLevel")); // true
console.log("hasOwn getStatus?", Object.hasOwn(a, "getStatus")); // false
console.log("Average:", system.getAverageNoiseLevel());
console.log("Critical:", system.getCriticalSensors().map((s) => s.id));
console.log("NOISE_LIMITS", NOISE_LIMITS);
console.log("Mobile needs charging?", mobile.needsCharging());

// --- DOM ---
const grid = document.getElementById("sensors-grid");
const avgEl = document.getElementById("stat-avg");
const critEl = document.getElementById("stat-critical");
const totalEl = document.getElementById("stat-total");
const filterDistrict = document.getElementById("filter-district");
const filterStatus = document.getElementById("filter-status");
const searchId = document.getElementById("search-id");

function renderSensorCard(sensor) {
  const status = sensor.getStatus();
  const card = document.createElement("article");
  card.className = `sensor-card ${status}`;
  card.dataset.id = sensor.id;

  const battery =
    sensor instanceof MobileNoiseSensor
      ? `<div class="meta">Батарея: ${sensor.batteryLevel}%${
          sensor.needsCharging() ? " ⚠ заряджати" : ""
        }</div>`
      : "";

  card.innerHTML = `
    <div class="id">${sensor.id}</div>
    <div class="meta">${sensor.district} · ${sensor.location}</div>
    <div class="level">${sensor.noiseLevel} <span>dB</span></div>
    <span class="badge ${status}">${status}</span>
    ${battery}
    <div class="actions">
      <button type="button" data-action="plus">+5 dB</button>
      <button type="button" data-action="measure">Вимір</button>
    </div>
  `;

  card.querySelector('[data-action="plus"]').addEventListener("click", () => {
    const next = Math.min(200, sensor.noiseLevel + 5);
    sensor.updateNoiseLevel(next);
    refresh();
  });

  card.querySelector('[data-action="measure"]').addEventListener("click", () => {
    const value = Math.round(40 + Math.random() * 50);
    sensor.addMeasurement(new NoiseMeasurement(value));
    refresh();
  });

  return card;
}

function getVisibleSensors() {
  let list = system.getAllSensors();
  const district = filterDistrict.value;
  const status = filterStatus.value;
  const idQuery = searchId.value.trim().toLowerCase();

  if (district) list = list.filter((s) => s.district === district);
  if (status) list = list.filter((s) => s.getStatus() === status);
  if (idQuery) list = list.filter((s) => s.id.toLowerCase().includes(idQuery));
  return list;
}

function refresh() {
  const list = getVisibleSensors();
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">Немає датчиків за фільтром</p>`;
  } else {
    list.forEach((s) => grid.appendChild(renderSensorCard(s)));
  }

  totalEl.textContent = String(system.sensors.length);
  const avg = system.getAverageNoiseLevel();
  avgEl.textContent = avg === null ? "—" : `${avg} dB`;
  critEl.textContent = String(system.getCriticalSensors().length);
}

function fillDistrictFilter() {
  const districts = [...new Set(system.sensors.map((s) => s.district))].sort();
  filterDistrict.innerHTML =
    `<option value="">Усі райони</option>` +
    districts.map((d) => `<option value="${d}">${d}</option>`).join("");
}

filterDistrict.addEventListener("change", refresh);
filterStatus.addEventListener("change", refresh);
searchId.addEventListener("input", refresh);

document.getElementById("btn-reset-filters").addEventListener("click", () => {
  filterDistrict.value = "";
  filterStatus.value = "";
  searchId.value = "";
  refresh();
});

fillDistrictFilter();
refresh();
