import { useState } from "react";
import AppointmentModal from "../appointment/AppointmentModal";
import API_BASE_URL from "../../api/config";
import defaultDoctor from "../../img/default-doctor.svg";
import "./style.css";

const Doctor = ({ id, title, specialization }) => {
    const [showModal, setShowModal] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleImgError = () => {
        console.log("Ошибка загрузки изображения для врача:", id, "URL:", `${API_BASE_URL}/doctor/${id}/photo`);
        setImgError(true);
    };

    return (
        <>
            <li className="doctor">
                <div onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
                    <img 
                        src={imgError ? defaultDoctor : `${API_BASE_URL}/api/doctor/${id}/photo`}
                        alt={title} 
                        className="doctor__img"
                        onError={handleImgError}
                    />
                    <h3 className="doctor__title">{title}</h3>
                    {specialization && <p className="doctor__specialty">{specialization}</p>}
                </div>
            </li>

            {showModal && (
                <AppointmentModal
                    doctorId={id}
                    doctorName={title}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default Doctor;