import "./IntroSection.css";

function IntroSection({ title, text }) {
  return (
    <section className="intro-section">
      <p className="intro-label">ANBIRA</p>

      <h2>{title}</h2>

      <p className="intro-text">{text}</p>
    </section>
  );
}

export default IntroSection;