import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("فشل تحميل الوظائف");
        }

        return response.json();
      })
      .then((result) => {
        setJobs(result.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("تعذر تحميل فرص العمل حاليًا.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="jobs-page">
      <PageHeader
        title="فرص العمل"
        description="اكتشفي فرص العمل المتاحة وانضمي إلى فريق ANBIRA."
      />

      <section className="jobs-section">
        <div className="jobs-intro">
          <p>ANBIRA CAREERS</p>

          <h2>انضمي إلى فريقنا</h2>

          <span>
            نبحث عن أشخاص لديهم الرغبة في العمل والمساهمة
            في تطوير ANBIRA.
          </span>
        </div>

        {loading && (
          <p>جاري تحميل فرص العمل...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p>لا توجد فرص عمل متاحة حاليًا.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="jobs-list">
            {jobs.map((job, index) => (
              <article
                className="job-card"
                key={job.id}
              >
                <div className="job-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="job-content">
                  <h3>{job.title}</h3>

                  <p>{job.description}</p>
                </div>

                <Link to={`/jobs/apply/${job.id}`}>
                  التقديم →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Jobs;