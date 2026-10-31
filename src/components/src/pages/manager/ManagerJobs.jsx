import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ManagerJobs.css";

function ManagerJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("managerToken");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل تحميل الوظائف"
        );
      }

      setJobs(result.data || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getStatusLabel = (status) => {
    if (status === "active") return "متاحة";
    if (status === "open") return "مفتوحة";
    if (status === "inactive") return "غير متاحة";
    if (status === "closed") return "مغلقة";

    return status || "غير محدد";
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "هل أنتِ متأكدة من حذف هذه الوظيفة؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل حذف الوظيفة"
        );
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== id)
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <main className="manager-jobs-page">
      <section className="manager-jobs-header">
        <div>
          <p className="manager-jobs-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>الوظائف</h1>

          <p>
            إدارة الوظائف وفرص العمل المتاحة في Atelier ANBIRA.
          </p>
        </div>

        <div className="manager-jobs-header-actions">
          <button
            type="button"
            onClick={() => navigate("/manager/dashboard")}
          >
            لوحة التحكم
          </button>

          <button
            type="button"
            className="manager-jobs-add-button"
            onClick={() => {
              alert(
                "صفحة إضافة الوظيفة سنربطها بعد التأكد من Route الخاص بها."
              );
            }}
          >
            + إضافة وظيفة
          </button>
        </div>
      </section>

      {error && (
        <div className="manager-jobs-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="manager-jobs-loading">
          جاري تحميل الوظائف...
        </div>
      ) : jobs.length === 0 ? (
        <section className="manager-jobs-empty">
          <div className="manager-jobs-empty-icon">
            ✂
          </div>

          <h2>لا توجد وظائف حاليًا</h2>

          <p>
            عندما تتم إضافة وظيفة جديدة ستظهر هنا.
          </p>
        </section>
      ) : (
        <section className="manager-jobs-list">
          {jobs.map((job) => (
            <article
              className="manager-job-card"
              key={job.id}
            >
              <div className="manager-job-card-top">
                <div>
                  <span className="manager-job-number">
                    وظيفة #{job.id}
                  </span>

                  <h2>
                    {job.title ||
                      job.job_title ||
                      job.name ||
                      "وظيفة بدون اسم"}
                  </h2>
                </div>

                <span className="manager-job-status">
                  {getStatusLabel(job.status)}
                </span>
              </div>

              <div className="manager-job-info">
                {job.description && (
                  <div>
                    <strong>الوصف</strong>
                    <p>{job.description}</p>
                  </div>
                )}

                {job.requirements && (
                  <div>
                    <strong>المتطلبات</strong>
                    <p>{job.requirements}</p>
                  </div>
                )}

                {job.location && (
                  <div>
                    <strong>المكان</strong>
                    <p>{job.location}</p>
                  </div>
                )}
              </div>

              <div className="manager-job-actions">
                <button
                  type="button"
                  className="manager-job-delete"
                  onClick={() => handleDelete(job.id)}
                >
                  حذف الوظيفة
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ManagerJobs;