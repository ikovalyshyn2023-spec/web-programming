/**
 * Акустична варта — аналіз вимірювань шуму
 * Лабораторна 4: цикли, функції, функціональні вирази
 * Результат виводиться лише в Console браузера
 */

// ---------- Вихідні дані ----------
const noiseLevels = [
  42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
  53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
  79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

// ---------- Function Declaration: перевірка коректності ----------
function isValidLevel(level, min, max) {
  return Number.isFinite(level) && level >= min && level <= max;
}

// ---------- Function Declaration: перше критичне (з hoisting) ----------
// Можна викликати до оголошення завдяки hoisting
function findFirstCritical(data, critical, min, max) {
  for (let i = 0; i < data.length; i++) {
    const level = data[i];
    if (!isValidLevel(level, min, max)) continue;
    if (level > critical) {
      return { value: level, position: i + 1, index: i };
    }
  }
  return null;
}

// ---------- Function Expression: підрахунок за категоріями ----------
const countByCategory = function (data, warning, critical, min, max) {
  let safe = 0;
  let warn = 0;
  let crit = 0;
  let invalid = 0;
  let sum = 0;
  let validCount = 0;

  for (const level of data) {
    if (!isValidLevel(level, min, max)) {
      invalid++;
      continue;
    }
    validCount++;
    sum += level;
    if (level <= warning) {
      safe++;
    } else if (level <= critical) {
      warn++;
    } else {
      crit++;
    }
  }

  return { safe, warn, crit, invalid, sum, validCount, total: data.length };
};

// ---------- Arrow Functions ----------
const statusLabel = (value) => `Рівень: ${value} dB`;
const isAbove = (value, threshold) => value > threshold;

// ---------- calculateAverage ----------
function calculateAverage(data, min, max) {
  let sum = 0;
  let count = 0;
  for (const level of data) {
    if (!isValidLevel(level, min, max)) continue;
    sum += level;
    count++;
  }
  if (count === 0) return null;
  return sum / count;
}

// ---------- findMinimum / findMaximum ----------
function findMinimum(data, min, max) {
  let minVal = null;
  for (const level of data) {
    if (!isValidLevel(level, min, max)) continue;
    if (minVal === null || level < minVal) minVal = level;
  }
  return minVal;
}

function findMaximum(data, min, max) {
  let maxVal = null;
  for (const level of data) {
    if (!isValidLevel(level, min, max)) continue;
    if (maxVal === null || level > maxVal) maxVal = level;
  }
  return maxVal;
}

// ---------- while: пошук відновлення (3 безпечні поспіль після критичного) ----------
function findRecovery(data, afterIndex, warning, min, max) {
  if (afterIndex === null || afterIndex < 0) return null;

  let i = afterIndex + 1;
  let streak = 0;
  let lastSafePos = null;

  while (i < data.length) {
    const level = data[i];
    if (!isValidLevel(level, min, max) || level > warning) {
      streak = 0;
      lastSafePos = null;
    } else {
      streak++;
      lastSafePos = i + 1; // позиція для людини (1-based)
      if (streak === 3) {
        return lastSafePos;
      }
    }
    i++;
  }
  return null;
}

// ---------- do...while: перше коректне вимірювання ----------
function findFirstValid(data, min, max) {
  if (data.length === 0) return null;

  let i = 0;
  do {
    if (isValidLevel(data[i], min, max)) {
      return { value: data[i], position: i + 1 };
    }
    i++;
  } while (i < data.length);

  return null;
}

// ---------- Список некоректних записів ----------
function findInvalidEntries(data, min, max) {
  const list = [];
  for (let i = 0; i < data.length; i++) {
    if (!isValidLevel(data[i], min, max)) {
      list.push({ position: i + 1, value: data[i] });
    }
  }
  return list;
}

// ---------- Функція вищого порядку: приймає callback ----------
function runAnalysis(data, analyzerFn) {
  return analyzerFn(data, warningLevel, criticalLevel, minValidLevel, maxValidLevel);
}

// ---------- Головний звіт ----------
function printReport(data) {
  const stats = runAnalysis(data, countByCategory);
  const average = calculateAverage(data, minValidLevel, maxValidLevel);
  const minVal = findMinimum(data, minValidLevel, maxValidLevel);
  const maxVal = findMaximum(data, minValidLevel, maxValidLevel);
  const firstCritical = findFirstCritical(data, criticalLevel, minValidLevel, maxValidLevel);
  const recoveryPos = firstCritical
    ? findRecovery(data, firstCritical.index, warningLevel, minValidLevel, maxValidLevel)
    : null;
  const invalids = findInvalidEntries(data, minValidLevel, maxValidLevel);
  const overWarning = stats.warn + stats.crit;

  console.group("Акустична варта — звіт моніторингу");
  console.log(`Пороги: попередження > ${warningLevel} dB; критичний рівень > ${criticalLevel} dB`);
  console.log(`Усього вимірювань: ${stats.total}`);
  console.log(`Коректних: ${stats.validCount}`);
  console.log(`Некоректних: ${stats.invalid}`);

  console.table([
    { Категорія: "Без перевищення", Кількість: stats.safe },
    { Категорія: "Попередження", Кількість: stats.warn },
    { Категорія: "Критичні", Кількість: stats.crit }
  ]);

  if (average !== null) {
    console.log(`Середній рівень: ${average.toFixed(2)} dB`);
  } else {
    console.log("Середній рівень: null");
  }
  console.log(`Мінімальний рівень: ${minVal !== null ? minVal + " dB" : "null"}`);
  console.log(`Максимальний рівень: ${maxVal !== null ? maxVal + " dB" : "null"}`);

  if (firstCritical) {
    console.warn(
      `Перше критичне вимірювання: ${firstCritical.value} dB, позиція ${firstCritical.position}`
    );
  } else {
    console.log("Перше критичне вимірювання: не знайдено");
  }

  if (recoveryPos !== null) {
    console.log(`Відновлення — три безпечні вимірювання поспіль: позиція ${recoveryPos}`);
  } else {
    console.log("Відновлення — три безпечні вимірювання поспіль: не знайдено");
  }

  if (overWarning > 0) {
    console.warn(`Поріг ${warningLevel} dB перевищено у ${overWarning} вимірюваннях.`);
  }

  if (invalids.length > 0) {
    const text = invalids
      .map((e) => `позиція ${e.position} (${e.value} dB)`)
      .join(", ");
    console.error(`Некоректні дані: ${text}.`);
  }

  let conclusion;
  if (stats.crit > 0) {
    conclusion = recoveryPos
      ? `зафіксовано ${stats.crit} критичні вимірювання; після першого з них знайдено стійке відновлення.`
      : `зафіксовано ${stats.crit} критичні вимірювання; після першого з них стійкого відновлення не виявлено.`;
  } else {
    conclusion = "критичних вимірювань не зафіксовано.";
  }
  console.log(`Висновок: ${conclusion}`);
  console.groupEnd();
}

// ---------- Тестові набори (окремі виклики) ----------
function runExtraTests() {
  console.group("Додаткові тести");

  console.log("--- Порожній масив [] ---");
  printReport([]);

  console.log("--- Тільки некоректні [-1, 141] ---");
  printReport([-1, 141]);

  console.log("--- [70, 85, 86] ---");
  printReport([70, 85, 86]);

  console.groupEnd();
}

// ---------- Старт ----------
printReport(noiseLevels);
// Розкоментуйте для додаткових тестів:
// runExtraTests();
