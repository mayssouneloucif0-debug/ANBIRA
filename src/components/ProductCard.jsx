import { Link } from "react-router-dom";

function ProductCard() {
  return (
    <div className="product-card">

      <div className="product-card-image">
        <p>صورة المنتج</p>
      </div>

      <div className="product-card-info">
        <h3>اسم المنتج</h3>
        <p>السعر سيظهر هنا</p>

        <Link to="/product/1" className="product-button">
          اكتشفي التفاصيل
        </Link>
      </div>

    </div>
  );
}

export default ProductCard;