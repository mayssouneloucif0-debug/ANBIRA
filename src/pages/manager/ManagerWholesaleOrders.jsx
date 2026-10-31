import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWhatsAppUrl } from "../../utils/whatsapp";
import "./ManagerWholesaleOrders.css";

const API_URL = "http://localhost:5000";

const getVariants = (variants) => {
  if (Array.isArray(variants)) {
    return variants;
  }

  if (typeof variants !== "string" || !variants) {
    return [];
  }

  try {
    const parsedVariants = JSON.parse(variants);
    return Array.isArray(parsedVariants) ? parsedVariants : [];
  } catch (error) {
    console.error("Invalid wholesale variants data:", error);
    return [];
  }
};

function ManagerWholesaleOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("managerToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/wholesale-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`تعذر تحميل طلبات الجملة (${response.status}).`);
        }

        const data = await response.json();

        let ordersList = [];

        if (Array.isArray(data)) {
          ordersList = data;
        } else if (Array.isArray(data.data)) {
          ordersList = data.data;
        } else if (Array.isArray(data.orders)) {
          ordersList = data.orders;
        } else if (Array.isArray(data.results)) {
          ordersList = data.results;
        }

        setOrders(ordersList);
      } catch (error) {
        console.error(
          "Error fetching wholesale orders:",
          error
        );

        setLoadError(error.message || "تعذر تحميل طلبات الجملة.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`هل أنتِ متأكدة من حذف طلب الجملة رقم #${order.id}؟`)) {
      return;
    }

    setDeletingOrderId(order.id);
    setDeleteError("");

    try {
      const response = await fetch(
        `${API_URL}/api/wholesale-orders/${order.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "تعذر حذف طلب الجملة.");
      }

      setOrders((previousOrders) =>
        previousOrders.filter((item) => item.id !== order.id)
      );
    } catch (deleteError) {
      console.error("Delete wholesale order error:", deleteError);
      setDeleteError(deleteError.message || "تعذر حذف طلب الجملة.");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const safeOrders = Array.isArray(orders)
    ? orders
    : [];

  return (
    <div
      className="manager-wholesale-orders"
      dir="rtl"
    >
      <h1>متابعة طلبات الجملة</h1>

      <button
        className="back-button"
        onClick={() =>
          navigate("/manager/dashboard")
        }
      >
        العودة إلى لوحة التحكم
      </button>

      {loading ? (
        <p className="loading-message">
          جارٍ تحميل طلبات الجملة...
        </p>
      ) : loadError ? (
        <p className="empty-message" role="alert">{loadError}</p>
      ) : (
        <>
          {deleteError && (
            <p className="empty-message" role="alert">{deleteError}</p>
          )}
          {safeOrders.length === 0 ? (
            <p className="empty-message">
              لا توجد طلبات جملة حاليًا.
            </p>
          ) : (
            <div className="wholesale-orders-list">
              {safeOrders.map((order) => (
                <div
                  className="wholesale-order-card"
                  key={order.id}
                >
              <h3>
                طلب جملة رقم #{order.id}
              </h3>

              <p>
                <strong>اسم الزبون:</strong>{" "}
                {order.full_name ||
                  order.fullName ||
                  order.name ||
                  "غير متوفر"}
              </p>

              <p>
                <strong>رقم الهاتف:</strong>{" "}
                {order.phone ? (
                  <a
                    href={getWhatsAppUrl(order.phone)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {order.phone}
                  </a>
                ) : "غير متوفر"}
              </p>

              <p>
                <strong>رقم بطاقة التعريف:</strong>{" "}
                {order.national_id || "غير متوفر"}
              </p>

              <p>
                <strong>الكمية:</strong>{" "}
                {order.quantity ??
                  "غير متوفرة"}
              </p>

              <p>
                <strong>حالة الطلب:</strong>{" "}
                {order.status ||
                  "قيد الانتظار"}
              </p>

              {order.order_type && (
                <p>
                  <strong>نوع الطلب:</strong>{" "}
                  {order.order_type === "sample" ? "قطعة تجريبية" : "طلب جملة"}
                </p>
              )}

              {(order.description || order.details || order.product_design) && (
                <p>
                  <strong>تفاصيل التصميم:</strong>{" "}
                  {order.description || order.details || order.product_design}
                </p>
              )}

              {getVariants(order.variants).length > 0 && (
                <div className="wholesale-order-variants">
                  <strong>تفاصيل الألوان والمقاسات والكميات:</strong>
                  <ul>
                    {getVariants(order.variants).map((variant, index) => (
                      <li key={`${variant.color}-${variant.size}-${index}`}>
                        اللون: {variant.color}، المقاس: {variant.size}،
                        العمر: {variant.age}، الكمية: {variant.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {order.design_image && (
                <a
                  className="wholesale-order-image-link"
                  href={`${API_URL}${order.design_image}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="wholesale-order-image"
                    src={`${API_URL}${order.design_image}`}
                    alt={`صورة تصميم الطلب رقم ${order.id}`}
                  />
                </a>
              )}

              <button
                className="wholesale-order-delete-button"
                type="button"
                onClick={() => handleDeleteOrder(order)}
                disabled={deletingOrderId === order.id}
              >
                {deletingOrderId === order.id ? "جارٍ الحذف..." : "حذف الطلب"}
              </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManagerWholesaleOrders;