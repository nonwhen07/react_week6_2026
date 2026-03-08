export default function HomePage() {
  return (
    <>
      <div className="container">
        <div className="section">
          <h1>HeroBanner</h1>
          <p>這是 HeroBanner 的內容。</p>
        </div>
        <div className="section">
          <h2>CategorySection</h2>
          <p>這是 CategorySection 的內容。</p>
        </div>
        <div className="section">
          <h2>ProductSection</h2>
          <p>這是 ProductSection 的內容。</p>
          {/* <ProductSection title="Featured Plants" />

          <ProductSection title="Seasonal Flowers" />

          <ProductSection title="Garden Supplies" /> */}
        </div>
        <div className="section">
          <h2>BrandSection</h2>
          <p>這是 BrandSection 的內容。</p>
        </div>
        <div className="section">
          <h2>ReviewSection</h2>
          <p>這是 ReviewSection 的內容。</p>
        </div>
        <div className="section">
          <h2>NewsletterSection</h2>
          <p>這是 NewsletterSection 的內容。</p>
        </div>
      </div>
    </>
  );
}
