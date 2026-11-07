import Link from 'next/link';
export default function NotFound() {
  return (<section className="pagehead" style={{ minHeight: '60vh' }}><div className="container"><p className="eyebrow">404</p><h1 className="h-lg" style={{ margin: '22px 0' }}>Page not <em>found</em>.</h1>
    <p className="lede" style={{ marginBottom: 26 }}>The page you’re looking for has moved or no longer exists.</p><Link className="btn btn-dark" href="/">Go home</Link></div></section>);
}
