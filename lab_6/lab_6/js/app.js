const sensors = [
  {
    id: "NS-01",
    district: "Галицький",
    location: "просп. Свободи, 14",
    noiseLevel: 52,
    status: "normal",
  },
  {
    id: "NS-02",
    district: "Франківський",
    location: "вул. Наукова, 8",
    noiseLevel: 68,
    status: "warning",
  },
  {
    id: "NS-03",
    district: "Шевченківський",
    location: "просп. Чорновола, 21",
    noiseLevel: 83,
    status: "critical",
  },
  {
    id: "NS-04",
    district: "Сихівський",
    location: "вул. Зелена, 102",
    noiseLevel: 49,
    status: "normal",
  },
  {
    id: "NS-05",
    district: "Личаківський",
    location: "вул. Пасічна, 30",
    noiseLevel: 71,
    status: "warning",
  },
  {
    id: "NS-06",
    district: "Залізничний",
    location: "вул. Городоцька, 155",
    noiseLevel: 86,
    status: "critical",
  },
];

const sensorList = document.querySelector(".sensor-list");
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");

function createSensorCard(sensor) {
  const card = document.createElement("article");
  card.classList.add("sensor-card");
  card.classList.add(`sensor-card--${sensor.status}`);

  const title = document.createElement("h3");
  title.textContent = sensor.id;

  const badge = document.createElement("span");
  badge.className = `badge badge--${sensor.status}`;
  badge.textContent = sensor.status;
  title.append(badge);

  const district = document.createElement("p");
  district.className = "meta";
  district.textContent = `📍 ${sensor.district} район`;

  const location = document.createElement("p");
  location.className = "meta";
  location.textContent = `🏢 ${sensor.location}`;

  const level = document.createElement("p");
  level.className = `level ${sensor.status}`;
  level.textContent = `Рівень шуму: ${sensor.noiseLevel} дБ`;

  card.append(title, district, location, level);
  return card;
}

function renderSensors(sensorArray) {
  sensorList.replaceChildren();
  sensorArray.forEach((sensor) => {
    sensorList.append(createSensorCard(sensor));
  });
}

function applyFilters() {
  const selectedDistrict = districtFilter.value;
  const criticalOnly = criticalFilter.checked;

  const filteredSensors = sensors.filter((sensor) => {
    const matchesDistrict =
      selectedDistrict === "all" || sensor.district === selectedDistrict;
    const matchesStatus = !criticalOnly || sensor.status === "critical";
    return matchesDistrict && matchesStatus;
  });

  renderSensors(filteredSensors);
}

districtFilter.addEventListener("change", applyFilters);
criticalFilter.addEventListener("change", applyFilters);

renderSensors(sensors);
