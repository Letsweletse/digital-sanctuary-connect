export default function PageHead({ eyebrow, title, lede, children }: { eyebrow: string; title: React.ReactNode; lede?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="pagehead">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-xl">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
