# Лабораторна робота №11

**Тема:** Створення REST API для бази (датчики Acoustic Watch)

**Студент:** Ковалишин Іван Андрійович  
**Група:** КНк-43

## Мета
Реалізувати CRUD для датчиків на Express: POST, GET, PUT, DELETE, валідацію, фільтри, статистику та оновити сервіс на Render.

## Що зроблено
- Структура: `app.js`, `routes/sensors.routes.js`, `server.js`
- CRUD: GET /api/sensors, GET /:id, POST /, PUT /:id, DELETE /:id
- Валідація body → 400; 201 при створенні; 204 при видаленні
- Фільтри: `?status=` та `?district=`
- `GET /api/sensors/stats` (total, active, inactive, averageNoiseLevel)
- Перевірка локально та на Render

## Маршрути
| Метод | Шлях | Код |
|-------|------|-----|
| GET | /api/sensors | 200 |
| GET | /api/sensors/stats | 200 |
| GET | /api/sensors/:id | 200 / 404 |
| POST | /api/sensors | 201 / 400 |
| PUT | /api/sensors/:id | 200 / 400 / 404 |
| DELETE | /api/sensors/:id | 204 / 404 |

## Висновок
Реалізовано REST API з валідацією та коректними HTTP-кодами. Дані зберігаються в пам'яті процесу (постійне сховище — MongoDB у наступній роботі).
