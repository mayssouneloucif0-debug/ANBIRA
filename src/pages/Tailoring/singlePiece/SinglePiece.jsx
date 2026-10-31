
import PageHeader from "../../../components/PageHeader";
import "./SinglePiece.css";
import { useState } from "react";

function SinglePiece() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    nationalId: "",
    description: "",
    designImage: null,
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
    setSubmitError("");
  };

  const handleImageChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      designImage: e.target.files?.[0] || null,
    }));

    setSubmitted(false);
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setSubmitError("");
    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("fullName", formData.fullName.trim());
      data.append("phone", formData.phone.trim());
      data.append("nationalId", formData.nationalId.trim());
      data.append("description", formData.description.trim());
      data.append("quantity", formData.quantity);
      data.append("size", formData.size);
      data.append("color", formData.color.trim());
      data.append("deliveryMethod", formData.deliveryMethod);
      data.append("wilaya", formData.wilaya.trim());
      data.append("commune", formData.commune.trim());
      data.append("address", formData.address.trim());
      data.append("notes", formData.notes.trim());

      if (formData.designImage) {
        data.append("designImage", formData.designImage);
      }

      const response = await fetch(
        "http://localhost:5000/api/tailoring-orders",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "تعذر إرسال طلب الخياطة."
        );
      }

      setSubmitted(true);

      setFormData({
        fullName: "",
        phone: "",
        nationalId: "",
        description: "",
        designImage: null,
        quantity: "1",
        size: "",
        color: "",
        deliveryMethod: "",
        wilaya: "",
        commune: "",
        address: "",
        notes: "",
      });

      const imageInput = document.getElementById(
        "pieceDesignImage"
      );

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (error) {
      console.error("Tailoring order error:", error);

      setSubmitError(
        error.message || "حدث خطأ أثناء إرسال الطلب."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="single-piece-page">
      <PageHeader
        title="الخياطة بالقطعة"
        description="صممي قطعتك الخاصة وأرسلي تفاصيلها إلى ANBIRA."
      />

      <section className="single-piece-section">
        <div className="single-piece-intro">
          <p className="single-piece-label">
            ANBIRA CUSTOM PIECE
          </p>

          <h2>اطلبي قطعتك الخاصة</h2>

          <p>
            أرسلي لنا صورة التصميم، تفاصيل الموديل، الكمية،
            المقاس وطريقة الاستلام. سنتواصل معكِ بعد مراجعة
            الطلب لتأكيد التفاصيل.
          </p>
        </div>

        <form
          className="single-piece-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="pieceFullName">
                الاسم الكامل
              </label>

              <input
                id="pieceFullName"
                name="fullName"
                type="text"
                placeholder="أدخلي اسمك الكامل"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="piecePhone">
                رقم الهاتف المرتبط بواتساب
              </label>

              <input
                id="piecePhone"
                name="phone"
                type="tel"
                placeholder="أدخلي رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pieceNationalId">
                رقم بطاقة التعريف
              </label>

              <input
                id="pieceNationalId"
                name="nationalId"
                type="text"
                inputMode="numeric"
                placeholder="أدخلي رقم بطاقة التعريف"
                value={formData.nationalId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pieceDescription">
              وصف التصميم
            </label>

            <textarea
              id="pieceDescription"
              name="description"
              rows="6"
              placeholder="صفي لنا الموديل والتفاصيل التي تريدينها..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pieceDesignImage">
              صورة التصميم
            </label>

            <input
              id="pieceDesignImage"
              name="designImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <small>
              يمكنكِ رفع صورة للموديل أو التصميم الذي تريدينه.
              الحد الأقصى لحجم الصورة 5 ميغابايت.
            </small>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="pieceQuantity">
                الكمية
              </label>

              <input
                id="pieceQuantity"
                name="quantity"
                type="number"
                min="1"
                step="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pieceSize">
                المقاس
              </label>

              <select
                id="pieceSize"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="">
                  اختاري المقاس
                </option>

                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XXXL">XXXL</option>
                <option value="XXXXL">XXXXL</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pieceColor">
                اللون
              </label>

              <input
                id="pieceColor"
                name="color"
                type="text"
                placeholder="مثال: أسود"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pieceDelivery">
              طريقة الاستلام
            </label>

            <select
              id="pieceDelivery"
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
                  <label htmlFor="pieceWilaya">
                    الولاية
                  </label>

                  <input
                    id="pieceWilaya"
                    name="wilaya"
                    type="text"
                    placeholder="اكتبي الولاية"
                    value={formData.wilaya}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pieceCommune">
                    البلدية
                  </label>

                  <input
                    id="pieceCommune"
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
                <label htmlFor="pieceAddress">
                  العنوان
                </label>

                <input
                  id="pieceAddress"
                  name="address"
                  type="text"
                  placeholder="اكتبي عنوان التوصيل"
                  value={formData.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="pieceNotes">
              ملاحظات إضافية
            </label>

            <textarea
              id="pieceNotes"
              name="notes"
              rows="4"
              placeholder="أي تفاصيل إضافية تريدين إضافتها..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="order-notice">
            بعد إرسال الطلب، ستقوم ANBIRA بمراجعة التفاصيل
            والتواصل معكِ لتأكيد الطلب.
          </div>

          {submitError && (
            <div className="order-error" role="alert">
              {submitError}
            </div>
          )}

          <button type="submit" disabled={submitting}>
            {submitting
              ? "جارٍ إرسال الطلب..."
              : "إرسال طلب القطعة"}
          </button>
        </form>

        {submitted && (
          <div className="order-success" role="status">
            تم إرسال طلبك بنجاح. ستتواصل معكِ ANBIRA قريبًا.
          </div>
        )}
      </section>
    </main>
  );
}

export default SinglePiece;
