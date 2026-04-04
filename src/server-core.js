const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const { getDB } = require('./db');

const app = express();

app.use(cors({
	origin: config.corsOrigin,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'admin-token'],
}));
app.use(express.json());


app.use('/img', express.static(path.join(__dirname, '../img')));


let upload;
if (config.storageType === 'memory') {
	upload = multer({
		storage: multer.memoryStorage(),
		limits: { fileSize: config.maxFileSize },
		fileFilter: (req, file, cb) => {
			if (!file.mimetype.startsWith('image/')) {
				cb(new Error('Только изображения разрешены'));
			} else {
				cb(null, true);
			}
		},
	});
} else {
	const uploadDir = path.join(__dirname, '../img/doctor');
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, uploadDir);
		},
		filename: (req, file, cb) => {
			cb(null, Date.now() + path.extname(file.originalname));
		},
	});

	upload = multer({
		storage: storage,
		limits: { fileSize: config.maxFileSize },
		fileFilter: (req, file, cb) => {
			if (!file.mimetype.startsWith('image/')) {
				cb(new Error('Только изображения разрешены'));
			} else {
				cb(null, true);
			}
		},
	});
}

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Токен отсутствует' });
	}

	jwt.verify(token, config.jwtSecret, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Токен недействителен' });
		}
		req.user = user;
		next();
	});
};


const authenticateAdminToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Токен отсутствует' });
	}

	jwt.verify(token, config.adminTokenSecret, (err, admin) => {
		if (err) {
			return res.status(403).json({ message: 'Токен недействителен' });
		}
		req.admin = admin;
		next();
	});
};


app.post('/upload-photo', authenticateToken, upload.single('photo'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'Файл не загружен' });
		}

		const db = getDB();
		const doctorResult = await db.query('SELECT doctor_id FROM doctors WHERE user_id = $1', [req.user.id]);
		if (!doctorResult.rows[0]) {
			return res.status(404).json({ message: 'Врач не найден' });
		}
		const doctorId = doctorResult.rows[0].doctor_id;

		await db.query('UPDATE doctors SET photo_blob = $1, photo_mime_type = $2 WHERE doctor_id = $3', [req.file.buffer, req.file.mimetype, doctorId]);

		res.json({ message: 'Фото загружено', photo_url: `/doctor/${doctorId}/photo` });
	} catch (error) {
		console.error('Ошибка загрузки фото:', error);
		res.status(500).json({ message: 'Ошибка загрузки файла' });
	}
});


app.get('/doctor/:id/photo', async (req, res) => {
	try {
		const db = getDB();
		const result = await db.query('SELECT photo_blob, photo_mime_type FROM doctors WHERE doctor_id = $1', [req.params.id]);
		if (!result.rows[0] || !result.rows[0].photo_blob) {
			return res.status(404).json({ message: 'Фото не найдено' });
		}
		res.set('Content-Type', result.rows[0].photo_mime_type);
		res.send(result.rows[0].photo_blob);
	} catch (error) {
		console.error('Ошибка получения фото:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

app.post('/register', async (req, res) => {
	const db = getDB();
	const { email, password, role } = req.body;

	try {
		if (!email || !password || !role) {
			return res.status(400).json({ message: 'Все поля обязательны' });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		try {
			const result = await db.query('INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING user_id', [email, passwordHash, parseInt(role, 10)]);
			const userId = result.rows[0].user_id;

			if (parseInt(role, 10) === 1) {
				await db.query('INSERT INTO patients (user_id, first_name, last_name) VALUES ($1, $2, $3)', [userId, '', '']);
			} else {
				await db.query('INSERT INTO doctors (user_id, first_name, last_name, specialization, experience_years) VALUES ($1, $2, $3, $4, $5)', [userId, '', '', '', 0]);
			}

			res.json({ message: 'Регистрация успешна' });
		} catch (dbErr) {
			console.error('Ошибка при INSERT:', dbErr);
			if (dbErr.message.includes('UNIQUE constraint failed')) {
				return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
			}
			return res.status(500).json({ message: 'Ошибка базы данных' });
		}
	} catch (error) {
		console.error('Ошибка в /register:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.post('/login', async (req, res) => {
	const db = getDB();
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res.status(400).json({ message: 'Email и пароль обязательны' });
		}

		const result = await db.query('SELECT user_id AS id, email, password_hash, role_id FROM users WHERE email = $1', [email]);
		const user = result.rows[0];

		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		try {
			const valid = await bcrypt.compare(password, user.password_hash);

			if (!valid) {
				return res.status(401).json({ message: 'Неверный пароль' });
			}

			const token = jwt.sign(
				{ id: user.id, email: user.email, role: user.role_id },
				config.jwtSecret,
				{ expiresIn: '1h' }
			);

			res.json({
				message: 'Вход выполнен успешно',
				token,
				user: { id: user.id, email: user.email, role: user.role_id },
			});
		} catch (error) {
			console.error('Ошибка в bcrypt.compare:', error);
			res.status(500).json({ message: 'Ошибка сервера' });
		}
	} catch (error) {
		console.error('Ошибка в /login:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.get('/profile', authenticateToken, async (req, res) => {
	const db = getDB();
	const user_id = req.user.id;
	const role = req.user.role;

	try {
		if (role === 1) {
			const result = await db.query('SELECT patient_id, user_id, first_name, last_name, phone_number, address FROM patients WHERE user_id = $1', [user_id]);
			return res.json(result.rows[0] || {});
		}

		const result = await db.query('SELECT doctor_id, user_id, first_name, last_name, specialization, experience_years FROM doctors WHERE user_id = $1', [user_id]);
		const profile = result.rows[0] || {};
		if (profile.doctor_id) {
			profile.photo_url = `/doctor/${profile.doctor_id}/photo`;
		}
		res.json(profile);
	} catch (error) {
		console.error('Ошибка в /profile:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.put('/profile', authenticateToken, async (req, res) => {
	const db = getDB();
	const user_id = req.user.id;
	const role = req.user.role;
	const { first_name, last_name, phone_number, address, specialization, experience_years } = req.body;

	try {
		if (role === 1) {
			const result = await db.query(
				'UPDATE patients SET first_name = $1, last_name = $2, phone_number = $3, address = $4 WHERE user_id = $5',
				[first_name, last_name, phone_number, address, user_id]
			);
			
			if (result.rowCount === 0) {
				return res.status(404).json({ message: 'Профиль не найден' });
			}
		} else {
			const result = await db.query(
				'UPDATE doctors SET first_name = $1, last_name = $2, specialization = $3, experience_years = $4 WHERE user_id = $5',
				[first_name, last_name, specialization, experience_years, user_id]
			);
			
			if (result.rowCount === 0) {
				return res.status(404).json({ message: 'Профиль не найден' });
			}
		}
		
		res.json({ message: 'Профиль обновлён' });
	} catch (error) {
		console.error('Ошибка в PUT /profile:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.post('/appointment', authenticateToken, async (req, res) => {
	const db = getDB();
	const { doctor_id, appointment_date, service_type, notes } = req.body;
	const user_id = req.user.id;

	try {
		if (!doctor_id || !appointment_date || !service_type) {
			return res.status(400).json({ message: 'Все поля обязательны' });
		}

		const patientResult = await db.query('SELECT patient_id FROM patients WHERE user_id = $1', [user_id]);
		const patient = patientResult.rows[0];

		if (!patient) {
			return res.status(404).json({ message: 'Профиль пациента не найден' });
		}

		const result = await db.query(
			'INSERT INTO appointments (patient_id, doctor_id, appointment_date, service_type, notes, doctor_notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING appointment_id',
			[patient.patient_id, doctor_id, appointment_date, service_type, notes || '', '', 'new']
		);

		res.json({ message: 'Запись создана', appointment_id: result.rows[0].appointment_id });
	} catch (error) {
		console.error('Ошибка в /appointment:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

app.put('/appointment/:id', authenticateToken, async (req, res) => {
	const db = getDB();
	const { doctor_notes, status } = req.body;
	const appointmentId = req.params.id;
	const user_id = req.user.id;

	if (req.user.role !== 2) {
		return res.status(403).json({ message: 'Нет доступа' });
	}

	try {
		const appointmentResult = await db.query(
			`SELECT a.appointment_id
			FROM appointments a
			JOIN doctors d ON a.doctor_id = d.doctor_id
			WHERE a.appointment_id = $1 AND d.user_id = $2`,
			[appointmentId, user_id]
		);

		if (appointmentResult.rowCount === 0) {
			return res.status(404).json({ message: 'Запись не найдена или недоступна' });
		}

		const validStatus = status === 'completed' ? 'completed' : 'new';

		await db.query(
			'UPDATE appointments SET doctor_notes = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE appointment_id = $3',
			[doctor_notes || '', validStatus, appointmentId]
		);

		res.json({ message: 'Запись обновлена' });
	} catch (error) {
		console.error('Ошибка в PUT /appointment/:id:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

app.delete('/appointment/:id', authenticateToken, async (req, res) => {
	const db = getDB();
	const appointmentId = req.params.id;
	const user_id = req.user.id;

	try {
		const result = await db.query(`
			DELETE FROM appointments
			WHERE appointment_id = $1
			  AND patient_id IN (SELECT patient_id FROM patients WHERE user_id = $2)
		`, [appointmentId, user_id]);

		if (result.rowCount === 0) {
			return res.status(403).json({ message: 'Нет доступа' });
		}
		res.json({ message: 'Удалено' });
	} catch (error) {
		console.error('Ошибка в DELETE /appointment:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

app.get('/appointments', authenticateToken, async (req, res) => {
	const db = getDB();
	const user_id = req.user.id;
	const role = req.user.role;
	const status = req.query.status;

	let statusClause = '';
	const params = [user_id];

	if (status === 'new' || status === 'completed') {
		statusClause = ' AND a.status = $2';
		params.push(status);
	}

	try {
		if (role === 1) {
			const query = `
				SELECT a.*, d.first_name as doctor_first_name, d.last_name as doctor_last_name
				FROM appointments a
				JOIN patients p ON a.patient_id = p.patient_id
				JOIN doctors d ON a.doctor_id = d.doctor_id
				WHERE p.user_id = $1${statusClause}
				ORDER BY a.appointment_date DESC
			`;
			const result = await db.query(query, params);
			
			res.json(result.rows.map((a) => ({
				...a,
				doctor_name: `${a.doctor_first_name} ${a.doctor_last_name}`,
			})));
		} else {
			const query = `
				SELECT a.*, p.first_name as patient_first_name, p.last_name as patient_last_name
				FROM appointments a
				JOIN doctors doc ON a.doctor_id = doc.doctor_id
				JOIN patients p ON a.patient_id = p.patient_id
				WHERE doc.user_id = $1${statusClause}
				ORDER BY a.appointment_date DESC
			`;
			const result = await db.query(query, params);
			
			res.json(result.rows.map((a) => ({
				...a,
				patient_name: `${a.patient_first_name} ${a.patient_last_name}`,
			})));
		}
	} catch (error) {
		console.error('Ошибка в GET /appointments:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

app.get('/doctors', async (req, res) => {
	const db = getDB();

	try {
		const doctors = await db.query('SELECT doctor_id, user_id, first_name, last_name, specialization, experience_years FROM doctors', []);
		res.json(doctors.rows || []);
	} catch (error) {
		console.error('Ошибка в GET /doctors:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.post('/admin/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		if (email !== config.adminEmail || password !== config.adminPassword) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		const token = jwt.sign({ email: config.adminEmail }, config.adminTokenSecret, {
			expiresIn: '24h',
		});
		res.json({ token });
	} catch (error) {
		console.error('Ошибка в /admin/login:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.get('/admin/doctors', authenticateAdminToken, async (req, res) => {
	const db = getDB();

	try {
		const result = await db.query(`
			SELECT d.*, u.email FROM doctors d 
			LEFT JOIN users u ON d.user_id = u.user_id
		`, []);
		res.json(result.rows || []);
	} catch (error) {
		console.error('Ошибка в GET /admin/doctors:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.get('/admin/users', authenticateAdminToken, async (req, res) => {
	const db = getDB();

	try {
		const result = await db.query('SELECT * FROM users', []);
		res.json(result.rows || []);
	} catch (error) {
		console.error('Ошибка в GET /admin/users:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.get('/admin/appointments', authenticateAdminToken, async (req, res) => {
	const db = getDB();

	try {
		const result = await db.query(`
			SELECT a.*, 
				p.first_name || ' ' || p.last_name as patient_name,
				d.first_name || ' ' || d.last_name as doctor_name
			FROM appointments a
			LEFT JOIN patients p ON p.patient_id = a.patient_id
			LEFT JOIN doctors d ON d.doctor_id = a.doctor_id
		`, []);
		res.json(result.rows || []);
	} catch (error) {
		console.error('Ошибка в GET /admin/appointments:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.delete('/admin/doctors/:id', authenticateAdminToken, async (req, res) => {
	const db = getDB();
	const doctorId = req.params.id;

	try {
		const result = await db.query('DELETE FROM doctors WHERE doctor_id = $1', [doctorId]);
		
		if (result.rowCount === 0) {
			return res.status(404).json({ message: 'Врач не найден' });
		}
		res.json({ message: 'Врач удалён' });
	} catch (error) {
		console.error('Ошибка в DELETE /admin/doctors:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.delete('/admin/users/:id', authenticateAdminToken, async (req, res) => {
	const db = getDB();
	const userId = req.params.id;

	try {
		const result = await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
		
		if (result.rowCount === 0) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		res.json({ message: 'Пользователь удалён' });
	} catch (error) {
		console.error('Ошибка в DELETE /admin/users:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


app.delete('/admin/appointments/:id', authenticateAdminToken, async (req, res) => {
	const db = getDB();
	const appointmentId = req.params.id;

	try {
		const result = await db.query('DELETE FROM appointments WHERE appointment_id = $1', [appointmentId]);
		
		if (result.rowCount === 0) {
			return res.status(404).json({ message: 'Запись не найдена' });
		}
		res.json({ message: 'Запись удалена' });
	} catch (error) {
		console.error('Ошибка в DELETE /admin/appointments:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});


// Serve React app (both production and development)
const buildPath = path.join(__dirname, '../build');
console.log('Checking for React build at:', buildPath);
console.log('Build folder exists:', fs.existsSync(buildPath));

// Serve static files from build directory
app.use(express.static(buildPath));

// Catch all other routes and serve index.html for React Router (must be last)
app.use((req, res) => {
	const indexPath = path.join(buildPath, 'index.html');
	res.sendFile(indexPath, (err) => {
		if (err) {
			console.error('Error serving index.html:', err);
			res.status(404).json({ message: 'Page not found' });
		}
	});
});

app.use((err, req, res, next) => {
	console.error('Необработанная ошибка:', err);
	res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

module.exports = app;
