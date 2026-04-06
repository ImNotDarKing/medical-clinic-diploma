# 🏥 Medical Clinic — Дипломная работа

Полнофункциональное веб-приложение для управления медицинской клиникой. Система реализует панель администратора для управления врачами и пациентами, персональные профили пользователей с историей визитов, и функционал для записи на приём к врачам. Приложение использует современный стек технологий с разделением на фронтенд (React) и бэкенд (Node.js + Express).

---

## 📋 Функциональность

### Для пациентов
- Регистрация и вход в систему
- Просмотр каталога врачей с фотографиями
- Запись на приём к врачу
- Личный кабинет с историей записей
- Управление перенесением/отменой приёмов
- Фильтрация записей по статусу

### Для врачей
- Просмотр личного профиля
- Список всех записей пациентов
- Заполнение примечаний по приёмам
- Проставление статуса приёма

### Для администратора
- Управление врачами (добавление/удаление/редактирование)
- Управление пациентами
- Управление записями
- Доступ ко всем данным системы

### Общее
- JWT-аутентификация с шифрованием паролей (bcrypt)
- Загрузка фотографий врачей
- Логирование операций
- Адаптивный интерфейс для мобильных устройств

---

## 🧩 Технологический стек

### Frontend
- **React 19.2.4** — библиотека для построения пользовательского интерфейса
- **React Router DOM 7.13.1** — маршрутизация в SPA
- **CSS3** — стилизация с поддержкой современных возможностей

### Backend
- **Node.js** — среда выполнения JavaScript на сервере
- **Express.js 5.2.1** — веб-фреймворк для создания REST API
- **PostgreSQL** — реляционная БД для хранения данных
- **pg 8.10.0** — драйвер PostgreSQL для Node.js
- **JWT** (`jsonwebtoken`) — создание и проверка токенов аутентификации
- **bcrypt** — хеширование паролей
- **multer** — обработка загрузки файлов (фотографии)
- **CORS** — управление кросс-доменными запросами
- **dotenv** — загрузка переменных окружения

### Dev Tools
- **Nodemon** — автоматическая перезагрузка сервера при изменениях
- **Concurrently** — одновременный запуск фронтенда и бэкенда

---

## 📁 Структура проекта

```
medical-clinic/
├── server.js                  # Точка входа приложения
├── package.json               # Зависимости и скрипты npm
├── Procfile                   # Конфигурация запуска для Railway
├── public/                    # Статические файлы frontend
│   ├── index.html             # Точка входа React
│   ├── img/                   # Изображения (отзывы, иконки)
│   └── ...
├── build/                     # Production-сборка frontend
├── src/
│   ├── api/
│   │   └── config.js          # Конфигурация API URL для frontend
│   ├── config.js              # Server-config из переменных окружения
│   ├── db.js                  # Инициализация PostgreSQL и миграции
│   ├── server-core.js         # Express API, маршруты, middleware
│   ├── App.js                 # Главный компонент с маршрутизацией
│   ├── index.js               # React точка входа
│   ├── components/            # Переиспользуемые UI-компоненты
│   │   ├── navbar/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── auth/              # Компоненты регистрации/входа
│   │   ├── appointment/       # Модальное окно записи на приём
│   │   ├── doctor/            # Карточка врача
│   │   └── reviews/           # Карусель отзывов
│   ├── pages/                 # Страницы приложения
│   │   ├── Home.js
│   │   ├── Doctors.js
│   │   ├── Profile.js
│   │   ├── Admin.js
│   │   └── Contacts.js
│   ├── styles/                # Глобальные стили
│   └── img/                   # SVG и прочие ресурсы
├── .env.example               # Пример переменных окружения
├── .gitignore                 # Исключение файлов из Git
└── README.md                  # Документация
```

---

## 🚀 Настройка и запуск

### Локальная разработка

#### 1. Установка зависимостей

```bash
npm install
```

#### 2. Создание `.env`

Скопируйте `.env.example` в `.env` и заполните значения:

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

JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword123
ADMIN_TOKEN_SECRET=admin_secret_key

STORAGE_TYPE=memory
MAX_FILE_SIZE=5242880
```

Требования: установленный **PostgreSQL** на локальной машине.

#### 3. Запуск в режиме разработки

```bash
npm run dev
```

- Фронтенд будет доступен на `http://localhost:3000`
- Бэкенд на `http://localhost:5000`

#### 4. Другие команды

```bash
npm start                    # Только React frontend
npm run server:dev          # Только backend с nodemon
npm run build               # Собрать frontend для production
npm run start:prod          # Собрать frontend и запустить server
```

---

## 🌐 Production (Railway)

Приложение развёрнуто на платформе Railway и автоматически деплоится при push в ветку `master`.

### Конфигурация

1. **Переменные окружения в Railway:**
   - `DATABASE_URL` — автоматически создаётся при подключении PostgreSQL
   - `REACT_APP_BACKEND_URL` — URL production домена
   - `NODE_ENV=production`
   - `JWT_SECRET` — безопасный секретный ключ
   - `ADMIN_PASSWORD` — безопасный пароль админа
   - Остальные переменные окружения, как при локальном запуске

2. **Процесс деплоя:**
   - Выполнение `npm run build` для сборки React
   - Инициализация PostgreSQL БД автоматически
   - Запуск Node.js сервера на порту, указанном Railway

3. **Post-build:**
   - Фронтенд собирается в папку `build/`
   - Сервер выполняет миграции БД при запуске

---

## 🔧 Переменные окружения

| Переменная | Описание | Default |
|---|---|---|
| `NODE_ENV` | Окружение (`development` / `production`) | `development` |
| `PORT` | Порт сервера | `5000` |
| `CORS_ORIGIN` | Origin фронтенда для CORS | `http://localhost:3000` |
| `REACT_APP_BACKEND_URL` | URL API для фронтенда | `http://localhost:5000` |
| `DATABASE_URL` | Connection string PostgreSQL (production) | - |
| `DB_TYPE` | Тип БД | `postgres` |
| `DB_HOST` | Хост PostgreSQL | `localhost` |
| `DB_PORT` | Порт PostgreSQL | `5432` |
| `DB_NAME` | Имя БД | `medicalClinicDB` |
| `DB_USER` | Пользователь БД | `postgres` |
| `DB_PASSWORD` | Пароль пользователя БД | - |
| `JWT_SECRET` | Секретный ключ для JWT | `dev_secret_key` |
| `ADMIN_EMAIL` | Email администратора | `admin@example.com` |
| `ADMIN_PASSWORD` | Пароль администратора | `123456` |
| `ADMIN_TOKEN_SECRET` | Секретный ключ для админ-токена | `admin_dev_secret` |
| `STORAGE_TYPE` | Хранилище файлов (`memory` / `disk`) | `disk` |
| `MAX_FILE_SIZE` | Максимальный размер载.txt в байтах | `5242880` (5MB) |

---

## 📊 API Endpoints

### Аутентификация
- `POST /register` — Регистрация пользователя
- `POST /login` — Вход в систему

### Профиль
- `GET /profile` — Получение данных профиля (требует токен)
- `PUT /profile` — Обновление профиля (требует токен)
- `POST /upload-photo` — Загрузка фотографии профиля (требует токен)

### Врачи
- `GET /doctors` — Список всех врачей
- `GET /doctor/:id/photo` — Фото врача по ID

### Записи на приём
- `GET /appointments` — Список записей пользователя (требует токен)
- `POST /appointments` — Создание новой записи (требует токен)
- `PUT /appointments/:id` — Обновление записи (требует токен)
- `DELETE /appointments/:id` — Удаление записи (требует токен)

### Администратор
- `POST /admin/login` — Вход в админ-панель
- `GET /admin/doctors` — Список врачей (требует админ-токен)
- `POST /admin/doctors` — Добавление врача (требует админ-токен)
- `DELETE /admin/doctors/:id` — Удаление врача (требует админ-токен)
- `GET /admin/users` — Список пользователей (требует админ-токен)
- `DELETE /admin/users/:id` — Удаление пользователя (требует админ-токен)
- `GET /admin/appointments` — Все записи на приём (требует админ-токен)

---

## 🔐 Безопасность

- Пароли хешируются с помощью **bcrypt** (10 раундов)
- JWT-токены хранятся в `localStorage` (httpOnly в production рекомендуется)
- Все POST/PUT/DELETE запросы требуют аутентификацию
- CORS настроен для разработки и production
- Admin-операции защищены отдельным токеном

---

## 📱 Требования к браузерам

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Мобильные браузеры на базе Chromium/WebKit

---

## 📝 Примечания к разработке

### Первый запуск
При первом запуске бэкенда автоматически:
1. Создаются таблицы в PostgreSQL
2. Инициализируется схема БД

### Миграции
Миграции выполняются автоматически при запуске в `src/db.js`. Для добавления новых таблиц отредактируйте методо `createTablesIfNotExist()`.

### Загрузка фотографий
- Фотографии врачей хранятся в таблице `doctors` (BYTEA)
- Фотографии профилей хранятся в таблице `users` (BYTEA)
- Максимальный размер файла: 5MB (настраивается через `MAX_FILE_SIZE`)

---

## 🌍 Просмотр проекта онлайн

Проект развёрнут на Railway и доступен по адресу:
**https://graceful-miracle-production-171a.up.railway.app**

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

## 👤 Администратор

- Email: `admin@example.com`
- Password: `123456`

---

## 📌 Примечание

В production-приложении фронтенд и бэкенд могут работать вместе в одном сервисе: Express уже настроен на отдачу `build/`.

---

## 📌 Контакты

Проект создан для курса 4ИСПр, 2026.
 - GitHub: ImNotDarKing
 - Railway: https://graceful-miracle-production-171a.up.railway.app