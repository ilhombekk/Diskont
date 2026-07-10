import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../api/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getProducts = async () => {
        try {
            setLoading(true);
            
            const response = await api.get("/products");
            
            setProducts(response.data);
        } catch (error) {
            console.error("Mahsulotlarni olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getProducts();
    }, []);
    
    return (
        <div className="home-page">
        <section className="promo-hero">
        <div className="promo-left">
        <div className="promo-products">
        <div className="promo-tv"></div>
        <div className="promo-fridge"></div>
        <div className="promo-washer"></div>
        <div className="promo-phone"></div>
        </div>
        </div>
        
        <div className="promo-right">
        <h1>-55%</h1>
        <span>GACHA</span>
        <h2>CHEGIRMALAR</h2>
        <p>8-9-10-11-12-IYUL KUNLARI</p>
        
        <a href="#products" className="promo-btn">
        Katalogni ko‘rish
        </a>
        </div>
        </section>
        
        <div className="container">
        <section className="black-section">
        <div className="section-head dark-head">
        <h2>Mashhur kategoriyalar</h2>
        </div>
        
        <div className="popular-category-grid">
        <button>
        <span>◆</span>
        Смартфоны
        </button>
        
        <button>
        <span>◆</span>
        Кондиционеры
        </button>
        
        <button>
        <span>◆</span>
        Ноутбуки
        </button>
        
        <button>
        <span>◆</span>
        Телевизоры
        </button>
        
        <button>
        <span>◆</span>
        Холодильники
        </button>
        
        <button>
        <span>◆</span>
        Стиральные машины
        </button>
        
        <button>
        <span>◆</span>
        Морозильник
        </button>
        
        <button>
        <span>◆</span>
        Мини печи
        </button>
        </div>
        </section>
        
        <section className="products-section" id="products">
        <div className="section-head">
        <h2>Mahsulotlar</h2>
        </div>
        
        {loading ? (
            <h2 className="loading-text">Yuklanmoqda...</h2>
        ) : (
            <div className="products-grid diskont-products-grid">
            {products.length > 0 ? (
                products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))
            ) : (
                <p>Mahsulot topilmadi.</p>
            )}
            </div>
        )}
        </section>
        </div>
        </div>
    );
}

export default Home;