/**
 * Лабораторна 7
 * MockAPI → fetch() → response.json() → renderSensors()
 *
 * ЗАМІНИ API_URL на свій endpoint після створення проєкту на mockapi.io
 * Приклад: https://68xxxxxx.mockapi.io/api/v1/sensors
 */
const API_URL = "https://6ad1dd0466cd28aed82d00b8.mockapi.io/sensors";

async function loadSensors() {
  const container = document.querySelector("#sensors-list");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const sensors = await response.json();
    console.log("Завантажено сенсорів:", sensors);
    renderSensors(sensors);
  } catch (error) {
    console.error("Не вдалося завантажити сенсори:", error);
    if (container) {
      container.innerHTML =
        '<p class="sensors__error">Не вдалося завантажити дані. Перевірте API_URL і Network у DevTools.</p>';
    }
  }
}

function renderSensors(sensors) {
  const container = document.querySelector("#sensors-list");
  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(sensors) || sensors.length === 0) {
    container.innerHTML = "<p>Немає даних про сенсори.</p>";
    return;
  }

  sensors.forEach((sensor) => {
    const card = document.createElement("article");
    card.classList.add("sensor-card");

    const isActive = String(sensor.status).toLowerCase() === "active";
    const noiseClass = Number(sensor.noiseLevel) >= 70 ? "noise--high" : "";

    card.innerHTML = `
      <h3>${sensor.name ?? "Без назви"}</h3>
      <p>Район: ${sensor.district ?? "—"}</p>
      <p class="${noiseClass}">Рівень шуму: ${sensor.noiseLevel ?? "—"} дБ</p>
      <p>
        <span class="status ${isActive ? "status--active" : "status--inactive"}">
          ${sensor.status ?? "—"}
        </span>
      </p>
    `;

    container.append(card);
  });
}

loadSensors();
