import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <span className="logo-scissors">✂</span>
          <span className="logo-name">ANBIRA</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>
            الرئيسية
          </NavLink>

          <NavLink to="/collection">
            المجموعة
          </NavLink>

          <NavLink to="/tailoring">
            الخياطة
          </NavLink>

          <NavLink to="/jobs">
            فرص العمل
          </NavLink>

          <NavLink to="/about">
            من نحن
          </NavLink>

          <NavLink to="/contact">
            اتصل بنا
          </NavLink>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;