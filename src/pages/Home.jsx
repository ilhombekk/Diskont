import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import api from "../api/api";

function Home() {
    const [products, setProducts] = useState([]);
    
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Barchasi");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    
    const [loading, setLoading] = useState(false);
    
    const categories = [
        "Barchasi",
        "Muzlatgich",
        "Kir yuvish mashinasi",
        "Televizor",
        "Changyutgich",
        "Konditsioner",
        "Mikroto‘lqinli pech",
        "Smartfon",
        "Noutbuk",
    ];
    
    const getProducts = async () => {
        try {
            setLoading(true);
            
            const response = await api.get("/products", {
                params: {
                    search,
                    category: selectedCategory,
                    minPrice,
                    maxPrice,
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
    }, [search, selectedCategory, minPrice, maxPrice]);
    
    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("Barchasi");
        setMinPrice("");
        setMaxPrice("");
    };
    
    return (
        <div className="home-page">
        <div className="container">
        <section className="diskont-hero">
        <div className="hero-content">
        <span className="hero-label">Texnika va elektronika</span>
        <h1>Maishiy texnikalarni qulay narxlarda xarid qiling</h1>
        <p>
        Televizor, muzlatgich, konditsioner, kir yuvish mashinasi va
        boshqa texnikalar uchun zamonaviy online do‘kon.
        </p>
        
        <div className="hero-actions">
        <button>Katalogni ko‘rish</button>
        <span>12 oygacha muddatli to‘lov</span>
        </div>
        </div>
        
        <div className="hero-card">
        <p>Bugungi taklif</p>
        <h2>Chegirmalar</h2>
        <span>Eng yaxshi narxlar</span>
        </div>
        </section>
        
        <section className="popular-categories">
        <div className="section-head">
        <h2>Mashhur kategoriyalar</h2>
        </div>
        
        <div className="popular-category-grid">
        {categories
            .filter((item) => item !== "Barchasi")
            .slice(0, 6)
            .map((category) => (
                <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={
                    selectedCategory === category ? "popular-active" : ""
                }
                >
                <span>🔌</span>
                {category}
                </button>
            ))}
            </div>
            </section>
            
            <section className="products-section">
            <div className="section-head">
            <h2>Mahsulotlar</h2>
            <button onClick={clearFilters} className="clear-filter-btn">
            Filtrlarni tozalash
            </button>
            </div>
            
            <div className="filters-panel diskont-filters">
            <div className="search-box">
            <input
            type="text"
            placeholder="Mahsulot qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            </div>
            
            <div className="price-filter">
            <input
            type="number"
            placeholder="Min narx"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            />
            
            <input
            type="number"
            placeholder="Max narx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            />
            </div>
            </div>
            
            <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            />
            
            {loading ? (
                <h2>Yuklanmoqda...</h2>
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