import heroImg from "../../images/herosectionshop.png";

const toLabel = (key) => String(key || "Shop").replace(/-/g, " ").toUpperCase();

export default function ShopHero({
  categories = [],
  activeCategory = "all",
  onChangeCategory,
  pageTitle,

}) {
  const title = pageTitle || (activeCategory === "all");

  return (
    
    <section className="hero">
    
  <img src={heroImg} alt="Shop Banner" className="hero__img "  />
      <div className="hero__overlay">
        
        <div className="hero__inner">
          {/* Back + Title */}
          <div className="hero__titleRow">
      
            <h1 className="hero__title">{title}</h1>
          </div>

          {/* Category chips (clickable) */}
          <div className="hero__cats">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`hero__cat ${activeCategory === c.key ? "isActive" : ""}`}
                onClick={() => onChangeCategory?.(c.key)}
              >
                <span className="hero__catName">{toLabel(c.key)}</span>
                <span className="hero__catCount">{c.count} Products</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}