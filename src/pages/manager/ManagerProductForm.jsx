
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./ManagerProductForm.css";

const API_URL = "http://localhost:5000";

function ManagerProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    productType: "sale",
    status: "active",
    image: "",
    colors: "",
    sizes: "",
  });

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [loadingProduct, setLoadingProduct] =
    useState(isEditMode);

  const [error, setError] = useState("");

  const token = localStorage.getItem("managerToken");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "فشل تحميل المنتج"
          );
        }

        const data = result.data;

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price:
            data.price !== null &&
            data.price !== undefined
              ? data.price
              : "",
          productType:
            data.product_type || "sale",
          status:
            data.status || "active",
          image: data.image || "",
          colors: Array.isArray(data.colors)
            ? data.colors.join(", ")
            : data.colors || "",
          sizes: Array.isArray(data.sizes)
            ? data.sizes.join(", ")
            : data.sizes || "",
        });

        if (data.image) {
          setPreviewUrl(
            data.image.startsWith("http")
              ? data.image
              : `${API_URL}${data.image}`
          );
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "نوع الصورة غير مدعوم. اختاري JPG أو PNG أو WEBP."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "حجم الصورة كبير جدًا. الحد الأقصى هو 5MB."
      );

      e.target.value = "";
      return;
    }

    setSelectedImage(file);

    const localPreview =
      URL.createObjectURL(file);

    setPreviewUrl(localPreview);

    setError("");
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      return formData.image || "";
    }

    const imageFormData = new FormData();

    imageFormData.append(
      "image",
      selectedImage
    );

    const response = await fetch(
      `${API_URL}/api/products/upload-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "حدث خطأ أثناء رفع الصورة"
      );
    }

    return result.image;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      /*
        أولًا نرفع الصورة إذا اختارت المديرة صورة جديدة
      */
      const imagePath = await uploadImage();

      const productData = {
        name: formData.name,
        description: formData.description,

        price:
          formData.price === ""
            ? null
            : Number(formData.price),

        productType: formData.productType,

        status: formData.status,

        image: imagePath,

        colors: formData.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),

        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
      };

      const url = isEditMode
        ? `${API_URL}/api/products/${id}`
        : `${API_URL}/api/products`;

      const method = isEditMode
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "حدث خطأ أثناء حفظ المنتج"
        );
      }

      navigate("/manager/products");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <main className="manager-product-form-page">
        <div className="manager-product-form-loading">
          جاري تحميل المنتج...
        </div>
      </main>
    );
  }

  return (
    <main className="manager-product-form-page">
      <section className="manager-product-form-header">
        <div>
          <p className="manager-product-form-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>
            {isEditMode
              ? "تعديل المنتج"
              : "إضافة منتج جديد"}
          </h1>

          <p>
            {isEditMode
              ? "عدّلي معلومات المنتج ثم احفظي التغييرات."
              : "أدخلي معلومات المنتج لإضافته إلى مجموعة ANBIRA."}
          </p>
        </div>

        <button
          type="button"
          className="manager-product-form-back"
          onClick={() =>
            navigate("/manager/products")
          }
        >
          العودة للمنتجات
        </button>
      </section>

      <section className="manager-product-form-card">
        {error && (
          <div className="manager-product-form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="manager-product-form-grid">
            <div className="manager-product-form-group">
              <label htmlFor="productName">
                اسم المنتج
              </label>

              <input
                id="productName"
                name="name"
                type="text"
                placeholder="مثال: فستان سهرة"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="manager-product-form-group">
              <label htmlFor="productPrice">
                السعر
              </label>

              <input
                id="productPrice"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="مثال: 8500"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="manager-product-form-group">
            <label htmlFor="productType">
              نوع المنتج
            </label>

            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
            >
              <option value="sale">
                بيع
              </option>

              <option value="rental">
                إيجار
              </option>

              <option value="both">
                بيع وإيجار
              </option>
            </select>
          </div>

          <div className="manager-product-form-group">
            <label htmlFor="productStatus">
              حالة المنتج
            </label>

            <select
              id="productStatus"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">
                متوفر
              </option>

              <option value="unavailable">
                غير متوفر
              </option>

              <option value="archived">
                مؤرشف
              </option>
            </select>
          </div>

          <div className="manager-product-form-group">
            <label htmlFor="productDescription">
              وصف المنتج
            </label>

            <textarea
              id="productDescription"
              name="description"
              rows="5"
              placeholder="اكتبي وصف القطعة..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* صورة المنتج */}
          <div className="manager-product-form-group">
            <label htmlFor="productImage">
              صورة المنتج
            </label>

            <input
              id="productImage"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            <small>
              اختاري صورة من الكمبيوتر أو الهاتف.
              JPG أو PNG أو WEBP، والحد الأقصى 5MB.
            </small>

            {previewUrl && (
              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <img
                  src={previewUrl}
                  alt="معاينة المنتج"
                  style={{
                    width: "180px",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>

          <div className="manager-product-form-grid">
            <div className="manager-product-form-group">
              <label htmlFor="productSizes">
                المقاسات
              </label>

              <input
                id="productSizes"
                name="sizes"
                type="text"
                placeholder="S, M, L, XL"
                value={formData.sizes}
                onChange={handleChange}
              />

              <small>
                افصلي بين المقاسات بفاصلة.
              </small>
            </div>

            <div className="manager-product-form-group">
              <label htmlFor="productColors">
                الألوان
              </label>

              <input
                id="productColors"
                name="colors"
                type="text"
                placeholder="أسود, بنفسجي, أبيض"
                value={formData.colors}
                onChange={handleChange}
              />

              <small>
                افصلي بين الألوان بفاصلة.
              </small>
            </div>
          </div>

          <div className="manager-product-form-actions">
            <button
              type="button"
              className="manager-product-form-cancel"
              onClick={() =>
                navigate("/manager/products")
              }
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="manager-product-form-submit"
              disabled={loading}
            >
              {loading
                ? "جاري الحفظ..."
                : isEditMode
                ? "حفظ التعديلات"
                : "إضافة المنتج"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ManagerProductForm;
