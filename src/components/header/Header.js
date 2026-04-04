import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Header = () => {
    const navigate = useNavigate();
    const [isDoctor, setIsDoctor] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setIsDoctor(decoded.role === 2);
            } catch (e) {
                setIsDoctor(false);
            }
        }
    }, []);

    const handleAppointmentClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
        } else if (isDoctor) {
            navigate("/profile"); 
        } else {
            navigate("/doctors");
        }
    };

    return (
        <header className="header">
            <div className="header__wrapper">
                <h1 className="header__title">
                    <strong>
                        {isDoctor ? "Добро пожаловать, доктор" : "Медицинская клиника"} <em>HealthCare</em>
                    </strong>
                    <br />
                    {isDoctor ? "Ведите лечение и управляйте приёмами" : "Профессиональная медицинская помощь"}
                </h1>
                <div className="header__text">
                    <p>
                        {isDoctor 
                            ? "Просмотрите и управляйте всеми приёмами пациентов"
                            : "Наша клиника предлагает полный спектр медицинских услуг: от профилактики до лечения. Опытные врачи, современное оборудование и индивидуальный подход к каждому пациенту."
                        }
                    </p>
                </div>
                <button className="btn" onClick={handleAppointmentClick}>
                    {isDoctor ? "Мои пациенты" : "Записаться на приём"}
                </button>
            </div>
        </header>
    );
};

export default Header;