import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerJobs.css";

function ManagerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("managerToken");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch jobs"
          );
        }

        const data = await response.json();

        let jobsList = [];

        if (Array.isArray(data)) {
          jobsList = data;
        } else if (Array.isArray(data.data)) {
          jobsList = data.data;
        } else if (Array.isArray(data.jobs)) {
          jobsList = data.jobs;
        } else if (Array.isArray(data.results)) {
          jobsList = data.results;
        }

        setJobs(jobsList);
      } catch (error) {
        console.error(
          "Error fetching jobs:",
          error
        );

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "هل أنتِ متأكدة من حذف عرض العمل هذا؟"
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

      if (!response.ok) {
        throw new Error(
          "Failed to delete job"
        );
      }

      setJobs((currentJobs) =>
        Array.isArray(currentJobs)
          ? currentJobs.filter(
              (job) => job.id !== id
            )
          : []
      );
    } catch (error) {
      console.error(
        "Error deleting job:",
        error
      );

      alert(
        "حدث خطأ أثناء حذف عرض العمل."
      );
    }
  };

  const safeJobs = Array.isArray(jobs)
    ? jobs
    : [];

  return (
    <div
      className="manager-jobs"
      dir="rtl"
    >
      <div className="manager-jobs-header">
        <div>
          <h1>إدارة عروض العمل</h1>

          <p>
            إدارة فرص العمل المتاحة في أتيلييه
            ANBIRA.
          </p>
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate("/manager/dashboard")
          }
        >
          العودة إلى لوحة التحكم
        </button>
      </div>

      <div className="jobs-actions">
        <button
          className="add-job-button"
          onClick={() =>
            navigate("/manager/jobs/new")
          }
        >
          + إضافة عرض عمل جديد
        </button>

        <button
          className="applications-button"
          onClick={() =>
            navigate(
              "/manager/job-applications"
            )
          }
        >
          عرض طلبات التوظيف
        </button>
      </div>

      {loading ? (
        <p className="loading-message">
          جارٍ تحميل عروض العمل...
        </p>
      ) : safeJobs.length === 0 ? (
        <div className="empty-jobs">
          <h2>لا توجد عروض عمل</h2>

          <p>
            لا توجد حاليًا فرص عمل منشورة.
          </p>
        </div>
      ) : (
        <div className="jobs-list">
          {safeJobs.map((job) => (
            <div
              className="job-card"
              key={job.id}
            >
              <div className="job-card-header">
                <h2>
                  {job.title ||
                    "عرض عمل بدون عنوان"}
                </h2>

                <span className="job-status">
                  {job.status === "open"
                    ? "مفتوح"
                    : job.status === "closed"
                    ? "مغلق"
                    : job.status ||
                      "مفتوح"}
                </span>
              </div>

              <div className="job-card-content">
                <p>
                  <strong>الوصف:</strong>{" "}
                  {job.description ||
                    "لا يوجد وصف متاح."}
                </p>

                <p>
                  <strong>
                    المتطلبات:
                  </strong>{" "}
                  {job.requirements ||
                    "لا توجد متطلبات محددة."}
                </p>

                <p>
                  <strong>
                    تاريخ الإضافة:
                  </strong>{" "}
                  {job.created_at
                    ? new Date(
                        job.created_at
                      ).toLocaleDateString(
                        "ar-DZ"
                      )
                    : "غير متوفر"}
                </p>
              </div>

              <div className="job-card-actions">
                <button
                  className="delete-job-button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >
                  حذف عرض العمل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagerJobs;