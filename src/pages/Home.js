import Header from "./../components/header/Header";
import Reviews from "./../components/reviews/reviews";

const Home = () => {
    return ( 
        <>
            <Header />

            <main className="section">
                <div className="container">

                    <ul className="content-list">
                        <li className="content-list__item">
                            <h2 className="title-2">Ваше здоровье в надёжных руках</h2>
                            <p>Наша медицинская клиника предлагает полный спектр услуг: от профилактики заболеваний до комплексного лечения. Мы заботимся о вашем здоровье с использованием современных технологий и индивидуального подхода. Наши опытные специалисты обеспечат качественную медицинскую помощь для всей семьи.</p>
                        </li>
                    </ul>

                </div>
            </main>

            <Reviews />
        </>
    );
}
 
export default Home;