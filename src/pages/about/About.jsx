
import PageHeader from "../../components/PageHeader";
import IntroSection from "../../components/IntroSection";
import "./About.css";

function About() {
  return (
    <main className="about-page">
      <PageHeader
        title="من نحن"
        description="تعرفي أكثر على ANBIRA ورؤيتنا في عالم الأزياء والخياطة."
      />

      <IntroSection
        title="حيث تلتقي الحرفة بالأناقة"
        text="في ANBIRA نهتم بالتفاصيل التي تجعل كل قطعة مميزة، من اختيار التصميم إلى الخياطة والتشطيب النهائي."
      />

      <section className="about-story">
        <div className="about-story-content">
          <p className="about-label">OUR STORY</p>

          <h2>تفاصيل صغيرة تصنع فرقًا كبيرًا</h2>

          <p>
            ANBIRA هو فضاء يهتم بالتصميم والخياطة وتقديم
            قطع مختارة بعناية، مع الحرص على الجمع بين
            الجودة والأناقة والاهتمام باحتياجات الزبائن.
          </p>

          <p>
            نؤمن أن الملابس ليست مجرد قطع نرتديها، بل
            تفاصيل تعبّر عن الذوق والشخصية والمناسبة.
            لذلك نسعى إلى تقديم تجربة تهتم بكل مرحلة من
            مراحل القطعة.
          </p>
        </div>

        <div className="about-story-decoration">
          <span>✂</span>

          <strong>ANBIRA</strong>

          <p>DESIGN · TAILORING · STYLE</p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-values-heading">
          <p>ANBIRA</p>

          <h2>ما نهتم به</h2>
        </div>

        <div className="values-grid">
          <article className="value-card">
            <span>01</span>

            <h3>الجودة</h3>

            <p>
              نهتم بجودة الخياطة والتفاصيل النهائية في كل
              قطعة.
            </p>
          </article>

          <article className="value-card">
            <span>02</span>

            <h3>التفاصيل</h3>

            <p>
              نؤمن أن التفاصيل الصغيرة هي التي تمنح القطعة
              طابعها الخاص.
            </p>
          </article>

          <article className="value-card">
            <span>03</span>

            <h3>الاهتمام بالزبون</h3>

            <p>
              نحرص على فهم احتياجات الزبون ومناقشة التفاصيل
              قبل تنفيذ الطلب.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default About;