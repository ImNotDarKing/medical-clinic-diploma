const { Pool } = require('pg');
const config = require('./config');

let pool = null;

async function initDatabase() {
	try {
		pool = new Pool({
			host: config.dbHost || 'localhost',
			port: config.dbPort || 5432,
			database: config.dbName || 'medical_clinic',
			user: config.dbUser || 'postgres',
			password: config.dbPassword || '',
			max: 20,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		});

		await pool.connect();
		console.log(`PostgreSQL БД подключена: ${config.dbHost}:${config.dbPort}/${config.dbName}`);
		await createTablesIfNotExist();
		return pool;
	} catch (err) {
		console.error('Ошибка подключения к PostgreSQL:', err.message);
		throw err;
	}
}

async function createTablesIfNotExist() {
	const tables = [
		`CREATE TABLE IF NOT EXISTS users (
			user_id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			role_id INTEGER NOT NULL
		)`,

		`CREATE TABLE IF NOT EXISTS patients (
			patient_id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(user_id),
			first_name VARCHAR(100),
			last_name VARCHAR(100),
			phone_number VARCHAR(20),
			address TEXT
		)`,

		`CREATE TABLE IF NOT EXISTS doctors (
			doctor_id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(user_id),
			first_name VARCHAR(100),
			last_name VARCHAR(100),
			specialization VARCHAR(100),
			experience_years INTEGER,
			photo_blob BYTEA,
			photo_mime_type VARCHAR(50)
		)`,

		`CREATE TABLE IF NOT EXISTS appointments (
			appointment_id SERIAL PRIMARY KEY,
			patient_id INTEGER REFERENCES patients(patient_id),
			doctor_id INTEGER REFERENCES doctors(doctor_id),
			appointment_date TIMESTAMP NOT NULL,
			service_type VARCHAR(255) NOT NULL,
			notes TEXT,
			doctor_notes TEXT,
			status VARCHAR(50) DEFAULT 'new',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`
	];

	for (const query of tables) {
		try {
			await pool.query(query);
			console.log('Таблица создана или уже существует');
		} catch (err) {
			console.error('Ошибка создания таблицы:', err.message);
		}
	}

	const alterQueries = [
		`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor_notes TEXT`,
		`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new'`
	];

	for (const query of alterQueries) {
		try {
			await pool.query(query);
			console.log('Колонка добавлена или уже существует');
		} catch (err) {
			console.error('Ошибка изменения таблицы appointments:', err.message);
		}
	}
}

function getDB() {
	if (!pool) {
		throw new Error('БД не инициализирована. Вызвать initDatabase() перед использованием.');
	}
	return pool;
}

module.exports = {
	initDatabase,
	getDB,
};
