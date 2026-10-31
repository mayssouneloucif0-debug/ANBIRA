import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getWhatsAppUrl } from "../../utils/whatsapp";
import "./ManagerTailoringOrders.css";

const API_URL = "http://localhost:5000";

function ManagerTailoringOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const token = localStorage.getItem("managerToken");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/tailoring-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل تحميل طلبات التفصيل"
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

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`هل أنتِ متأكدة من حذف طلب الخياطة رقم #${order.id}؟`)) {
      return;
    }

    setDeletingOrderId(order.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/tailoring-orders/${order.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "تعذر حذف طلب الخياطة.");
      }

      setOrders((previousOrders) =>
        previousOrders.filter((item) => item.id !== order.id)
      );
    } catch (deleteError) {
      console.error("Delete tailoring order error:", deleteError);
      setError(deleteError.message || "تعذر حذف طلب الخياطة.");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "قيد الانتظار";
    if (status === "confirmed") return "مؤكد";
    if (status === "preparing") return "قيد التنفيذ";
    if (status === "ready") return "جاهز";
    if (status === "completed") return "مكتمل";
    if (status === "cancelled") return "ملغى";

    return status || "غير محدد";
  };

  return (
    <main className="manager-tailoring-page">
      <section className="manager-tailoring-header">
        <div>
          <p className="manager-tailoring-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>طلبات التفصيل</h1>

          <p>
            متابعة طلبات تفصيل القطع الخاصة بالعملاء.
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
        <div className="manager-tailoring-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="manager-tailoring-loading">
          جاري تحميل الطلبات...
        </div>
      ) : orders.length === 0 ? (
        <section className="manager-tailoring-empty">
          <h2>لا توجد طلبات تفصيل حاليًا</h2>

          <p>
            عندما يرسل أحد العملاء طلب تفصيل، سيظهر هنا.
          </p>
        </section>
      ) : (
        <section className="manager-tailoring-list">
          {orders.map((order) => (
            <article
              className="manager-tailoring-card"
              key={order.id}
            >
              <div className="manager-tailoring-top">
                <div>
                  <span>رقم الطلب</span>
                  <strong>#{order.id}</strong>
                </div>

                <span className="manager-tailoring-status">
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="manager-tailoring-info">
                <p>
                  <strong>الاسم:</strong>{" "}
                  {order.full_name || order.customer_name || "غير محدد"}
                </p>

                <p>
                  <strong>الهاتف:</strong>{" "}
                  {order.phone ? (
                    <a
                      href={getWhatsAppUrl(order.phone)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {order.phone}
                    </a>
                  ) : "غير محدد"}
                </p>

                <p>
                  <strong>رقم بطاقة التعريف:</strong>{" "}
                  {order.national_id || "غير محدد"}
                </p>

                <p>
                  <strong>الكمية:</strong>{" "}
                  {order.quantity || 1}
                </p>

                <p>
                  <strong>المقاس:</strong>{" "}
                  {order.size || "غير محدد"}
                </p>

                <p>
                  <strong>اللون:</strong>{" "}
                  {order.color || "غير محدد"}
                </p>

                <p>
                  <strong>طريقة الاستلام:</strong>{" "}
                  {order.delivery_method || "غير محددة"}
                </p>
              </div>

              {order.description && (
                <div className="manager-tailoring-description">
                  <strong>وصف الطلب:</strong>
                  <p>{order.description}</p>
                </div>
              )}

              {order.design_image && (
                <a
                  className="manager-tailoring-image-link"
                  href={`${API_URL}${order.design_image}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="manager-tailoring-image"
                    src={`${API_URL}${order.design_image}`}
                    alt={`صورة تصميم الطلب رقم ${order.id}`}
                  />
                </a>
              )}

              {order.address && (
                <div className="manager-tailoring-address">
                  <strong>العنوان:</strong>
                  <p>{order.address}</p>
                </div>
              )}

              <button
                className="manager-tailoring-delete-button"
                type="button"
                onClick={() => handleDeleteOrder(order)}
                disabled={deletingOrderId === order.id}
              >
                {deletingOrderId === order.id ? "جارٍ الحذف..." : "حذف الطلب"}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ManagerTailoringOrders;