import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ManagerWholesaleOrders.css";

function ManagerWholesaleOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("managerToken");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/wholesale-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل تحميل طلبات الجملة"
        );
      }

      setOrders(result.data || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusLabel = (status) => {
    if (status === "pending") return "قيد الانتظار";
    if (status === "confirmed") return "مؤكد";
    if (status === "preparing") return "قيد التجهيز";
    if (status === "ready") return "جاهز";
    if (status === "completed") return "مكتمل";
    if (status === "cancelled") return "ملغى";

    return status || "غير محدد";
  };

  return (
    <main className="manager-wholesale-page">
      <section className="manager-wholesale-header">
        <div>
          <p className="manager-wholesale-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>طلبات الجملة</h1>

          <p>
            متابعة طلبات البيع بالجملة الخاصة بعملاء ANBIRA.
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
        <div className="manager-wholesale-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="manager-wholesale-loading">
          جاري تحميل الطلبات...
        </div>
      ) : orders.length === 0 ? (
        <section className="manager-wholesale-empty">
          <h2>لا توجد طلبات جملة حاليًا</h2>

          <p>
            عندما يرسل أحد العملاء طلب جملة، سيظهر الطلب هنا.
          </p>
        </section>
      ) : (
        <section className="manager-wholesale-list">
          {orders.map((order) => (
            <article
              className="manager-wholesale-card"
              key={order.id}
            >
              <div className="manager-wholesale-top">
                <div>
                  <span>رقم الطلب</span>
                  <strong>#{order.id}</strong>
                </div>

                <span className="manager-wholesale-status">
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="manager-wholesale-info">
                <p>
                  <strong>الاسم:</strong>{" "}
                  {order.full_name ||
                    order.customer_name ||
                    "غير محدد"}
                </p>

                <p>
                  <strong>الهاتف:</strong>{" "}
                  {order.phone || "غير محدد"}
                </p>

                <p>
                  <strong>المنتج:</strong>{" "}
                  {order.product_name || "غير محدد"}
                </p>

                <p>
                  <strong>الكمية:</strong>{" "}
                  {order.quantity || "غير محددة"}
                </p>

                <p>
                  <strong>المقاس:</strong>{" "}
                  {order.size || "غير محدد"}
                </p>

                <p>
                  <strong>اللون:</strong>{" "}
                  {order.color || "غير محدد"}
                </p>
              </div>

              {order.description && (
                <div className="manager-wholesale-description">
                  <strong>التفاصيل:</strong>
                  <p>{order.description}</p>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ManagerWholesaleOrders;