import { useEffect, useState } from "react";
import api from "../api/api";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        oldPrice: "",
        imageUrl: "",
        imageFile: null,
        description: "",
        stock: "",
        isHit: false,
        isFeatured: false,
    });
    
    const [previewImage, setPreviewImage] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    
    const [importFile, setImportFile] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const [importErrors, setImportErrors] = useState([]);
    
    const getProducts = async () => {
        const response = await api.get("/products");
        setProducts(response.data);
    };
    
    useEffect(() => {
        getProducts();
    }, []);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
        
        if (name === "imageUrl") {
            setPreviewImage(value);
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        setForm({
            ...form,
            imageFile: file,
        });
        
        setPreviewImage(URL.createObjectURL(file));
    };
    
    const resetForm = () => {
        setForm({
            name: "",
            category: "",
            price: "",
            oldPrice: "",
            imageUrl: "",
            imageFile: null,
            description: "",
            stock: "",
            isHit: false,
            isFeatured: false,
        });
        
        setPreviewImage("");
        setEditingId(null);
        setError("");
    };
    
    const submitProduct = async (e) => {
        e.preventDefault();
        
        try {
            setError("");
            
            const formData = new FormData();
            
            formData.append("name", form.name);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("oldPrice", form.oldPrice);
            formData.append("description", form.description);
            formData.append("stock", form.stock);
            formData.append("isHit", form.isHit);
            formData.append("isFeatured", form.isFeatured);
            
            if (form.imageUrl) {
                formData.append("imageUrl", form.imageUrl);
            }
            
            if (form.imageFile) {
                formData.append("imageFile", form.imageFile);
            }
            
            if (editingId) {
                await api.put(`/products/${editingId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                await api.post("/products", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            
            resetForm();
            getProducts();
        } catch (error) {
            setError(error.response?.data?.message || "Mahsulot saqlashda xatolik");
        }
    };
    
    const editProduct = (product) => {
        setEditingId(product._id);
        
        setForm({
            name: product.name || "",
            category: product.category || "",
            price: product.price || "",
            oldPrice: product.oldPrice || "",
            imageUrl: product.image || "",
            imageFile: null,
            description: product.description || "",
            stock: product.stock || "",
            isHit: Boolean(product.isHit),
            isFeatured: Boolean(product.isFeatured),
        });
        
        setPreviewImage(product.image);
    };
    
    const deleteProduct = async (id) => {
        if (!confirm("Rostdan o‘chirasizmi?")) return;
        
        await api.delete(`/products/${id}`);
        getProducts();
    };
    
    const handleImport = async (e) => {
        e.preventDefault();
        
        if (!importFile) {
            alert("CSV fayl tanlang");
            return;
        }
        
        try {
            setImportLoading(true);
            setImportMessage("");
            setImportErrors([]);
            
            const formData = new FormData();
            formData.append("file", importFile);
            
            const response = await api.post("/products/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            setImportMessage(response.data.message);
            setImportFile(null);
            
            getProducts();
        } catch (error) {
            setImportMessage(error.response?.data?.message || "Import xatosi");
            setImportErrors(error.response?.data?.errors || []);
        } finally {
            setImportLoading(false);
        }
    };
    
    const downloadExampleCsv = () => {
        const csv = `name,category,price,oldPrice,imageUrl,description,stock,isHit,isFeatured
iPhone 17,telefon,15000000,17000000,https://img.mvideo.ru/Pdb/401192600b.jpg,lorem,4,true,true
Samsung TV,Televizor,4200000,5000000,https://example.com/tv.jpg,Smart TV 43 dyuym,10,false,true
LG Kir yuvish mashinasi,Kir yuvish mashinasi,5500000,6200000,https://example.com/lg.jpg,8 kg inverter motor,6,true,false`;
        
        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.href = url;
        link.setAttribute("download", "products-example.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="container">
        <h1>Admin panel — Mahsulotlar</h1>
        
        <div className="import-box">
        <div>
        <h2>CSV orqali mahsulot import qilish</h2>
        <p>
        Ko‘p mahsulotni birdan yuklash uchun CSV fayl tanlang. Rasm uchun
        imageUrl ustuniga rasm linkini yozing.
        </p>
        </div>
        
        <form onSubmit={handleImport} className="import-form">
        <input
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => setImportFile(e.target.files[0])}
        />
        
        <button type="submit" className="btn" disabled={importLoading}>
        {importLoading ? "Import qilinmoqda..." : "Import qilish"}
        </button>
        
        <button
        type="button"
        className="secondary-btn"
        onClick={downloadExampleCsv}
        >
        Namuna CSV yuklash
        </button>
        </form>
        
        {importMessage && <p className="import-message">{importMessage}</p>}
        
        {importErrors.length > 0 && (
            <div className="import-errors">
            {importErrors.map((item, index) => (
                <p key={index}>{item}</p>
            ))}
            </div>
        )}
        </div>
        
        <form onSubmit={submitProduct} className="admin-form">
        <h2>{editingId ? "Mahsulotni tahrirlash" : "Mahsulot qo‘shish"}</h2>
        
        {error && <p className="error-text">{error}</p>}
        
        <input
        name="name"
        placeholder="Mahsulot nomi"
        value={form.name}
        onChange={handleChange}
        />
        
        <input
        name="category"
        placeholder="Kategoriya"
        value={form.category}
        onChange={handleChange}
        />
        
        <input
        name="price"
        type="number"
        placeholder="Narx"
        value={form.price}
        onChange={handleChange}
        />
        
        <input
        name="oldPrice"
        type="number"
        placeholder="Eski narx"
        value={form.oldPrice}
        onChange={handleChange}
        />
        
        <input
        name="stock"
        type="number"
        placeholder="Soni"
        value={form.stock}
        onChange={handleChange}
        />
        
        <div className="checkbox-row">
        <label>
        <input
        type="checkbox"
        name="isHit"
        checked={form.isHit}
        onChange={handleChange}
        />
        Hit mahsulot
        </label>
        
        <label>
        <input
        type="checkbox"
        name="isFeatured"
        checked={form.isFeatured}
        onChange={handleChange}
        />
        Tavsiya qilingan
        </label>
        </div>
        
        <div className="image-upload-box">
        <label>
        Rasm URL orqali
        <input
        name="imageUrl"
        placeholder="https://example.com/image.jpg"
        value={form.imageUrl}
        onChange={handleChange}
        />
        </label>
        
        <div className="upload-divider">yoki</div>
        
        <label>
        Kompyuterdan rasm yuklash
        <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        
        {previewImage && (
            <div className="image-preview">
            <p>Rasm preview:</p>
            <img src={previewImage} alt="Preview" />
            </div>
        )}
        </div>
        
        <textarea
        name="description"
        placeholder="Mahsulot haqida"
        value={form.description}
        onChange={handleChange}
        />
        
        <div className="admin-form-actions">
        <button type="submit" className="btn">
        {editingId ? "Saqlash" : "Qo‘shish"}
        </button>
        
        {editingId && (
            <button type="button" onClick={resetForm} className="secondary-btn">
            Bekor qilish
            </button>
        )}
        </div>
        </form>
        
        <div className="admin-table-wrapper">
        <table className="admin-table">
        <thead>
        <tr>
        <th>Rasm</th>
        <th>Nomi</th>
        <th>Kategoriya</th>
        <th>Narx</th>
        <th>Eski narx</th>
        <th>Soni</th>
        <th>Badge</th>
        <th>Amal</th>
        </tr>
        </thead>
        
        <tbody>
        {products.map((product) => (
            <tr key={product._id}>
            <td>
            <img src={product.image} alt={product.name} />
            </td>
            
            <td>{product.name}</td>
            
            <td>{product.category}</td>
            
            <td>{product.price.toLocaleString()} so‘m</td>
            
            <td>
            {product.oldPrice
                ? `${product.oldPrice.toLocaleString()} so‘m`
                : "-"}
                </td>
                
                <td>{product.stock}</td>
                
                <td>
                {product.isHit && <span className="small-badge">Hit</span>}
                {product.isFeatured && (
                    <span className="small-badge feature">Top</span>
                )}
                </td>
                
                <td>
                <button
                onClick={() => editProduct(product)}
                className="small-btn"
                >
                Edit
                </button>
                
                <button
                onClick={() => deleteProduct(product._id)}
                className="small-delete-btn"
                >
                Delete
                </button>
                </td>
                </tr>
            ))}
            
            {products.length === 0 && (
                <tr>
                <td colSpan="8">Mahsulotlar yo‘q</td>
                </tr>
            )}
            </tbody>
            </table>
            </div>
            </div>
        );
    }
    
    export default AdminProducts;