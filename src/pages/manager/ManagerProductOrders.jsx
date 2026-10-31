import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getWhatsAppUrl } from "../../utils/whatsapp";
import "./ManagerProductOrders.css";

const API_URL = "http://localhost:5000";

function ManagerProductOrders() {
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
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل تحميل الطلبات"
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
    if (!window.confirm(`هل أنتِ متأكدة من حذف الطلب رقم #${order.id}؟`)) {
      return;
    }

    setDeletingOrderId(order.id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/orders/${order.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "تعذر حذف الطلب.");
      }

      setOrders((previousOrders) =>
        previousOrders.filter((item) => item.id !== order.id)
      );
    } catch (deleteError) {
      console.error("Delete product order error:", deleteError);
      setError(deleteError.message || "تعذر حذف الطلب.");
    } finally {
      setDeletingOrderId(null);
    }
  };

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
    <main className="manager-orders-page">
      <section className="manager-orders-header">
        <div>
          <p className="manager-orders-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>طلبات المنتجات</h1>

          <p>
            متابعة طلبات البيع والإيجار الخاصة بمنتجات ANBIRA.
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
        <div className="manager-orders-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="manager-orders-loading">
          جاري تحميل الطلبات...
        </div>
      ) : orders.length === 0 ? (
        <section className="manager-orders-empty">
          <h2>لا توجد طلبات حاليًا</h2>

          <p>
            عندما يقوم أحد العملاء بطلب منتج، سيظهر الطلب هنا.
          </p>
        </section>
      ) : (
        <section className="manager-orders-list">
          {orders.map((order) => (
            <article
              className="manager-order-card"
              key={order.id}
            >
              <div className="manager-order-top">
                <div>
                  <span>رقم الطلب</span>
                  <strong>#{order.id}</strong>
                </div>

                <span className="manager-order-status">
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="manager-order-info">
                <p>
                  <strong>العميل:</strong>{" "}
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
                  <strong>المنتج:</strong>{" "}
                  {order.product_name || "غير محدد"}
                </p>

                <p>
                  <strong>نوع الطلب:</strong>{" "}
                  {order.order_type === "rental" ? "إيجار" : "شراء"}
                </p>

                <p>
                  <strong>الكمية:</strong>{" "}
                  {order.quantity || 1}
                </p>

                <p>
                  <strong>المبلغ:</strong>{" "}
                  {order.total_price
                    ? `${order.total_price} دج`
                    : "غير محدد"}
                </p>
              </div>

              {order.color && (
                <p>
                  <strong>اللون:</strong> {order.color}
                </p>
              )}

              {order.size && (
                <p>
                  <strong>المقاس:</strong> {order.size}
                </p>
              )}

              {order.notes && (
                <p>
                  <strong>ملاحظات:</strong> {order.notes}
                </p>
              )}

              {order.address && (
                <p>
                  <strong>العنوان:</strong> {order.address}
                </p>
              )}

              {order.product_image && (
                <a
                  className="manager-order-image-link"
                  href={`${API_URL}${order.product_image}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="manager-order-image"
                    src={`${API_URL}${order.product_image}`}
                    alt={`صورة ${order.product_name || "المنتج"}`}
                  />
                </a>
              )}

              <button
                className="manager-order-delete-button"
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

export default ManagerProductOrders;