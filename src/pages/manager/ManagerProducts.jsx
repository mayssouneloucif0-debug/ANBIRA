import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ManagerProducts.css";

const API_URL = "http://localhost:5000";

const getProductImageUrl = (image) => {
  if (!image) {
    return "";
  }

  return image.startsWith("http")
    ? image
    : `${API_URL}${image}`;
};

function ManagerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("managerToken");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل تحميل المنتجات"
        );
      }

      setProducts(result.data || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "هل أنتِ متأكدة من حذف هذا المنتج؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "فشل حذف المنتج"
        );
      }

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const getProductTypeLabel = (type) => {
    if (type === "sale") return "بيع";
    if (type === "rental") return "إيجار";
    if (type === "both") return "بيع وإيجار";

    return type;
  };

  const getStatusLabel = (status) => {
    if (status === "active") return "متوفر";
    if (status === "unavailable") return "غير متوفر";
    if (status === "archived") return "مؤرشف";

    return status;
  };

  return (
    <main className="manager-products-page">
      <section className="manager-products-header">
        <div>
          <p className="manager-products-label">
            ANBIRA MANAGEMENT
          </p>

          <h1>إدارة المنتجات</h1>

          <p>
            أضيفي منتجات ANBIRA وعدّلي معلوماتها أو احذفيها.
          </p>
        </div>

        <div className="manager-products-header-actions">
          <button
            type="button"
            onClick={() =>
              navigate("/manager/dashboard")
            }
          >
            لوحة التحكم
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/manager/products/new")
            }
          >
            + إضافة منتج
          </button>
        </div>
      </section>

      {error && (
        <div className="manager-products-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="manager-products-loading">
          جاري تحميل المنتجات...
        </div>
      ) : products.length === 0 ? (
        <section className="manager-products-empty">
          <h2>لا توجد منتجات حاليًا</h2>

          <p>
            ابدئي بإضافة أول منتج إلى مجموعة ANBIRA.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/manager/products/new")
            }
          >
            إضافة أول منتج
          </button>
        </section>
      ) : (
        <section className="manager-products-grid">
          {products.map((product) => (
            <article
              className="manager-product-card"
              key={product.id}
            >
              <div className="manager-product-image">
                {product.image ? (
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                  />
                ) : (
                  <span>ANBIRA</span>
                )}
              </div>

              <div className="manager-product-content">
                <h2>{product.name}</h2>

                <p className="manager-product-description">
                  {product.description ||
                    "لا يوجد وصف لهذا المنتج."}
                </p>

                <div className="manager-product-info">
                  <span>
                    النوع:{" "}
                    {getProductTypeLabel(
                      product.product_type
                    )}
                  </span>

                  <span>
                    الحالة:{" "}
                    {getStatusLabel(product.status)}
                  </span>

                  <span>
                    السعر:{" "}
                    {product.price !== null &&
                    product.price !== undefined
                      ? `${product.price} دج`
                      : "غير محدد"}
                  </span>
                </div>

                <div className="manager-product-actions">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/manager/products/edit/${product.id}`
                      )
                    }
                  >
                    تعديل
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    حذف
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ManagerProducts;