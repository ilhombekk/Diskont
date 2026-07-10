import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="site-footer">
        <div className="footer-top-line"></div>
        
        <div className="container footer-content">
        <div className="footer-brand">
        <Link to="/" className="footer-logo">
        DISKONT
        </Link>
        
        <p>
        Возникли вопросы? Звоните <br />
        в наш контакт-центр:
        </p>
        
        <h3>+998 99 818 00 25</h3>
        
        <p>Работаем ежедневно:</p>
        
        <h3>Пн-Сб: 9:00 - 21:00</h3>
        
        <div className="footer-socials">
        <a href="#">◎</a>
        <a href="#">✈</a>
        <a href="#">f</a>
        </div>
        </div>
        
        <div className="footer-column">
        <h4>Каталог</h4>
        <Link to="/?category=Смартфоны#products">Смартфоны</Link>
        <Link to="/?category=Кондиционеры#products">Кондиционеры</Link>
        <Link to="/?category=Ноутбуки#products">Ноутбуки</Link>
        <Link to="/?category=Телевизоры#products">Телевизоры</Link>
        <Link to="/?category=Холодильники#products">Холодильники</Link>
        <Link to="/?category=Морозильник#products">Морозильник</Link>
        <Link to="/?category=Стиральные машины#products">
        Стиральные машины
        </Link>
        <Link to="/?category=Утюги#products">Утюги</Link>
        <Link to="/?category=Отпариватели#products">Отпариватели</Link>
        <Link to="/?category=Мини печи#products">Мини печи</Link>
        <Link to="/?category=Пылесосы#products">Пылесосы</Link>
        <Link to="/?category=Принтеры#products">Принтеры</Link>
        </div>
        
        <div className="footer-column">
        <h4>Информация</h4>
        <a href="#">Наши магазины</a>
        <a href="#">Способы оплаты</a>
        <a href="#">Рассрочка</a>
        <a href="#">Возврат и обмен</a>
        <a href="#">Доставка</a>
        </div>
        
        <div className="footer-payments">
        <h4>Способы оплаты</h4>
        
        <div className="payment-grid">
        <div>UZCARD</div>
        <div>HUMO</div>
        <div>VISA</div>
        <div>CLICK</div>
        <div>PAYME</div>
        <div>Mastercard</div>
        </div>
        </div>
        </div>
        
        <div className="footer-bottom">
        <div className="container footer-bottom-content">
        <p>OOO «Diskont» © 2026. Все права защищены</p>
        
        <button
        type="button"
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
        ↑
        </button>
        </div>
        </div>
        </footer>
    );
}

export default Footer;