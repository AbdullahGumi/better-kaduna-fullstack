import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      setError("Email and password are required");
      toast.error("Email and password are required", { autoClose: 3000 });
      setLoading(false);
      return;
    }
    try {
      const user = await apiService.login({ email, password });
      login(user);
      toast.success("Logged in successfully", { autoClose: 2000 });
      navigate(user.role === "admin" ? "/admin" : "/");
      setLoading(false);
    } catch (error) {
      setError("Invalid email or password");
      toast.error("Login failed", { autoClose: 3000 });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8 font-sans">
      <h1 className="text-3xl font-bold text-kaduna-gray mb-6">Login</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      <div className="space-y-4">
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
          {loading ? "Loading..." : "Login"}
        </button>
        <p className="text-kaduna-gray text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-kaduna-green hover:text-kaduna-green-dark"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
