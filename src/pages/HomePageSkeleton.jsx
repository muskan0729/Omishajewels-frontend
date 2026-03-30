import "./home-skeleton.css"; // We'll create this CSS file

const HomePageSkeleton = () => {
  return (
    <div className="home-skeleton">
      {/* SECTION 1 - Hero Slider Skeleton */}
      <section className="hero-slider-skeleton">
        <div className="skeleton-slider">
          <div className="skeleton-slide active">
            <div className="skeleton-image pulse"></div>
            <div className="skeleton-content">
              <div className="skeleton-title pulse"></div>
              <div className="skeleton-text pulse"></div>
              <div className="skeleton-button pulse"></div>
            </div>
          </div>
          <div className="skeleton-dots">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-dot pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 - Feature Cards Skeleton */}
      <section className="feature-cards-skeleton">
        <div className="container">
          <div className="section-title-skeleton pulse"></div>
          <div className="features-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="feature-card-skeleton pulse">
                <div className="feature-icon-skeleton"></div>
                <div className="feature-title-skeleton"></div>
                <div className="feature-desc-skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Section Three Skeleton */}
      <section className="section-three-skeleton">
        <div className="container">
          <div className="section-title-skeleton pulse"></div>
          <div className="products-grid-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="product-card-skeleton">
                <div className="product-image-skeleton pulse"></div>
                <div className="product-info-skeleton">
                  <div className="product-title-skeleton"></div>
                  <div className="product-price-skeleton"></div>
                  <div className="product-button-skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - Section Four Skeleton */}
      <section className="section-four-skeleton">
        <div className="container">
          <div className="banner-skeleton pulse">
            <div className="banner-content-skeleton">
              <div className="banner-title-skeleton"></div>
              <div className="banner-text-skeleton"></div>
              <div className="banner-button-skeleton"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - Section Five Skeleton */}
      <section className="section-five-skeleton">
        <div className="container">
          <div className="section-title-skeleton pulse"></div>
          <div className="categories-grid-skeleton">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="category-card-skeleton pulse">
                <div className="category-image-skeleton"></div>
                <div className="category-name-skeleton"></div>
                <div className="category-count-skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - Section Six Skeleton */}
      <section className="section-six-skeleton">
        <div className="container">
          <div className="section-title-skeleton pulse"></div>
          <div className="products-grid-skeleton">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="product-card-skeleton">
                <div className="product-image-skeleton pulse"></div>
                <div className="product-info-skeleton">
                  <div className="product-title-skeleton"></div>
                  <div className="product-price-skeleton"></div>
                  <div className="product-button-skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 - Section Eight Skeleton (instead of Seven) */}
      <section className="section-eight-skeleton">
        <div className="container">
          <div className="newsletter-skeleton pulse">
            <div className="newsletter-content-skeleton">
              <div className="newsletter-title-skeleton"></div>
              <div className="newsletter-text-skeleton"></div>
              <div className="newsletter-form-skeleton">
                <div className="newsletter-input-skeleton"></div>
                <div className="newsletter-button-skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        
        .pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePageSkeleton;