import { Link, useParams } from "react-router-dom";
import products from "../../data/products";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="product-details-page">
        <section className="product-not-found">
          <h2>المنتج غير موجود</h2>

          <Link to="/collection">
            العودة إلى المجموعة
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <section className="product-details">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <p className="product-category">
            ANBIRA COLLECTION
          </p>

          <h1>{product.name}</h1>

          <p className="product-price">
            {product.price}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-detail-group">
            <span>الألوان</span>

            <div className="product-colors">
              {product.colors?.map((color) => (
                <span key={color}>
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="product-detail-group">
            <span>المقاسات</span>

            <div className="product-sizes">
              {product.sizes?.map((size) => (
                <span key={size}>
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <Link
              to={`/collection/order?product=${product.id}`}
              className="product-order-button"
            >
              اطلبي هذه القطعة →
            </Link>

            <Link
              to="/collection"
              className="product-back-button"
            >
              العودة إلى المجموعة
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;