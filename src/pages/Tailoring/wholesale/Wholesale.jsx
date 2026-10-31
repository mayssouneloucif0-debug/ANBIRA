import PageHeader from "../../../components/PageHeader";
import WholesaleForm from "../../../components/WholesaleForm";
import "./Wholesale.css";

function Wholesale() {
  return (
    <main className="wholesale-page">
      <PageHeader
        title="الخياطة بالجملة"
        description="أرسلي تفاصيل طلب الجملة مباشرة إلى ANBIRA."
      />

      <section className="wholesale-intro">
        <p>ANBIRA WHOLESALE</p>

        <h2>اطلبي خياطة بالجملة</h2>

        <span>
          أرسلي التصميم والكمية والمقاسات والتفاصيل المطلوبة.
          ويمكنكِ اختيار تنفيذ قطعة تجريبية أولًا قبل اعتماد
          الطلب الكامل.
        </span>
      </section>

      <WholesaleForm title="تفاصيل طلب الجملة" />
    </main>
  );
}

export default Wholesale;