import Link from 'next/link';
export default function Cta() {
  return (
    <section className="cta">
      <div className="container">
        <p className="eyebrow c">Sundays · 8:30 AM</p>
        <h2 className="h-lg">Ready to <em>visit</em>?</h2>
        <p>Come as you are. We gather at the Gate Gaborone Auditorium, Plot 54014, Gaborone West, and we would love to meet you.</p>
        <div className="actions"><Link className="btn btn-light" href="/contact">Plan your visit</Link><Link className="btn btn-ghost" href="/sermons">Listen to a message</Link></div>
      </div>
    </section>
  );
}
