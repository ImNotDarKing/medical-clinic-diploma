# 🏥 Medical Clinic — медицинская клиника

Реализовано веб-приложение для медицинской клиники: пациенты могут регистрироваться, смотреть врачей, записываться на приём и управлять своими записями; врачи видят профиль и записи; администратор полностью управляет данными.

---

## ✨ Что умеет проект

- Пользовательская регистрация и вход
- Просмотр списка врачей и запись на приём
- Управление личным профилем и записями
- Фильтрация статуса записей
- Загрузка фотографий врачей
- Админ-панель для управления врачами, пользователями и записями
- JWT-аутентификация и bcrypt-хеширование паролей
- Отзывчивый дизайн для мобильных устройств

---

## 🧩 Технологический стек

### Frontend
- React 19.2.4
- React Router DOM 7.13.1
- CSS3

### Backend
- Node.js
- Express.js 5.2.1
- PostgreSQL (через `pg`)
- JWT (`jsonwebtoken`)
- Bcrypt (`bcrypt`)
- Multer (`multer`) для загрузки файлов
- CORS (`cors`)
- Dotenv (`dotenv`)

### Dev Tools
- Nodemon
- Concurrently

---

## 📁 Структура проекта

```
medical-clinic/
├── server.js                  # Запуск backend
├── package.json               # Скрипты и зависимости
├── Procfile                   # Команда запуска для хостинга
├── public/                    # Шаблон React
├── build/                     # Собранный production-фронтенд
├── src/
│   ├── api/config.js          # Настройка API URL для frontend
│   ├── config.js              # backend-конфигурация из .env
│   ├── db.js                  # Инициализация и миграции PostgreSQL
│   ├── server-core.js         # Express API, static-файлы, сборка React
│   ├── App.js                 # Роутинг frontend
│   ├── index.js               # Точка входа React
│   ├── components/            # UI-компоненты
│   ├── pages/                 # Страницы приложения
│   ├── styles/                 # Основные стили
│   └── img/                   # Внутренние изображения
├── .env                       # Пример переменных окружения
└── README.md                  # Документация
```

---

## 🚀 Локальный запуск

### 1) Установить зависимости

```bash
npm install
```

### 2) Создать `.env`

Скопируйте `.env` или создайте локальную версию и задайте значения:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:5000
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medicalClinicDB
DB_USER=postgres
DB_PASSWORD=1234
JWT_SECRET=local_dev_secret_key_not_secure
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123456
ADMIN_TOKEN_SECRET=local_admin_secret_not_secure
STORAGE_TYPE=memory
MAX_FILE_SIZE=5242880
```

> Для разработки можно использовать PostgreSQL на локальной машине.

### 3) Запустить в режиме разработки

```bash
npm run dev
```

- Frontend будет доступен на `http://localhost:3000`
- Backend на `http://localhost:5000`

### 4) Альтернативные команды

```bash
npm start          # только React frontend
npm run server:dev # только backend с nodemon
npm run build      # собрать frontend
npm run start:prod # собрать frontend и запустить сервер
```

---

## 🔧 Переменные окружения

Проект использует следующие переменные:

- `NODE_ENV` — `development` или `production`
- `PORT` — порт сервера
- `CORS_ORIGIN` — адрес frontend при dev-запуске
- `REACT_APP_BACKEND_URL` — адрес backend для frontend
- `DB_TYPE` — тип БД (`postgres`)
- `DB_HOST` — адрес PostgreSQL
- `DB_PORT` — порт PostgreSQL
- `DB_NAME` — имя базы данных
- `DB_USER` — пользователь PostgreSQL
- `DB_PASSWORD` — пароль PostgreSQL
- `JWT_SECRET` — секрет для JWT
- `ADMIN_EMAIL` — email администратора
- `ADMIN_PASSWORD` — пароль администратора
- `ADMIN_TOKEN_SECRET` — секрет для админского токена
- `STORAGE_TYPE` — `memory` или `disk`
- `MAX_FILE_SIZE` — максимальный размер файла при загрузке

---

## 📦 Сборка и production

```bash
npm run build
npm run start:prod
```

`start:prod` автоматически запускает сборку фронтенда и затем запускает сервер.

---

## 🌐 Railway Deployment

### Что уже готово

- Сервер умеет обслуживать React `build/` директорию через Express
- Бэкенд поддерживает PostgreSQL
- `Procfile` есть для автоматического старта
- `package.json` содержит `start:prod`

### Что нужно сделать на Railway

1. Создать новый проект на Railway.
2. Подключить PostgreSQL-деплоймент.
3. Задать переменные окружения для сервиса:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DB_TYPE=postgres`
   - `DB_HOST` — из Railway Postgres
   - `DB_PORT` — из Railway Postgres
   - `DB_NAME` — имя базы
   - `DB_USER` — пользователь
   - `DB_PASSWORD` — пароль
   - `JWT_SECRET` — сильный секрет
   - `ADMIN_EMAIL` и `ADMIN_PASSWORD`
   - `ADMIN_TOKEN_SECRET`
   - `CORS_ORIGIN` — если нужно, например `https://your-app-url.railway.app`

### Важно для Railway

Если Railway предоставляет только `DATABASE_URL`, то в текущем коде нужно либо:

- настроить переменные `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` вручную,
- либо добавить разбор `DATABASE_URL` в `src/config.js`.

### Команды Railway

- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`

---

## ✅ Готовность к деплою на Railway

Сайт почти готов к Railway, но нужно обязательно:

- настроить PostgreSQL на Railway;
- задать реальные env-переменные;
- при необходимости сопоставить `DATABASE_URL` с переменными `DB_*`.

Если вы вручную зададите `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` и `DB_PASSWORD`, то сайт запустится без дополнительных изменений.

---

## 👤 Администратор

- Email: `admin@example.com`
- Password: `123456`

---

## 📌 Примечание

В production-приложении фронтенд и бэкенд могут работать вместе в одном сервисе: Express уже настроен на отдачу `build/`.

---

## 📌 Контакты

Проект создан для курса 4ИСПр, 2026.
