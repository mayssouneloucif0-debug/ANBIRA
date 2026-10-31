import { useState } from "react";

function TailoringForm({ title }) {
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [designImage, setDesignImage] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      fullName,
      phone,
      description,
      designImage,
      size,
      color,
      deliveryMethod,
      wilaya,
      commune,
      address,
      deliveryDate,
      notes,
    };

    console.log(orderData);

    setSubmitted(true);
  };

  return (
    <section className="single-piece-form-section">

      <h2>{title}</h2>

      <form
        className="tailoring-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label htmlFor="fullName">الاسم الكامل</label>

          <input
            id="fullName"
            type="text"
            placeholder="أدخلي اسمك الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">رقم الهاتف</label>

          <input
            id="phone"
            type="tel"
            placeholder="أدخلي رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">وصف القطعة</label>

          <textarea
            id="description"
            placeholder="صفي لنا القطعة التي تريدين خياطتها..."
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="designImage">صورة التصميم</label>

          <input
            id="designImage"
            type="file"
            accept="image/*"
            onChange={(e) => setDesignImage(e.target.files[0])}
          />

          <p className="input-note">
            يمكنكِ إضافة صورة للتصميم أو الموديل المطلوب.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="size">المقاس</label>

          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          >
            <option value="">اختاري المقاس</option>
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
          <label htmlFor="color">اللون</label>

          <input
            id="color"
            type="text"
            placeholder="اكتبي اللون المطلوب"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryMethod">
            طريقة الاستلام
          </label>

          <select
            id="deliveryMethod"
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
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

        {deliveryMethod === "delivery" && (
          <>
            <div className="form-group">
              <label htmlFor="wilaya">الولاية</label>

              <input
                id="wilaya"
                type="text"
                placeholder="اكتبي الولاية"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="commune">البلدية</label>

              <input
                id="commune"
                type="text"
                placeholder="اكتبي البلدية"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">العنوان</label>

              <input
                id="address"
                type="text"
                placeholder="اكتبي عنوان التوصيل"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="deliveryDate">
            تاريخ التسليم المطلوب
          </label>

          <input
            id="deliveryDate"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">
            ملاحظات إضافية
          </label>

          <textarea
            id="notes"
            placeholder="اكتبي أي ملاحظات أو تفاصيل إضافية..."
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <p className="form-note">
          بعد إرسال الطلب، ستتواصل معكِ ANBIRA لتأكيد
          التفاصيل وموعد الخياطة.
        </p>

        <button type="submit">
          إرسال طلب الخياطة
        </button>

      </form>

      {submitted && (
        <p className="success-message">
          تم إرسال طلبك بنجاح، ستتواصل معكِ ANBIRA قريبًا.
        </p>
      )}

    </section>
  );
}

export default TailoringForm;