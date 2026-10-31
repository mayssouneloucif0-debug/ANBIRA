import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact message:", formData);

    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <PageHeader
        title="اتصل بنا"
        description="تواصلي مع ANBIRA للاستفسارات العامة."
      />

      <section className="contact-section">
        <div className="contact-info">
          <p className="contact-label">
            ANBIRA CONTACT
          </p>

          <h2>يسعدنا التواصل معكِ</h2>

          <p className="contact-description">
            إذا كان لديكِ استفسار عام حول ANBIRA أو خدماتنا،
            يمكنكِ إرسال رسالة وسنتواصل معكِ.
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <span>المكان</span>
              <p>مركز ANBIRA</p>
            </div>

            <div className="contact-detail">
              <span>الهاتف</span>
              <p>يحدد لاحقًا</p>
            </div>

            <div className="contact-detail">
              <span>ساعات العمل</span>
              <p>تحدد لاحقًا</p>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="contactFullName">
                الاسم الكامل
              </label>

              <input
                id="contactFullName"
                name="fullName"
                type="text"
                placeholder="أدخلي اسمك الكامل"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">
                رقم الهاتف
              </label>

              <input
                id="contactPhone"
                name="phone"
                type="tel"
                placeholder="أدخلي رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactMessage">
                الرسالة
              </label>

              <textarea
                id="contactMessage"
                name="message"
                rows="7"
                placeholder="اكتبي رسالتك هنا..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit">
              إرسال الرسالة
            </button>
          </form>

          {submitted && (
            <p className="contact-success">
              تم إرسال رسالتك بنجاح، ستتواصل معكِ ANBIRA
              قريبًا.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Contact;