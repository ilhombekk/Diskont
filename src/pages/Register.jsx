import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [form, setForm] = useState({
        name: "",
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
    
    const submitRegister = async (e) => {
        e.preventDefault();
        
        try {
            setError("");
            
            const user = await register(form.name, form.email, form.password);
            
            if (user.role === "admin") {
                navigate("/admin/products");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Register xatosi");
        }
    };
    
    return (
        <div className="container auth-page">
        <form onSubmit={submitRegister} className="auth-form">
        <h1>Register</h1>
        
        {error && <p className="error-text">{error}</p>}
        
        <label>
        Ism
        <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Ismingiz"
        />
        </label>
        
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
        Ro‘yxatdan o‘tish
        </button>
        
        <p>
        Akkount bormi? <Link to="/login">Login</Link>
        </p>
        </form>
        </div>
    );
}

export default Register;