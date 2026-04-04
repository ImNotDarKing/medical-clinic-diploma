import { useState, useEffect } from "react";
import Doctor from '../components/doctor/Doctor';
import API_BASE_URL from '../api/config';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/doctors`);
                const data = await response.json();
                console.log("Загруженные врачи:", data);
                setDoctors(data);
            } catch (err) {
                console.error("Ошибка загрузки врачей:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDoctors();
    }, []);

    if (loading) return <div>Загрузка...</div>;

    return ( 
        <main className="section doctors-section">
            <div className="container">
                <h1 className="title-1">Наши врачи</h1>
                <p className="doctors-description">Выберите врача из списка и нажмите на карточку, чтобы открыть форму записи на прием.</p>
                <ul className="doctors">
                {doctors.map((doctor) => (
                    <Doctor 
                        key={doctor.doctor_id}
                        id={doctor.doctor_id} 
                        title={`${doctor.first_name} ${doctor.last_name}`}
                        specialization={doctor.specialization}
                    />
                ))}
                </ul>
            </div>
        </main> 
    );
}
 
export default Doctors;