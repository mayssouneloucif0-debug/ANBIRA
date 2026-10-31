import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import "./Tailoring.css";

function Tailoring() {
  return (
    <main className="tailoring-page">
      <PageHeader
        title="الخياطة"
        description="اختاري نوع الطلب الذي يناسبكِ."
      />

      <section className="tailoring-options">
        <div className="tailoring-intro">
          <p>ANBIRA TAILORING</p>

          <h2>اختاري طريقة الخياطة</h2>

          <span>
            سواء كنتِ تريدين قطعة خاصة أو كمية بالجملة،
            يمكنكِ إرسال طلبك مباشرة من الموقع.
          </span>
        </div>

        <div className="tailoring-cards">
          <article className="tailoring-card">
            <div className="tailoring-card-number">
              01
            </div>

            <div className="tailoring-card-icon">
              ✂
            </div>

            <h3>الخياطة بالقطعة</h3>

            <p>
              اطلبي قطعة خاصة حسب التصميم والمقاس واللون
              الذي تريدينه، مع إمكانية رفع صورة التصميم.
            </p>

            <Link to="/tailoring/single-piece">
              اطلبي قطعتك →
            </Link>
          </article>

          <article className="tailoring-card">
            <div className="tailoring-card-number">
              02
            </div>

            <div className="tailoring-card-icon">
              ◇
            </div>

            <h3>الخياطة بالجملة</h3>

            <p>
              إذا كنتِ صاحبة مشروع أو تحتاجين كمية من
              القطع، أرسلي طلب الجملة مباشرة إلى ANBIRA.
            </p>

            <Link to="/tailoring/wholesale">
              اطلبي خياطة بالجملة →
            </Link>
          </article>
        </div>

        <div className="wholesale-note">
          <strong>قبل طلب الجملة</strong>

          <p>
            يمكنكِ اختيار تنفيذ قطعة تجريبية أولًا للتأكد
            من التصميم والمقاس والتفاصيل قبل تنفيذ الكمية
            الكاملة.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Tailoring;