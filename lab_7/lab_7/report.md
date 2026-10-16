# Лабораторна робота №7
Завантаження даних з публічного API та відображення на сторінці

## Мета
Навчитися виконувати HTTP GET через `fetch()`, отримувати JSON з MockAPI та відображати масив сенсорів у DOM.

## Що реалізовано
- Створено тестовий REST API у MockAPI (resource `sensors`, prefix `/api/v1`)
- Додано 5–6 тестових сенсорів (name, district, noiseLevel, status)
- На сторінці «Акустична варта» контейнер `#sensors-list`
- Функція `loadSensors()`: `fetch` → перевірка `response.ok` → `response.json()`
- Функція `renderSensors(sensors)`: створення карток у DOM
- Обробка помилок через `try/catch`
- Перевірка запиту в DevTools → Network (статус 200)

## Результат
![screenshot](./screenshot.png)

## Висновок
Освоєно отримання даних із зовнішнього API та динамічне формування інтерфейсу без жорстко прошитого масиву в коді.
