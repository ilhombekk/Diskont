import { useEffect, useState } from "react";
import api from "../api/api";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        imageUrl: "",
        imageFile: null,
        description: "",
        stock: "",
    });
    
    const [previewImage, setPreviewImage] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    
    const getProducts = async () => {
        const response = await api.get("/products");
        setProducts(response.data);
    };
    
    useEffect(() => {
        getProducts();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setForm({
            ...form,
            [name]: value,
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
            imageUrl: "",
            imageFile: null,
            description: "",
            stock: "",
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
            formData.append("description", form.description);
            formData.append("stock", form.stock);
            
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
            name: product.name,
            category: product.category,
            price: product.price,
            imageUrl: product.image,
            imageFile: null,
            description: product.description,
            stock: product.stock,
        });
        
        setPreviewImage(product.image);
    };
    
    const deleteProduct = async (id) => {
        if (!confirm("Rostdan o‘chirasizmi?")) return;
        
        await api.delete(`/products/${id}`);
        getProducts();
    };
    
    return (
        <div className="container">
        <h1>Admin panel — Mahsulotlar</h1>
        
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
        name="stock"
        type="number"
        placeholder="Soni"
        value={form.stock}
        onChange={handleChange}
        />
        
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
        <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        />
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
        <th>Soni</th>
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
            
            <td>{product.stock}</td>
            
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
            <td colSpan="6">Mahsulotlar yo‘q</td>
            </tr>
        )}
        </tbody>
        </table>
        </div>
        </div>
    );
}

export default AdminProducts;