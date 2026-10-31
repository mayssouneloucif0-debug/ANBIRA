function IntroSection({ title, text }) {
  return (
    <section className="single-piece-intro">
      <h2>{title}</h2>

      <p>{text}</p>
    </section>
  );
}

export default IntroSection;