import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>✂</span>
            <strong>ANBIRA</strong>
          </Link>

          <p>
            تصميم، خياطة وأناقة بتفاصيل تعبّر عنكِ.
          </p>
        </div>

        <div className="footer-links">
          <h3>روابط سريعة</h3>

          <Link to="/">الرئيسية</Link>
          <Link to="/collection">المجموعة</Link>
          <Link to="/tailoring">الخياطة</Link>
          <Link to="/jobs">فرص العمل</Link>
          <Link to="/about">من نحن</Link>
          <Link to="/contact">اتصل بنا</Link>
        </div>

        <div className="footer-contact">
          <h3>تواصلي معنا</h3>

          <p>ANBIRA Atelier</p>
          <p>للاستفسار والحجز، تواصلي معنا مباشرة.</p>

          <Link to="/contact" className="footer-contact-link">
            صفحة التواصل →
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 ANBIRA. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

export default Footer;