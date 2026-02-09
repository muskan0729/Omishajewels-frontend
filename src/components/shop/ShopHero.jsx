import { useGet } from "../../hooks/useGet";
import heroImg from "../../images/herosectionshop.png";


const toLabel = (key) => String(key || "Shop").replace(/-/g, " ").toUpperCase();

export default function ShopHero({
  // categories = [],
  activeCategory = "all",
  onChangeCategory,
  pageTitle,

}) {
  // const title = pageTitle || (activeCategory === "all");
  
  const {data, loading,error} = useGet("categories");
// console.log("categorydata", data);

  // const categories = Array.isArray(data) ? data : data?.data || data?.categories || [];
const categories = Array.isArray(data)
  ? data
  : Array.isArray(data?.data)
  ? data.data
  : [];
  console.log("data category",categories);


  // Find the category object that matches the active ID
const activeCatObject = categories.find(
  cat => String(cat.id) === String(activeCategory)
);

// Use proper name or fallback
const title =
  pageTitle ||
  (activeCategory === "all" ? "Shop" :
    activeCatObject?.name
      ? toLabel(activeCatObject.name)
      : "Category");



  // console.log("category", categories);
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
                key={c.id}
                type="button"
                className={`hero__cat ${activeCategory === c.id ? "isActive" : ""}`}
                onClick={() => onChangeCategory?.(c.id)}
              >
                <span className="hero__catName">{toLabel(c.name)}</span>
                <span className="hero__catCount">{c.ebooks_count} Products</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}