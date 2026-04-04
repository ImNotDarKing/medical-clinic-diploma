import iconVK from "../img/icons/vk.svg";
import iconInstagram from "../img/icons/instagram.svg";
import iconFacebook from "../img/icons/twitter.svg";

const Contacts = () => {
    return ( 
        <main className="section contacts-section">
            <div className="container">
                <h1 className="title-1">Контакты медицинской клиники</h1>
                <div className="contacts-grid">
                    <div className="contact-card">
                        <h2 className="title-2">Адрес</h2>
                        <p>Россия, г. Москва, ул. Здоровья, д. 10</p>
                    </div>
                    <div className="contact-card">
                        <h2 className="title-2">Телефон</h2>
                        <p><a href="tel:+74951234567">+7 (495) 123-45-67</a></p>
                    </div>
                    <div className="contact-card">
                        <h2 className="title-2">Email</h2>
                        <p><a href="mailto:info@healthcare-clinic.ru">info@healthcare-clinic.ru</a></p>
                    </div>
                    <div className="contact-card">
                        <h2 className="title-2">Часы работы</h2>
                        <p>Пн-Пт: 10:00 - 20:00</p>
                        <p>Сб-Вс: Выходные</p>
                    </div>
                    <div className="contact-card">
                        <h2 className="title-2">Карта</h2>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.5!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a50b315e573%3A0xa886bf5a3d9b2e68!2z0JzQsNCy0LjQvdCw!5e0!3m2!1sen!2sru!4v1234567890!5m2!1sen!2sru" 
                            width="100%" 
                            height="200" 
                            style={{border:0}} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Карта расположения клиники">
                        </iframe>
                    </div>
                    <div className="contact-card">
                        <h2 className="title-2">Социальные сети</h2>
                        <p>Следите за нами:</p>
                        <br/>
                        <p><a href="https://vk.com/healthcareclinic" target="_blank" rel="noopener noreferrer"><img src={iconVK} alt="VK" /> VK</a></p>
                        <br/>
                        <p><a href="https://instagram.com/healthcareclinic" target="_blank" rel="noopener noreferrer"><img src={iconInstagram} alt="Instagram" /> Instagram</a></p>
                        <br/>
                        <p><a href="https://facebook.com/healthcareclinic" target="_blank" rel="noopener noreferrer"><img src={iconFacebook} alt="Facebook" /> Facebook</a></p>
                    </div>
                </div>
            </div>
        </main>
    );
}
 
export default Contacts;