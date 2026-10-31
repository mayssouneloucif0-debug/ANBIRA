import { useNavigate } from "react-router-dom";
import "./ManagerDashboard.css";

function ManagerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("managerToken");
    localStorage.removeItem("manager");
    navigate("/manager/login");
  };

  return (
    <main className="manager-dashboard">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">ANBIRA MANAGEMENT</p>
            <h1>لوحة تحكم ANBIRA</h1>
            <p>مرحبًا بكِ في لوحة إدارة الأتيلييه.</p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            تسجيل الخروج
          </button>
        </div>

        <section className="dashboard-grid">

          <button
            className="dashboard-card"
            onClick={() => navigate("/manager/products")}
          >
            <span>🛍️</span>
            <h2>المنتجات</h2>
            <p>إدارة منتجات البيع والتأجير.</p>
          </button>

          <button
            className="dashboard-card"
            onClick={() =>
              navigate("/manager/product-orders")
            }
          >
            <span>📦</span>
            <h2>طلبات المنتجات</h2>
            <p>متابعة طلبات الزبائن.</p>
          </button>

          <button
            className="dashboard-card"
            onClick={() =>
              navigate("/manager/tailoring-orders")
            }
          >
            <span>🧵</span>
            <h2>طلبات الخياطة</h2>
            <p>إدارة طلبات الخياطة الفردية.</p>
          </button>

          <button
            className="dashboard-card"
            onClick={() =>
              navigate("/manager/wholesale-orders")
            }
          >
            <span>🏷️</span>
            <h2>طلبات الجملة</h2>
            <p>متابعة طلبات البيع بالجملة.</p>
          </button>

          <button
            className="dashboard-card"
            onClick={() => navigate("/manager/jobs")}
          >
            <span>💼</span>
            <h2>عروض العمل</h2>
            <p>إدارة فرص العمل في ANBIRA.</p>
          </button>

          <button
            className="dashboard-card"
            onClick={() =>
              navigate("/manager/job-applications")
            }
          >
            <span>📄</span>
            <h2>طلبات التوظيف</h2>
            <p>مشاهدة طلبات المترشحين.</p>
          </button>

        </section>

      </div>
    </main>
  );
}

export default ManagerDashboard;