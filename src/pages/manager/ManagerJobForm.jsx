import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerJobForm.css";

function ManagerJobForm() {
  const navigate = useNavigate();

  const token = localStorage.getItem("managerToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    status: "open",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("يرجى إدخال عنوان الوظيفة.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
            requirements: formData.requirements.trim(),
            status: formData.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "حدث خطأ أثناء إضافة عرض العمل."
        );
      }

      alert("تمت إضافة عرض العمل بنجاح.");

      navigate("/manager/jobs");
    } catch (error) {
      console.error(
        "Error creating job:",
        error
      );

      setError(
        error.message ||
          "حدث خطأ أثناء إضافة عرض العمل."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="manager-job-form-page"
      dir="rtl"
    >
      <div className="manager-job-form-container">
        <div className="manager-job-form-header">
          <div>
            <p className="form-label">
              ANBIRA MANAGEMENT
            </p>

            <h1>إضافة عرض عمل جديد</h1>

            <p>
              أضيفي فرصة عمل جديدة إلى أتيلييه
              ANBIRA.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate("/manager/jobs")
            }
          >
            العودة إلى عروض العمل
          </button>
        </div>

        <form
          className="manager-job-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="title">
              عنوان الوظيفة
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: خياطة ملابس نسائية"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              وصف الوظيفة
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="اكتبي وصفًا واضحًا للوظيفة..."
              rows="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">
              متطلبات الوظيفة
            </label>

            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="مثال: خبرة في الخياطة، الدقة، الالتزام..."
              rows="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">
              حالة عرض العمل
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="open">
                مفتوح
              </option>

              <option value="closed">
                مغلق
              </option>
            </select>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/manager/jobs")
              }
              disabled={loading}
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="submit-job-button"
              disabled={loading}
            >
              {loading
                ? "جارٍ نشر عرض العمل..."
                : "نشر عرض العمل"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ManagerJobForm;