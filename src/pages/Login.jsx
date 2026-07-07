import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    
    const [error, setError] = useState("");
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    
    const submitLogin = async (e) => {
        e.preventDefault();
        
        try {
            setError("");
            
            const user = await login(form.email, form.password);
            
            if (user.role !== "admin") {
                setError("Bu bo‘lim faqat admin uchun.");
                return;
            }
            
            navigate("/admin/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Login xatosi");
        }
    };
    
    return (
        <div className="container auth-page">
        <form onSubmit={submitLogin} className="auth-form">
        <h1>Admin panelga kirish</h1>
        
        {error && <p className="error-text">{error}</p>}
        
        <label>
        Email
        <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Admin email"
        />
        </label>
        
        <label>
        Parol
        <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Admin parol"
        />
        </label>
        
        <button className="btn" type="submit">
        Kirish
        </button>
        </form>
        </div>
    );
}

export default Login;