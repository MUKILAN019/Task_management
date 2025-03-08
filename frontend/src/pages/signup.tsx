import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const nav = useNavigate();

   useEffect(() => {
      if (localStorage.getItem("token")) {
        nav('/home')
      }
    }, []); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", formData);
      alert("User registered successfully!");
      nav("/login");
    } catch (error: any) {
      if (error.response?.data) {
        setErrors(error.response.data); 
      } else {
        alert("Registration failed.");
      }
    }
  };

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center">
    <div className="card px-8 py-6 rounded-lg w-92 flex bg-white  items-center flex-col mx-auto mt-20">
      <h1 className="text-center font-bold text-3xl text-gray-600">Signup</h1>
      <form className="my-6" onSubmit={handleSubmit}>
        <input
          className="p-2 my-2 rounded w-full focus:outline-blue-600 border-1 border-gray-400"
          placeholder="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

        <input
          className="p-2 my-2 rounded w-full focus:outline-blue-600 border-1 border-gray-400"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          className="p-2 my-2 rounded w-full focus:outline-blue-600 border-1 border-gray-400"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 mt-3 rounded w-full"
        >
          Signup
        </button>
        <br/>
        <br/>
        <div className="text-gray-500">Already have account? <a href='/' className="text-blue-400">Sign in</a></div>
      </form>
    </div>
    </div>
  );
};

export default Signup;
