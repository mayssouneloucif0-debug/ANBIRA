
import { useState } from "react";
import "./WholesaleForm.css";

function WholesaleForm({ title }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    nationalId: "",
    description: "",
    designImage: null,
    variants: [{ color: "", size: "", age: "", quantity: "1" }],
    trialOption: "",
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
    setErrorMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((previousData) => ({
      ...previousData,
      designImage: file,
    }));

    setSubmitted(false);
    setErrorMessage("");
  };

  const handleVariantChange = (index, name, value) => {
    setFormData((previousData) => ({
      ...previousData,
      variants: previousData.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, [name]: value }
          : variant
      ),
    }));
    setSubmitted(false);
    setErrorMessage("");
  };

  const addVariant = () => {
    setFormData((previousData) => ({
      ...previousData,
      variants: [
        ...previousData.variants,
        { color: "", size: "", age: "", quantity: "1" },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((previousData) => ({
      ...previousData,
      variants: previousData.variants.filter(
        (_variant, variantIndex) => variantIndex !== index
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitted(false);
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const variants = formData.variants.map((variant) => ({
        ...variant,
        color: variant.color.trim(),
        age: variant.age.trim(),
        quantity: Number(variant.quantity),
      }));
      const quantity = variants.reduce(
        (sum, variant) => sum + variant.quantity,
        0
      );
      const data = new FormData();

      data.append("fullName", formData.fullName.trim());
      data.append("phone", formData.phone.trim());
      data.append("nationalId", formData.nationalId.trim());
      data.append("description", formData.description.trim());
      data.append("quantity", String(quantity));
      data.append("size", variants[0].size);
      data.append("color", variants[0].color);
      data.append("variants", JSON.stringify(variants));
      data.append("trialOption", formData.trialOption);
      data.append("orderType", formData.trialOption);
      data.append("deliveryMethod", formData.deliveryMethod);
      data.append("wilaya", formData.deliveryMethod === "delivery" ? formData.wilaya.trim() : "");
      data.append("commune", formData.deliveryMethod === "delivery" ? formData.commune.trim() : "");
      data.append("address", formData.deliveryMethod === "delivery" ? formData.address.trim() : "");
      data.append("notes", formData.notes.trim());

      if (formData.designImage) {
        data.append("designImage", formData.designImage);
      }

      const response = await fetch(
        "http://localhost:5000/api/wholesale-orders",
        {
          method: "POST",
          body: data,
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `تعذر إرسال الطلب (رمز الخطأ ${response.status}).`
        );
      }

      setSubmitted(true);

      setFormData({
        fullName: "",
        phone: "",
        nationalId: "",
        description: "",
        designImage: null,
        variants: [{ color: "", size: "", age: "", quantity: "1" }],
        trialOption: "",
        deliveryMethod: "",
        wilaya: "",
        commune: "",
        address: "",
        notes: "",
      });

      e.target.reset();
    } catch (error) {
      console.error("Wholesale order error:", error);

      setErrorMessage(
        error.message ||
          "تعذر الاتصال بالخادم. تأكدي من تشغيل Backend وحاولي مجددًا."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="wholesale-form-section">
      <h2>{title}</h2>

      <form
        className="wholesale-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="wholesaleFullName">
              الاسم الكامل
            </label>

            <input
              id="wholesaleFullName"
              name="fullName"
              type="text"
              placeholder="أدخلي اسمك الكامل"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="wholesalePhone">
              رقم الهاتف المرتبط بواتساب
            </label>

            <input
              id="wholesalePhone"
              name="phone"
              type="tel"
              placeholder="أدخلي رقم الهاتف"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="wholesaleNationalId">
              رقم بطاقة التعريف
            </label>

            <input
              id="wholesaleNationalId"
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
          <label htmlFor="wholesaleDescription">
            وصف التصميم
          </label>

          <textarea
            id="wholesaleDescription"
            name="description"
            rows="6"
            placeholder="صفي لنا التصميم والموديل والتفاصيل المطلوبة..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wholesaleDesignImage">
            صورة التصميم
          </label>

          <input
            id="wholesaleDesignImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <small>
            يمكنكِ رفع صورة الموديل أو التصميم.
          </small>
        </div>

        <div className="wholesale-variants">
          <h3>الألوان والمقاسات والكميات</h3>
          <p>أضيفي صنفًا لكل لون ومقاس وعمر، وحددي كميته.</p>

          {formData.variants.map((variant, index) => (
            <div className="wholesale-variant-row" key={index}>
              <div className="form-group">
                <label htmlFor={`wholesaleColor${index}`}>اللون</label>
                <input
                  id={`wholesaleColor${index}`}
                  type="text"
                  placeholder="مثال: أسود"
                  value={variant.color}
                  onChange={(event) =>
                    handleVariantChange(index, "color", event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`wholesaleSize${index}`}>المقاس</label>
                <select
                  id={`wholesaleSize${index}`}
                  value={variant.size}
                  onChange={(event) =>
                    handleVariantChange(index, "size", event.target.value)
                  }
                  required
                >
                  <option value="">اختاري</option>
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
                <label htmlFor={`wholesaleAge${index}`}>العمر</label>
                <input
                  id={`wholesaleAge${index}`}
                  type="text"
                  placeholder="مثال: 8 سنوات أو بالغ"
                  value={variant.age}
                  onChange={(event) =>
                    handleVariantChange(index, "age", event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`wholesaleVariantQuantity${index}`}>
                  الكمية
                </label>
                <input
                  id={`wholesaleVariantQuantity${index}`}
                  type="number"
                  min="1"
                  step="1"
                  value={variant.quantity}
                  onChange={(event) =>
                    handleVariantChange(index, "quantity", event.target.value)
                  }
                  required
                />
              </div>

              {formData.variants.length > 1 && (
                <button
                  type="button"
                  className="remove-variant-button"
                  onClick={() => removeVariant(index)}
                >
                  حذف الصنف
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-variant-button"
            onClick={addVariant}
          >
            + إضافة لون / مقاس آخر
          </button>
        </div>

        <div className="trial-box">
          <div className="trial-box-title">
            القطعة التجريبية
          </div>

          <p>
            اختاري هل تريدين تجربة قطعة واحدة قبل تنفيذ
            الكمية الكاملة.
          </p>

          <div className="trial-options">
            <label>
              <input
                type="radio"
                name="trialOption"
                value="trial"
                checked={formData.trialOption === "trial"}
                onChange={handleChange}
                required
              />

              <span>
                أريد تنفيذ قطعة تجريبية أولًا
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="trialOption"
                value="direct"
                checked={formData.trialOption === "direct"}
                onChange={handleChange}
                required
              />

              <span>
                أريد تنفيذ طلب الجملة مباشرة
              </span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="wholesaleDelivery">
            طريقة الاستلام
          </label>

          <select
            id="wholesaleDelivery"
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
                <label htmlFor="wholesaleWilaya">
                  الولاية
                </label>

                <input
                  id="wholesaleWilaya"
                  name="wilaya"
                  type="text"
                  placeholder="اكتبي الولاية"
                  value={formData.wilaya}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="wholesaleCommune">
                  البلدية
                </label>

                <input
                  id="wholesaleCommune"
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
              <label htmlFor="wholesaleAddress">
                العنوان
              </label>

              <input
                id="wholesaleAddress"
                name="address"
                type="text"
                placeholder="اكتبي عنوان التوصيل"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="wholesaleNotes">
            ملاحظات إضافية
          </label>

          <textarea
            id="wholesaleNotes"
            name="notes"
            rows="4"
            placeholder="أي تفاصيل إضافية..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-note">
          بعد إرسال الطلب، ستراجع ANBIRA التفاصيل وتتواصل
          معكِ لتأكيد الطلب أو القطعة التجريبية.
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "جارٍ إرسال الطلب..."
            : "إرسال طلب الجملة"}
        </button>
      </form>

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      {submitted && (
        <div className="success-message" role="status">
          تم إرسال طلبك بنجاح، ستتواصل معكِ ANBIRA قريبًا.
        </div>
      )}
    </section>
  );
}

export default WholesaleForm;
