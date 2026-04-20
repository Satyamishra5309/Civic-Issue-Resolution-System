import { useState } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginAdmin(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      navigate("/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
  alert(err.response?.data?.msg || "Login Failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-600 text-white w-full py-2">
          Login
        </button>
      </form>

      <p className="text-sm mt-4 ml-7 text-center">
  New here?{" "}
  <span
    className="text-blue-600 cursor-pointer hover:underline"
    onClick={() => navigate("/register")}
  >
    Create an account
  </span>
</p>
    </div>
  );
};

export default Login;