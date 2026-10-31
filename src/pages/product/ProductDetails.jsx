
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    nationalId: "",
    orderType: "",
    quantity: 1,
    size: "",
    color: "",
    deliveryMethod: "",
    wilaya: "",
    commune: "",
    address: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("فشل تحميل المنتج");
        }

        return response.json();
      })
      .then((result) => {
        setProduct(result.data);
      })
      .catch((err) => {
        console.error(err);
        setError("تعذر تحميل تفاصيل المنتج.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setOrderMessage("");
    setOrderError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            orderType:
              product.product_type === "both"
                ? formData.orderType
                : product.product_type,
            productId: product.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "تعذر إرسال الطلب."
        );
      }

      setOrderMessage(
        "تم إرسال طلبك بنجاح. سنتواصل معك قريبًا."
      );

      setFormData({
        fullName: "",
        phone: "",
        nationalId: "",
        orderType: "",
        quantity: 1,
        size: "",
        color: "",
        deliveryMethod: "",
        wilaya: "",
        commune: "",
        address: "",
        notes: "",
      });

      setShowOrderForm(false);
    } catch (err) {
      console.error(err);
      setOrderError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-container">
          <p>جاري تحميل المنتج...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-container">
          <p>
            {error || "المنتج غير موجود."}
          </p>

          <Link to="/collection">
            العودة إلى المجموعة
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        <Link
          to="/collection"
          className="product-details-back"
        >
          ← العودة إلى المجموعة
        </Link>

        <section className="product-details-card">

          <div className="product-details-image">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
            />
          </div>

          <div className="product-details-info">

            <p className="product-details-brand">
              ANBIRA
            </p>

            <h1 className="product-details-title">
              {product.name}
            </h1>

            <p className="product-details-description">
              {product.description}
            </p>

            <p className="product-details-price">
              {product.price} دج
            </p>

            <p className="product-details-id">
              رقم القطعة: {product.id}
            </p>

            {orderMessage && (
              <p className="order-success">
                {orderMessage}
              </p>
            )}

            {orderError && (
              <p className="order-error">
                {orderError}
              </p>
            )}

            {!showOrderForm && (
              <button
                type="button"
                className="product-details-button"
                onClick={() => setShowOrderForm(true)}
              >
                طلب القطعة
              </button>
            )}

          </div>

        </section>

        {showOrderForm && (
          <section className="order-form-section">

            <h2>طلب القطعة</h2>

            <p>
              أدخلي معلوماتك لإرسال الطلب إلى ANBIRA.
            </p>

            <form onSubmit={handleSubmit}>

              <label>
                الاسم الكامل
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                رقم الهاتف المرتبط بواتساب
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                رقم بطاقة التعريف
                <input
                  type="text"
                  name="nationalId"
                  inputMode="numeric"
                  value={formData.nationalId}
                  onChange={handleChange}
                  required
                />
              </label>

              {product.product_type === "both" ? (
                <label>
                  نوع الطلب
                  <select
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">اختاري البيع أو الإيجار</option>
                    <option value="sale">شراء</option>
                    <option value="rental">إيجار</option>
                  </select>
                </label>
              ) : (
                <p>
                  نوع الطلب:{" "}
                  {product.product_type === "rental" ? "إيجار" : "شراء"}
                </p>
              )}

              <label>
                الكمية
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                المقاس
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    اختاري المقاس
                  </option>

                  {product.sizes?.map((size) => (
                    <option
                      key={size}
                      value={size}
                    >
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                اللون
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    اختاري اللون
                  </option>

                  {product.colors?.map((color) => (
                    <option
                      key={color}
                      value={color}
                    >
                      {color}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                طريقة الاستلام
                <select
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                >
                  <option value="">
                    اختاري طريقة الاستلام
                  </option>

                  <option value="home">
                    التوصيل إلى المنزل
                  </option>

                  <option value="pickup">
                    الاستلام من مركز ANBIRA
                  </option>
                </select>
              </label>

              <label>
                الولاية
                <input
                  type="text"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                />
              </label>

              <label>
                البلدية
                <input
                  type="text"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                />
              </label>

              <label>
                العنوان
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </label>

              <label>
                ملاحظات
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "جاري إرسال الطلب..."
                  : "إرسال الطلب"}
              </button>

              <button
                type="button"
                onClick={() => setShowOrderForm(false)}
              >
                إلغاء
              </button>

            </form>

          </section>
        )}

      </div>
    </main>
  );
}

export default ProductDetails;
