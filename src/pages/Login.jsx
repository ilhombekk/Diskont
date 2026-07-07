import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            
            if (user.role === "admin") {
                navigate("/admin/products");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login xatosi");
        }
    };
    
    return (
        <div className="container auth-page">
        <form onSubmit={submitLogin} className="auth-form">
        <h1>Login</h1>
        
        {error && <p className="error-text">{error}</p>}
        
        <label>
        Email
        <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        />
        </label>
        
        <label>
        Parol
        <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Parol"
        />
        </label>
        
        <button className="btn" type="submit">
        Kirish
        </button>
        
        <p>
        Akkount yo‘qmi? <Link to="/register">Ro‘yxatdan o‘tish</Link>
        </p>
        </form>
        </div>
    );
}

export default Login;