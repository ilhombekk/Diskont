import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api/api";

function Home() {
    const [searchParams] = useSearchParams();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    
    const getProducts = async () => {
        try {
            setLoading(true);
            
            const response = await api.get("/products", {
                params: {
                    search,
                    category: category || "Barchasi",
                },
            });
            
            setProducts(response.data);
        } catch (error) {
            console.error("Mahsulotlarni olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getProducts();
    }, [search, category]);
    
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
        <a href="/?category=Смартфоны#products">
        <span>◆</span>
        Смартфоны
        </a>
        
        <a href="/?category=Кондиционеры#products">
        <span>◆</span>
        Кондиционеры
        </a>
        
        <a href="/?category=Ноутбуки#products">
        <span>◆</span>
        Ноутбуки
        </a>
        
        <a href="/?category=Телевизоры#products">
        <span>◆</span>
        Телевизоры
        </a>
        
        <a href="/?category=Холодильники#products">
        <span>◆</span>
        Холодильники
        </a>
        
        <a href="/?category=Стиральные машины#products">
        <span>◆</span>
        Стиральные машины
        </a>
        
        <a href="/?category=Морозильник#products">
        <span>◆</span>
        Морозильник
        </a>
        
        <a href="/?category=Мини печи#products">
        <span>◆</span>
        Мини печи
        </a>
        </div>
        </section>
        
        <section className="products-section" id="products">
        <div className="section-head">
        <div>
        <h2>Mahsulotlar</h2>
        
        {(search || category) && (
            <p className="active-filter-text">
            {search && <>Qidiruv: <b>{search}</b></>}
            {search && category && " | "}
            {category && <>Kategoriya: <b>{category}</b></>}
            </p>
        )}
        </div>
        
        {(search || category) && (
            <a href="/#products" className="clear-filter-btn">
            Filtrlarni tozalash
            </a>
        )}
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