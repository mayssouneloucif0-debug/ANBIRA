
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ManagerLogin.css";

function ManagerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "فشل تسجيل الدخول"
        );
      }

      localStorage.setItem(
        "managerToken",
        data.token
      );

      localStorage.setItem(
        "manager",
        JSON.stringify(data.manager)
      );

      navigate("/manager/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="manager-login-page">
      <section className="manager-login-card">
        <div className="manager-login-header">
          <p className="manager-login-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>تسجيل دخول المدير</h1>

          <p>
            سجّلي الدخول للوصول إلى لوحة تحكم ANBIRA.
          </p>
        </div>

        {error && (
          <div className="manager-login-error">
            {error}
          </div>
        )}

        <form
          className="manager-login-form"
          onSubmit={handleSubmit}
        >
          <div className="manager-login-group">
            <label htmlFor="managerEmail">
              البريد الإلكتروني
            </label>

            <input
              id="managerEmail"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="manager-login-group">
            <label htmlFor="managerPassword">
              كلمة المرور
            </label>

            <input
              id="managerPassword"
              name="password"
              type="password"
              placeholder="أدخلي كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="manager-login-button"
            disabled={loading}
          >
            {loading
              ? "جاري تسجيل الدخول..."
              : "تسجيل الدخول"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ManagerLogin;
