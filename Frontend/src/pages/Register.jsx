import { useState } from "react";
import { registerAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerAdmin(form);
      alert("Registered Successfully ✅");
      navigate("/login");
    } catch (err) {
      console.log("ERROR:", err.response?.data);
  alert(err.response?.data?.msg || "Registration Failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Admin Register</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
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

        <button className="bg-green-600 text-white w-full py-2">
          Register
        </button>
      </form>
      <p className="text-sm mt-4 ml-6 text-center">
  Already have an account?{" "}
  <span
    className="text-blue-600 cursor-pointer hover:underline"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>
    </div>
  );
};

export default Register;