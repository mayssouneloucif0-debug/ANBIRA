function PageHeader({ title, description }) {
  return (
    <section className="page-header">
      <p>ANBIRA</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

export default PageHeader;