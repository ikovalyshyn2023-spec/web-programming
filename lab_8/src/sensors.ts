/**
 * Лабораторна робота №8
 * Робота з даними з API на TypeScript
 * Проєкт: «Акустична варта»
 */

interface Sensor {
  id: string;
  name: string;
  district: string;
  noiseLevel: number;
  status: "active" | "inactive";
}

/** Базовий URL MockAPI (з лабораторної 7) */
const API_URL = "https://6ad1dd0466cd28aed82d00b8.mockapi.io/sensors";

/**
 * Малює картки сенсорів у контейнері #sensors
 */
function renderSensors(sensors: Sensor[]): void {
  const container = document.querySelector<HTMLDivElement>("#sensors");

  if (!container) {
    console.error("Контейнер #sensors не знайдено");
    return;
  }

  container.innerHTML = "";

  if (sensors.length === 0) {
    container.innerHTML = "<p class=\"empty\">Сенсорів не знайдено</p>";
    return;
  }

  sensors.forEach((sensor) => {
    const card = document.createElement("div");
    card.className = `sensor-card sensor-card--${sensor.status}`;

    const statusLabel = sensor.status === "active" ? "Активний" : "Неактивний";
    const noiseClass =
      sensor.noiseLevel >= 70
        ? "noise--high"
        : sensor.noiseLevel >= 55
          ? "noise--medium"
          : "noise--low";

    card.innerHTML = `
      <h3 class="sensor-card__title">${sensor.name}</h3>
      <p class="sensor-card__row"><span>Район:</span> ${sensor.district}</p>
      <p class="sensor-card__row ${noiseClass}">
        <span>Рівень шуму:</span> ${sensor.noiseLevel} дБ
      </p>
      <p class="sensor-card__status sensor-card__status--${sensor.status}">
        ${statusLabel}
      </p>
    `;

    container.appendChild(card);
  });
}

/**
 * Завантажує сенсори з MockAPI і передає їх у renderSensors
 */
async function loadSensors(): Promise<void> {
  const container = document.querySelector<HTMLDivElement>("#sensors");
  if (container) {
    container.innerHTML = "<p class=\"loading\">Завантаження сенсорів…</p>";
  }

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: не вдалося завантажити сенсори`);
    }

    const sensors: Sensor[] = await response.json();
    renderSensors(sensors);
  } catch (error) {
    console.error("Помилка:", error);
    if (container) {
      container.innerHTML =
        "<p class=\"error\">Не вдалося завантажити дані. Перевірте API та консоль.</p>";
    }
  }
}

// Запуск після завантаження скрипта
loadSensors();
