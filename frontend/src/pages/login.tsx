import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogIn: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const nav=useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      nav('/home')
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setErrors({});
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", form);
      console.log(res.data);
      localStorage.setItem("token", res.data.access);
      alert("User logged in successfully!");
      nav('/home')
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="bg-gray-900 h-screen flex justify-center items-center">
        <div className="card px-8 py-6 rounded-lg w-92 flex bg-white justify-center items-center flex-col mx-auto mt-20">
          <h1 className="text-center font-bold text-3xl text-gray-600">Login</h1>
          <form className="my-6" onSubmit={handleSubmit}> 
            <input
              className="p-2 my-2 rounded w-full focus:outline-blue-600 border-1 border-gray-400"
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <input
              className="p-2 my-2 rounded w-full focus:outline-blue-600 border-1 border-gray-400"
              placeholder="Password"
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded mt-4">
              Login
            </button>
          </form>
          <div className="text-gray-500">
            Don't have an account? <a href="/signup" className="text-blue-400">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
