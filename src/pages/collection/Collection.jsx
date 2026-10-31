import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import "./Collection.css";

function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("فشل تحميل المنتجات");
        }

        return response.json();
      })
      .then((result) => {
        setProducts(result.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("تعذر تحميل المنتجات حاليًا.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="collection-page">
      <PageHeader
        title="المجموعة"
        description="اكتشفي قطع ANBIRA المتاحة للبيع والإيجار."
      />

      <section className="collection-section">
        <div className="collection-intro">
          <p>ANBIRA COLLECTION</p>

          <h2>اختاري قطعتك</h2>

          <span>
            مجموعة مختارة بعناية لتناسب ذوقك ومناسباتك.
          </span>
        </div>

        {loading && (
          <p>جاري تحميل المنتجات...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p>لا توجد منتجات متاحة حاليًا.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >
                <div className="product-image">
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                  />

                  <span className="product-type">
                    {product.product_type === "sale"
                      ? "للبيع"
                      : product.product_type === "rental"
                      ? "للإيجار"
                      : "للبيع والإيجار"}
                  </span>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  <p>{product.price} دج</p>

                  <Link to={`/product/${product.id}`}>
                    عرض التفاصيل
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Collection;