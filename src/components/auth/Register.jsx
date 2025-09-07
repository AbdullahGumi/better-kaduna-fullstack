import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password) {
      setError("Name, email, and password are required");
      toast.error("Name, email, and password are required", {
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }
    try {
      const user = await apiService.register({
        name,
        email,
        password,
        role: "registered",
      });
      login(user);
      toast.success("Registered successfully", { autoClose: 2000 });
      navigate("/");
      setLoading(false);
    } catch (error) {
      setError("Registration failed. Email may already exist.");
      toast.error("Registration failed", { autoClose: 3000 });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8 font-sans">
      <h1 className="text-3xl font-bold text-kaduna-gray mb-6">Register</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-kaduna-gray">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
            placeholder="Your Name"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kaduna-gray">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
            placeholder="Your Email"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kaduna-gray">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
            placeholder="Your Password"
            aria-required="true"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full btn-green p-2 rounded-md hover:shadow-sm transition transform hover:scale-105 cursor-pointer"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <p className="text-kaduna-gray text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-kaduna-green hover:text-kaduna-green-dark"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
