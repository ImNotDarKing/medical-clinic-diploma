import { useState } from 'react';
import API_BASE_URL from "../../api/config";
import './style.css';

const reviewsData = [
  { id: 1, name: 'Анна Петрова', text: 'Отличная клиника! Врачи профессионалы, обслуживание на высоте.', img: '/img/reviews/anna.jpg' },
  { id: 2, name: 'Иван Сидоров', text: 'Спасибо за качественное лечение. Рекомендую всем!', img: '/img/reviews/ivan.jpg' },
  { id: 3, name: 'Мария Иванова', text: 'Клиника помогла мне восстановиться после травмы. Очень довольна.', img: '/img/reviews/maria.jpg' },
  { id: 4, name: 'Алексей Кузнецов', text: 'Удобное расположение, вежливый персонал. Буду обращаться еще.', img: '/img/reviews/alexey.jpg' },
  { id: 5, name: 'Елена Смирнова', text: 'Высокий уровень медицины. Цены приемлемые.', img: '/img/reviews/elena.jpg' },
  { id: 6, name: 'Дмитрий Попов', text: 'Операция прошла успешно. Врачи настоящие специалисты.', img: '/img/reviews/dmitry.jpg' },
  { id: 7, name: 'Ольга Васильева', text: 'Хорошая клиника для всей семьи. Детям тоже нравится.', img: '/img/reviews/olga.jpg' },
  { id: 8, name: 'Сергей Николаев', text: 'Быстрое обслуживание, без очередей. Спасибо!', img: '/img/reviews/sergey.jpg' },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  const nextReviews = () => {
    setCurrentIndex((prev) => (prev + 2) % reviewsData.length);
  };

  const prevReviews = () => {
    setCurrentIndex((prev) => (prev - 2 + reviewsData.length) % reviewsData.length);
  };

  const handleImgError = (id) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const currentReviews = [
    reviewsData[currentIndex],
    reviewsData[(currentIndex + 1) % reviewsData.length],
  ];

  return (
    <section className="reviews-section">
      <div className="container">
        <h2 className="title-1">Отзывы пациентов</h2>
        <div className="reviews-container">
          <button className="reviews-arrow reviews-arrow-left" onClick={prevReviews}>&lt;</button>
          <div className="reviews-grid">
            {currentReviews.map(review => (
              <div key={review.id} className="review-card">
                <img 
                  src={imgErrors[review.id] ? 'https://via.placeholder.com/80x80?text=No+Photo' : `${API_BASE_URL}${review.img}`} 
                  alt={review.name} 
                  className="review-img" 
                  onError={() => handleImgError(review.id)}
                />
                <h3 className="review-name">{review.name}</h3>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
          <button className="reviews-arrow reviews-arrow-right" onClick={nextReviews}>&gt;</button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;