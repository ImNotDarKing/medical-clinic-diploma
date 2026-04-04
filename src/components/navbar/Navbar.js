import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; 
import tooth from "./../../img/icons/bolnitsa_wdvaktykbnh5.svg";
import userProfile from "./../../img/icons/polzovatel_tkik1364y7on.svg";

import "./style.css";

const Navbar = () => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false); 
    const [isDoctor, setIsDoctor] = useState(false); 

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
            
            if (token) {
                try {
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    setIsDoctor(decoded.role === 2);
                } catch (e) {
                    setIsDoctor(false);
                }
            } else {
                setIsDoctor(false);
            }
        };

        checkAuth();
        window.addEventListener("authChange", checkAuth);
        return () => window.removeEventListener("authChange", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setShowProfileMenu(false);
        window.location.href = "/auth"; 
    };

    const handleProtectedClick = (path) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
        } else {
            navigate(path);
        }
    };

    return ( 
        <nav className="nav">
            <div className="container">
                <div className="nav-row">
                    <img src={tooth} className="icon-img" alt="Иконка клиники"/>
                    <Link to="/" className="logo"><strong>HealthCare</strong> Clinic</Link>

                    <ul className="nav-list">
                        <li className="nav-list__item">
                            <Link 
                                to="/" 
                                className={`nav-list__link ${location.pathname === "/" ? "nav-list__link--active" : ""}`}
                            >
                                Клиника
                            </Link>
                        </li>
                        
                        {!isDoctor && (
                            <li className="nav-list__item">
                                <div 
                                    className={`nav-list__link ${location.pathname === "/doctors" ? "nav-list__link--active" : ""}`}
                                    onClick={() => handleProtectedClick("/doctors")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Врачи
                                </div>
                            </li>
                        )}
                        
                        <li className="nav-list__item">
                            <Link 
                                to="/contacts" 
                                className={`nav-list__link ${location.pathname === "/contacts" ? "nav-list__link--active" : ""}`}
                            >
                                Контакты
                            </Link>
                        </li>
                        {!isLoggedIn ? (
                            <li className="nav-list__item">
                                <Link to="/auth" className="nav-list__link">Вход</Link>
                            </li>
                        ) : (
                            <li className="nav-list__item profile-menu">
                                <div 
                                    className="profile-icon" 
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                   <img src={userProfile} className="icon-img" alt="Иконка профиля"/>
                                </div>
                                {showProfileMenu && (
                                    <div className="profile-dropdown">
                                        <div className="profile-option" onClick={() => navigate("/profile")}>Профиль</div>
                                        <div className="profile-option" onClick={handleLogout}>Выйти</div>
                                    </div>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
 
export default Navbar;