import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ManagerJobApplications.css";

function ManagerJobApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("managerToken");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/job-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل تحميل طلبات التوظيف"
        );
      }

      setApplications(result.data || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusLabel = (status) => {
    if (status === "pending") return "قيد المراجعة";
    if (status === "reviewing") return "قيد الدراسة";
    if (status === "accepted") return "مقبول";
    if (status === "rejected") return "مرفوض";

    return status || "قيد المراجعة";
  };

  return (
    <main className="manager-applications-page">
      <section className="manager-applications-header">
        <div>
          <p className="manager-applications-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>طلبات التوظيف</h1>

          <p>
            متابعة طلبات الأشخاص الراغبين في العمل مع ANBIRA.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/manager/dashboard")}
        >
          لوحة التحكم
        </button>
      </section>

      {error && (
        <div className="manager-applications-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="manager-applications-loading">
          جاري تحميل طلبات التوظيف...
        </div>
      ) : applications.length === 0 ? (
        <section className="manager-applications-empty">
          <div className="manager-applications-empty-icon">
            ♡
          </div>

          <h2>لا توجد طلبات توظيف حاليًا</h2>

          <p>
            عندما يتقدم شخص إلى إحدى الوظائف، سيظهر طلبه هنا.
          </p>
        </section>
      ) : (
        <section className="manager-applications-list">
          {applications.map((application) => (
            <article
              className="manager-application-card"
              key={application.id}
            >
              <div className="manager-application-top">
                <div>
                  <span className="manager-application-number">
                    طلب #{application.id}
                  </span>

                  <h2>
                    {application.full_name ||
                      application.name ||
                      application.applicant_name ||
                      "اسم غير محدد"}
                  </h2>
                </div>

                <span className="manager-application-status">
                  {getStatusLabel(application.status)}
                </span>
              </div>

              <div className="manager-application-info">
                <p>
                  <strong>الوظيفة:</strong>{" "}
                  {application.job_title ||
                    application.job_name ||
                    application.position ||
                    "غير محددة"}
                </p>

                <p>
                  <strong>الهاتف:</strong>{" "}
                  {application.phone || "غير محدد"}
                </p>

                <p>
                  <strong>البريد الإلكتروني:</strong>{" "}
                  {application.email || "غير محدد"}
                </p>

                {application.wilaya && (
                  <p>
                    <strong>الولاية:</strong>{" "}
                    {application.wilaya}
                  </p>
                )}
              </div>

              {application.message && (
                <div className="manager-application-message">
                  <strong>الرسالة:</strong>

                  <p>{application.message}</p>
                </div>
              )}

              {application.cv && (
                <div className="manager-application-cv">
                  <a
                    href={application.cv}
                    target="_blank"
                    rel="noreferrer"
                  >
                    عرض السيرة الذاتية
                  </a>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ManagerJobApplications;