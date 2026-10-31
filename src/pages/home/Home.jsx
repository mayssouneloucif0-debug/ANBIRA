import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-brand">ANBIRA</p>

          <h1>
            أناقتكِ...
            <br />
            تبدأ من هنا
          </h1>

          <p className="hero-description">
            تصميم، خياطة، وقطع مختارة بعناية
            لتمنحكِ إطلالة تعبّر عنكِ.
          </p>

          <Link to="/collection" className="hero-button">
            اكتشفي مجموعتنا
          </Link>
        </div>

        <div className="hero-image">
          <div className="hero-image-placeholder">
            <span>ANBIRA</span>
            <span>✂</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-heading">
          <p>ANBIRA</p>

          <h2>ماذا تبحثين عنه؟</h2>

          <span>
            اختاري الخدمة التي تناسب احتياجاتك
          </span>
        </div>

        <div className="services-grid">

          <Link to="/jobs" className="service-card">
            <span className="service-number">01</span>

            <div className="service-icon">✂</div>

            <h3>فرص العمل</h3>

            <p>
              اكتشفي فرص العمل المتاحة وانضمي إلى فريق
              ANBIRA.
            </p>

            <span className="service-link">
              اكتشفي المزيد →
            </span>
          </Link>

          <Link to="/tailoring" className="service-card">
            <span className="service-number">02</span>

            <div className="service-icon">♡</div>

            <h3>طلب الخياطة</h3>

            <p>
              صممي قطعتك الخاصة حسب ذوقك واحتياجاتك.
            </p>

            <span className="service-link">
              اطلبي الآن →
            </span>
          </Link>

          <Link to="/collection" className="service-card">
            <span className="service-number">03</span>

            <div className="service-icon">◇</div>

            <h3>المجموعة</h3>

            <p>
              تصفحي قطع ANBIRA المتاحة للبيع والإيجار.
            </p>

            <span className="service-link">
              اكتشفي المجموعة →
            </span>
          </Link>

        </div>
      </section>

      {/* About Section */}
      <section className="home-about">

        <div className="home-about-content">
          <p className="small-title">
            من نحن
          </p>

          <h2>
            حيث تلتقي
            <br />
            الحرفة بالأناقة
          </h2>

          <p>
            في ANBIRA نؤمن أن كل قطعة تحمل تفاصيل
            خاصة تحكي قصة صاحبتها. لذلك نهتم بكل
            تفصيل، من اختيار التصميم إلى اللمسة الأخيرة.
          </p>

          <Link to="/about" className="text-link">
            اكتشفي قصتنا →
          </Link>
        </div>

        <div className="home-about-decoration">
          <span>✂</span>
          <p>ANBIRA</p>
        </div>

      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <p>ANBIRA</p>

        <h2>
          اصنعي إطلالتك
          <br />
          بطريقتكِ
        </h2>

        <Link to="/contact">
          تواصلي معنا
        </Link>
      </section>

    </main>
  );
}

export default Home;