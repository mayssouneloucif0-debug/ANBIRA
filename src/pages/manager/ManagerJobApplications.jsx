import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerJobApplications.css";

function ManagerJobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingApplicationId, setDeletingApplicationId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("managerToken");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/job-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch job applications"
          );
        }

        const data = await response.json();

        console.log(
          "FULL APPLICATIONS RESPONSE:",
          data
        );

        let applicationsList = [];

        if (Array.isArray(data)) {
          applicationsList = data;
        } else if (Array.isArray(data.data)) {
          applicationsList = data.data;
        } else if (Array.isArray(data.applications)) {
          applicationsList = data.applications;
        } else if (Array.isArray(data.results)) {
          applicationsList = data.results;
        }

        console.log(
          "FINAL APPLICATIONS LIST:",
          applicationsList
        );

        setApplications(applicationsList);
      } catch (error) {
        console.error(
          "Error fetching applications:",
          error
        );

        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  const handleDeleteApplication = async (application) => {
    if (!window.confirm(`هل أنتِ متأكدة من حذف طلب التوظيف رقم #${application.id}؟`)) {
      return;
    }

    setDeletingApplicationId(application.id);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/job-applications/${application.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "تعذر حذف طلب التوظيف.");
      }

      setApplications((previousApplications) =>
        previousApplications.filter((item) => item.id !== application.id)
      );
    } catch (deleteError) {
      console.error("Delete job application error:", deleteError);
      setError(deleteError.message || "تعذر حذف طلب التوظيف.");
    } finally {
      setDeletingApplicationId(null);
    }
  };

  const safeApplications = Array.isArray(
    applications
  )
    ? applications
    : [];

  return (
    <div
      className="manager-job-applications"
      dir="rtl"
    >
      <div className="applications-header">
        <div>
          <h1>طلبات التوظيف</h1>

          <p>
            مشاهدة طلبات التوظيف المقدمة إلى
            أتيلييه ANBIRA.
          </p>
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate("/manager/jobs")
          }
        >
          العودة إلى عروض العمل
        </button>
      </div>

      {error && <p className="delete-error" role="alert">{error}</p>}

      {loading ? (
        <p className="loading-message">
          جارٍ تحميل طلبات التوظيف...
        </p>
      ) : safeApplications.length === 0 ? (
        <div className="empty-applications">
          <h2>لا توجد طلبات توظيف</h2>

          <p>
            لم يتم تقديم أي طلبات توظيف حتى الآن.
          </p>
        </div>
      ) : (
        <>
        <div className="applications-list">
          {safeApplications.map(
            (application) => (
              <div
                className="application-card"
                key={application.id}
              >
                <div className="application-card-header">
                  <h2>
                    {application.first_name && application.last_name
                      ? `${application.first_name} ${application.last_name}`
                      : application.full_name ||
                        application.fullName ||
                      application.name ||
                      "مترشح"}
                  </h2>

                  <span className="application-status">
                    {application.status ||
                      "قيد المراجعة"}
                  </span>
                </div>

                <div className="application-info">
                  <p>
                    <strong>الوظيفة:</strong>{" "}
                    {application.jobTitle ||
                      application.job_title ||
                      application.job ||
                      "غير محددة"}
                  </p>

                  <p>
                    <strong>رقم الهاتف المرتبط بواتساب:</strong>{" "}
                    {application.phone ? (
                      <a
                        href={`https://wa.me/${application.phone.replace(/^00/, "").replace(/\D/g, "").replace(/^0/, "213")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {application.phone}
                      </a>
                    ) : "غير متوفر"}
                  </p>

                  <p>
                    <strong>رقم بطاقة التعريف:</strong>{" "}
                    {application.national_id || "غير متوفر"}
                  </p>

                  <p>
                    <strong>البريد الإلكتروني:</strong>{" "}
                    {application.email ||
                      "غير متوفر"}
                  </p>

                  <p>
                    <strong>الخبرة:</strong>{" "}
                    {application.experience ||
                      "غير محددة"}
                  </p>

                  <p>
                    <strong>الرسالة:</strong>{" "}
                    {application.message ||
                      application.coverLetter ||
                      application.cover_letter ||
                      "لا توجد رسالة."}
                  </p>

                  <p>
                    <strong>تاريخ التقديم:</strong>{" "}
                    {application.created_at
                      ? new Date(
                          application.created_at
                        ).toLocaleDateString(
                          "ar-DZ"
                        )
                      : "غير متوفر"}
                  </p>
                </div>

                <button
                  className="application-delete-button"
                  type="button"
                  onClick={() => handleDeleteApplication(application)}
                  disabled={deletingApplicationId === application.id}
                >
                  {deletingApplicationId === application.id
                    ? "جارٍ الحذف..."
                    : "حذف الطلب"}
                </button>
              </div>
            )
          )}
        </div>
        </>
      )}
    </div>
  );
}

export default ManagerJobApplications;