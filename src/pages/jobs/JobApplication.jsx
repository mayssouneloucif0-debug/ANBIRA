import { useState } from "react";
import { useParams } from "react-router-dom";

function JobApplication() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    email: "",
    experience: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setErrorMessage("");
    setSubmitted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id, ...formData }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "تعذر إرسال طلب التوظيف.");
      }

      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        nationalId: "",
        phone: "",
        email: "",
        experience: "",
        message: "",
      });
      event.target.reset();
    } catch (error) {
      setErrorMessage(error.message || "تعذر الاتصال بالخادم. حاولي مجددًا.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="job-application-page">
      <section className="page-header">
        <p>ANBIRA</p>
        <h1>التقديم على الوظيفة</h1>
        <p>أرسلي معلوماتك وسنتواصل معكِ بخصوص طلب التوظيف.</p>
      </section>

      <section className="job-application-form-section">
        <h2>طلب التوظيف</h2>

        <form className="job-application-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="applicantFirstName">الاسم</label>
            <input
              id="applicantFirstName"
              name="firstName"
              type="text"
              placeholder="أدخلي اسمك"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantLastName">اللقب</label>
            <input
              id="applicantLastName"
              name="lastName"
              type="text"
              placeholder="أدخلي لقبك"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantNationalId">رقم بطاقة التعريف الوطنية</label>
            <input
              id="applicantNationalId"
              name="nationalId"
              type="text"
              inputMode="numeric"
              maxLength="20"
              placeholder="أدخلي رقم بطاقة التعريف"
              value={formData.nationalId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantPhone">رقم الهاتف المرتبط بواتساب</label>
            <input
              id="applicantPhone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="أدخلي رقمك مع مفتاح الدولة"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantEmail">البريد الإلكتروني</label>
            <input
              id="applicantEmail"
              name="email"
              type="email"
              placeholder="أدخلي بريدك الإلكتروني"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantExperience">الخبرة</label>
            <textarea
              id="applicantExperience"
              name="experience"
              rows="5"
              placeholder="اكتبي لنا عن خبرتك ومهاراتك..."
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicantMessage">معلومات إضافية</label>
            <textarea
              id="applicantMessage"
              name="message"
              rows="4"
              placeholder="أي معلومات أخرى تريدين إضافتها..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {errorMessage && <p role="alert">{errorMessage}</p>}
          {submitted && <p role="status">تم إرسال طلب التوظيف بنجاح.</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جارٍ الإرسال..." : "إرسال طلب التوظيف"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default JobApplication;