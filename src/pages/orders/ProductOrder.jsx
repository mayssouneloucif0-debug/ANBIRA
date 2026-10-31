
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import products from "../../data/products";
import "./ProductOrder.css";

function ProductOrder() {
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("product");

  const product = products.find(
    (item) => item.id === Number(productId)
  );

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    quantity: "1",
    size: "",
    color: "",
    deliveryMethod: "",
    wilaya: "",
    commune: "",
    address: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSubmitted(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setError("");

    const orderData = {
      ...formData,
      productId: product?.id,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل إرسال الطلب."
        );
      }

      console.log("Order created:", result.data);

      setSubmitted(true);

      setFormData({
        fullName: "",
        phone: "",
        quantity: "1",
        size: "",
        color: "",
        deliveryMethod: "",
        wilaya: "",
        commune: "",
        address: "",
        notes: "",
      });
    } catch (error) {
      console.error("Order error:", error);
      setError(
        error.message || "حدث خطأ أثناء إرسال الطلب."
      );
    }
  };

  if (!product) {
    return (
      <main className="product-order-page">
        <section className="product-order-not-found">
          <h2>القطعة غير موجودة</h2>

          <p>
            عذرًا، لم نتمكن من العثور على القطعة المطلوبة.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="product-order-page">
      <PageHeader
        title="طلب القطعة"
        description="أدخلي معلوماتك لإرسال طلبك إلى ANBIRA."
      />

      <section className="product-order-section">

        <div className="selected-product">

          <div className="selected-product-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="selected-product-info">
            <p>ANBIRA COLLECTION</p>

            <h2>{product.name}</h2>

            <span>{product.price}</span>
          </div>

        </div>

        <form
          className="product-order-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="orderFullName">
                الاسم الكامل
              </label>

              <input
                id="orderFullName"
                name="fullName"
                type="text"
                placeholder="أدخلي اسمك الكامل"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="orderPhone">
                رقم الهاتف
              </label>

              <input
                id="orderPhone"
                name="phone"
                type="tel"
                placeholder="أدخلي رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="orderQuantity">
                الكمية
              </label>

              <input
                id="orderQuantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="orderSize">
                المقاس
              </label>

              <select
                id="orderSize"
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
            </div>

            <div className="form-group">
              <label htmlFor="orderColor">
                اللون
              </label>

              <select
                id="orderColor"
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
            </div>

          </div>

          <div className="form-group">

            <label htmlFor="orderDelivery">
              طريقة الاستلام
            </label>

            <select
              id="orderDelivery"
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              required
            >
              <option value="">
                اختاري طريقة الاستلام
              </option>

              <option value="pickup">
                الاستلام من المركز
              </option>

              <option value="delivery">
                التوصيل إلى المنزل
              </option>
            </select>

          </div>

          {formData.deliveryMethod === "delivery" && (
            <div className="delivery-box">

              <div className="form-grid">

                <div className="form-group">
                  <label htmlFor="orderWilaya">
                    الولاية
                  </label>

                  <input
                    id="orderWilaya"
                    name="wilaya"
                    type="text"
                    placeholder="اكتبي الولاية"
                    value={formData.wilaya}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="orderCommune">
                    البلدية
                  </label>

                  <input
                    id="orderCommune"
                    name="commune"
                    type="text"
                    placeholder="اكتبي البلدية"
                    value={formData.commune}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-group">

                <label htmlFor="orderAddress">
                  العنوان
                </label>

                <input
                  id="orderAddress"
                  name="address"
                  type="text"
                  placeholder="أدخلي عنوان التوصيل"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
          )}

          <div className="form-group">

            <label htmlFor="orderNotes">
              ملاحظات إضافية
            </label>

            <textarea
              id="orderNotes"
              name="notes"
              rows="4"
              placeholder="أي ملاحظات تريدين إضافتها..."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>

          </div>

          <div className="order-notice">
            بعد إرسال الطلب، ستقوم ANBIRA بمراجعة معلوماتك
            والتواصل معكِ لتأكيد الطلب.
          </div>

          <button type="submit">
            إرسال الطلب
          </button>

        </form>

        {error && (
          <div className="order-error">
            {error}
          </div>
        )}

        {submitted && (
          <div className="order-success">
            تم إرسال طلبك بنجاح. ستتواصل معكِ ANBIRA قريبًا.
          </div>
        )}

      </section>
    </main>
  );
}

export default ProductOrder;
