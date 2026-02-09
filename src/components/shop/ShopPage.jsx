import { useEffect, useMemo, useState } from "react";
import ShopHero from "./ShopHero";
import "./shop-page.css";
import { usePost } from "../../hooks/usePost";
import { addToCartManager, addToWishlistManager } from "../../utils/cartManager";
import { useGet } from "../../hooks/useGet";


// const API = "https://dummyjson.com/products?limit=100";

const toLabel = (key) => String(key || "").replace(/-/g, " ").toUpperCase();

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(n)) ? Number(n) : 0);

const finalPrice = (price, discountPercentage = 0) => {
  const p = Number(price || 0);
  const d = Number(discountPercentage || 0);
  return Math.max(0, p - (p * d) / 100);
};

const priceRanges = [
  { key: "all", label: "All", min: -Infinity, max: Infinity },
  { key: "0-3500", label: "₹0.00 - ₹3,500.00", min: 0, max: 3500 },
  { key: "3500-7000", label: "₹3,500.00 - ₹7,000.00", min: 3500, max: 7000 },
  { key: "7000-10500", label: "₹7,000.00 - ₹10,500.00", min: 7000, max: 10500 },
  { key: "10500-14000", label: "₹10,500.00 - ₹14,000.00", min: 10500, max: 14000 },
];

export default function ShopPage() {
 
  //api call
  const { execute: cartExecute } = usePost("cart/add");
  const { execute: wishlistExecute } = usePost("wishlist");
  const  {data} = useGet('products');
  console.log("product_Data",data);

  // hero category
  const [activeCategory, setActiveCategory] = useState("all");

  // filters
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceKey, setPriceKey] = useState("all");

  // top show + grid buttons
  const [showCount, setShowCount] = useState(9);
  const [gridMode, setGridMode] = useState("grid3"); // grid2 | grid3 | grid4

  // data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

useEffect(() => {
  if(data?.data){
    setProducts(data.data);
    setLoading(false);
  }
}, [data]);


  // categories + counts
  const categories = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const k = p.categories || "other";
      map.set(k, (map.get(k) || 0) + 1);
    }
    // keep stable order like your screenshot (by count desc)
    return Array.from(map.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // top rated left list
  const topRated = useMemo(() => {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  }, [products]);

  const filtered = useMemo(() => {
    const range = priceRanges.find((r) => r.key === priceKey) || priceRanges[0];
    let out = [...products];

    // category filter from hero click
    if (activeCategory !== "all") {
      out = out.filter((p) => p.categories === activeCategory);
    }

    // checkbox filters
    if (onSale) out = out.filter((p) => (p.discountPercentage || 0) > 0);
    if (inStock) out = out.filter((p) => (p.stock || 0) > 0);

    // price filter (based on discounted price)
    out = out.filter((p) => {
      const fp = finalPrice(p.price, p.discountPercentage);
      return fp >= range.min && fp <= range.max;
    });

    // sorting
    switch (sortBy) {
      case "popularity":
        out.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      case "rating":
        out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newness":
        out.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "low-high":
        out.sort(
          (a, b) =>
            finalPrice(a.price, a.discountPercentage) -
            finalPrice(b.price, b.discountPercentage)
        );
        break;
      case "high-low":
        out.sort(
          (a, b) =>
            finalPrice(b.price, b.discountPercentage) -
            finalPrice(a.price, a.discountPercentage)
        );
        break;
      default:
        out.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
    }

    return out;
  }, [products, activeCategory, onSale, inStock, priceKey, sortBy]);

  const visible = filtered.slice(0, showCount);

  const clearFilters = () => {
    setOnSale(false);
    setInStock(false);
    setPriceKey("all");
    setSortBy("default");
  };

  const heroBack = () => {
    // go back to "Shop" view
    setActiveCategory("all");
  };

  return (
    <div className="page">
      {/* HERO */}
      <ShopHero
        categories={categories}
        activeCategory={activeCategory}
        onChangeCategory={setActiveCategory}
        pageTitle={activeCategory === "all" ? "SHOP" : toLabel(activeCategory)}
        onBack={heroBack}
      />

      {/* breadcrumb row below hero (like screenshot) */}
      <div className="crumbRow">
        <div className="wrap">
          <div className="crumbText">
            Home <span>/</span> <b>{activeCategory === "all" ? "SHOP" : toLabel(activeCategory)}</b>
          </div>
        </div>
      </div>

      {/* SHOP BODY */}
      <div className="wrap shopWrap">
        {/* top row (Show: 9/12/18/24 + grid icons) */}
        <div className="topRow">
          <div className="topRow__left" />

          <div className="topRow__right">
            <div className="showCount">
              <b>Show :</b>
              {[9, 12, 18, 24].map((n, idx) => (
                <span key={n} className="showCount__item">
                  <button
                    className={showCount === n ? "active" : ""}
                    onClick={() => setShowCount(n)}
                  >
                    {n}
                  </button>
                  {idx !== 3 ? <span className="slash">/</span> : null}
                </span>
              ))}
            </div>

            <div className="gridBtns">
              <button className={gridMode === "grid2" ? "active" : ""} onClick={() => setGridMode("grid2")}>
                ▦
              </button>
              <button className={gridMode === "grid3" ? "active" : ""} onClick={() => setGridMode("grid3")}>
                ▦
              </button>
              <button className={gridMode === "grid4" ? "active" : ""} onClick={() => setGridMode("grid4")}>
                ▦
              </button>
            </div>
          </div>
        </div>

        <div className="layout">
          {/* LEFT SIDEBAR */}
          <aside className="sidebar">
            <div className="box">
              <h3 className="title">STOCK STATUS</h3>
              <label className="check">
                <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />
                <span>On sale</span>
              </label>
              <label className="check">
                <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
                <span>In stock</span>
              </label>
            </div>

            <div className="box">
              <h3 className="title">TOP RATED PRODUCTS</h3>
              {loading ? (
                <div className="muted">Loading…</div>
              ) : (
                <div className="toprated">
                  {topRated.map((p) => {
                    const fp = finalPrice(p.price, p.discountPercentage);
                    return (
                      <div key={p.id} className="topratedItem">
                        <img 
                        src="data:image/jpeg;base64,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"
                        // src={p.ebook_file} 
                        alt={p.title} />
                        <div>
                          <div className="topratedName">{p.title}</div>
                          <div className="topratedMrp">{money(p.price)}</div>
                          <div className="topratedPrice">{money(fp)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* MAIN */}
          <main className="main">
            <div className="filtersRow">
              <div className="filtersCol">
                <h3 className="title">SORT BY</h3>
                {[
                  { key: "default", label: "Default" },
                  { key: "popularity", label: "Popularity" },
                  { key: "rating", label: "Average rating" },
                  { key: "newness", label: "Newness" },
                  { key: "low-high", label: "Price: low to high" },
                  { key: "high-low", label: "Price: high to low" },
                ].map((s) => (
                  <button
                    key={s.key}
                    className={`link ${sortBy === s.key ? "active" : ""}`}
                    onClick={() => setSortBy(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="filtersCol">
                <h3 className="title">PRICE FILTER</h3>
                {priceRanges.map((r) => (
                  <button
                    key={r.key}
                    className={`link ${priceKey === r.key ? "active" : ""}`}
                    onClick={() => setPriceKey(r.key)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="metaRow">
              <button className="clearBtn" onClick={clearFilters}>
                ✕ clear filters
              </button>
              <span className="pipe">|</span>
              <span className="metaText">
                Showing: <b>{visible.length}</b> / {filtered.length}
              </span>
            </div>

            {error ? <div className="error">{error}</div> : null}
            {loading ? <div className="muted">Loading products…</div> : null}

            {!loading ? (
              <div className={`products ${gridMode}`}>
                {visible.map((p) =>   {
                  const productData = {
  product_id: p.id,
  id:p.id,
  name: p.title,
  price: finalPrice(p.price, p.discountPercentage),
  // image: p.ebook_file,
    image: "data:image/jpeg;base64,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",
  quantity: 1,
};

                  const hasDiscount = (p.discountPercentage || 0) > 0;
                  const fp = finalPrice(p.price, p.discountPercentage);

                  return (
                    <div key={p.id} className="card">
                      <div className="media">
                        <img
                         src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExMVFhUXGRcYGRgXGCAfHRgfIRgZGBcZIBcbHigiGhslGx4dIjEjKSkrLi4uGCAzODMsNyotLisBCgoKDg0OGxAQGy0lICUtLS0vLS8tLTUuMC0tLS0tLS8tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIARoAswMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYDBAcBAgj/xABGEAACAQIEAwUFBgIIAwkBAAABAgMAEQQFEiEGMUETIlFhcQcygZGhFEJSYpKxI9ElM0NygsHS4RUkohYXNDVjc4Ojsgj/xAAbAQEAAgMBAQAAAAAAAAAAAAAAAwQBAgUGB//EADoRAAIBAwIEAwYEBgEEAwAAAAABAgMEESExBRJBURNhcQYiMoGRoRTB4fAVIzNCsdFSJDRi8RZDcv/aAAwDAQACEQMRAD8A6XXyU6woBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQHhNtzyrMYuTSRhvCyyITMzKQiXQMDZyBsQ1jbVs2xXl4+Vep/gtOzh41bE+XGYrOzWmcbdTlfjZVpeHDTPXzTNrKMQXj73vqSj+qm1/iLH41y+M2kLe5zSXuSSlH0f8AotWVZ1KXvfEtGb1ckuGOedEF3YKPEm1T29pXuJctGDk/JEVStTprM3gjH4jw4NrsfML/ADrvx9kOJyWeVL5o5z4xbJ4z9iXrzJ1hQCgFAKAUAoBQCgFAKAUArAFZArKTbwjDeNyMzHMWQsqqLhBICd9QDWceoFd/h3CKdeMZ1W8OTi12bXut+TOfc3koScYrZZ9V1NfE5y2shNGlQh722oMA19RICix8CSav2/s/SVBSrZ5nzLTo08Yx1+xXqcRnz4hjGnzybWUxsplD6ydezMTZltdbdOpvbrXN4zVpSVF0cJcuqW6ls8+pZsYTXPz5znd9uh5FlSKxkZiSGLAseV1sb3253Nxb6VtV41c3FFW9OOMpRaS3w9PtoYhY0qc/Ek+udTDic8w8d9PeYm50DmfEtyP1q1a+zPErxR8X3YpYXN28kQ1eKW1HPLq/L/ZC43iWVr6bRjy3PzP8q9bZex9lQ96tmb89vocmtxivU0hp/kp2acWYdSS0hlf8p1fDUTb613lWtraPJSSXkkVo2lxWfNP7kC/HL37sC26Xc3+gqF8RfSJaXC441kz9A18RPWCgFAKAUAoBQCgFAKAUMCsGTBiMUibFhqIJC33NvAcz8quW1lWr6xi+XOr6IhqV4Q0b17GLA40yx61Ug7gBvEenS+3TlVq/4dGxulRqTytMtdmQ29y69LnisPz7kP2ssymP3mBV27yldjYx93Yb7gEn3d69QqNjYzVx8MWnFaPm12lr+SOU517iLp7vd9vQ3cDlZAUkaCrswFwbhlsymwCi/gNhXLveNxc5Rp+8pRSzjGqeU11ePMt0LFqKctMN/R9DyXEYWAKpKsU2XYMw62v0+lYoWnGOIzlOCcVLfeKE61nbJJ4bXzZG4zihjtGgXzbc/IbD616Gx9iaUfeuZ83ktjnV+OTlpSWPUqudcSxqf4892H3L3P6F5fSvT0LexsY4pRS9Nyg43V08yy/XYqmYcbk7Qx2/M/8ApH86xU4g/wCxfUtUuGJazf0K1j8zmm/rJGYeHJf0jaqNStOp8TOjTo06fwo1KiJBQH6vr5GdcUAoBQCgFAKAUAoDBjMSI1LtewIvbpcgX9BVqytJ3dXwoNZw8Z8uhDXrKjHnexr5li3jaPSoZWJS3LvH3O90HOujwrh9C7hVjUk4yjr8l8WncrXdxUouDisp6fPoR+Mx0rd3Sy6GKydmSeagobqpbTz6eFduy4XZUV4nMpc0U4c6S666N4yUa91Xl7uMYeHj7H0mAlYK4Z1dgAzsdJ2JCnswDfboSPMVpU4raUHOjKKcU3iKWVqtfe9fI2ja1p8s03l7t+XkbrdjAzO0hXUSdJba53JCDe5rlf8AXcUhGlTpZ5dObGuOmX5Fv+RaNylLGemfyIzFcTqNokv5tsPkNz9K79n7GV6uJXdTHktX9Wc6txuEdKUfmV3OOI2AvNMEU9L6QfKw3b616u14Nw6wWYxWe71Zy53V1dPGX6LYp+P41jXaFC58W7q/LmfkKt1L+K0giSnwyT1qPBWsw4hxMuzSFV/CndHzG5+JqhUuqs92dGlaUqeyIoCq5ZFAKAUAoD9X18jOuKAUAoBQCsAx4iYIuohjy2UEnnbkKsW1vKvU8OOE9d9NiOpUVOPMzDiswijNnax57Amw5XNhsPWrVtwm6uYuVOOm2rxlrt3Iat5SpPEn+/PsaMubOC7aF7ONwr3JLWJ98W2tYg12KfA7blhCU34k4uUdPdyv7X550KUr+pmUklyxeH39TWTDyNIVtIUOtH1k2KkbOCSF8wFGwro1Lm1oW0ZZiprllHlxlNbx7+rZXjTq1KrWrTynnt0fb6Ei2GXsFSdlsAoLXsNuRueu3715+ndVXfyr2EHq3pjO+50JUoK3VO4e3X0I988w8IKxLq3vtsCfEsdz9a7lP2Z4lfyVS7lyrz3x5JaIoS4pbW6caKyQ+YcSSkEl1iTrY2t6sf8AavT2fstw+196a5n3lt9Dm1eKXNd4jp6FMzHjDDoTpLSt+Xl+s8/heuu7ujSXLTX02IqfD61R5m8epWsw4uxEmykRD8u5/Uf8gKp1L2pPbQ6NKwpQ31IKRyx1MSSeZJuT8TVRtt5ZcSSWEfNYMigFAKAUAoBQH6vr5GdcUArAFZMGHE4pIxd2C+vXyA5k1atrKvcy5aUW/wDBFVr06SzN4NKbNLqDEASWK97UCGG+nQBqJP0tXXtuBtVXC5bWFn3cNY7822EU6t/mClS9Ne/bG5owOZG7QiRkmUoyruEYdwggdLXIJrs16dO2pfh4uKnSkpJy3lF66eZSpzlUn4jTamsNLo9jPDlcmjvSaSyBJNg1wt1DA9CV9apVeNW/ipU6fNyy5odMN7prqsk8LGpye9LGVh+aQmzLCw3sdTEKpC73Ciy3Pu7ClDhHF+IcrmuWKbab0xnV46id5Z2+cavbTyIrGcTSNsgCDx5n67fSvSWXsZa0veuG5v6I5lfjVWelNY/yVHN+KoFJMkxkfwU6j6X5L6EivRQdpaR5aSS8kimre5uHzSz8yrZhxrK20SBB4t3m+XIfWoKnEJv4FgvUuGQXxvJXcXi5JTeR2c/mPL0HIfCqU5ym8yeS/CnGCxFYMFaG4oBQCgFAKAUAoBQCgP1fXyM65jM63I1LdbX3G1+V/Cpo21aSi1F4ltpv6EbqwTab2I7GZ0oUtFaTSRrt0B638L9dxXcsfZ+pOpyXPuZTcfNrp6+RQr8RjGOaXvYevp3NfH5nIspW4SwQgEXD3He6am3uAFHSuhY8HtZWvPJczbkm9nHG3kvmV695VVXlWm3z/wBn1HlTaZF5N2odHO97WK33vtuPjUVbjVOFSlOOseRxlFaYe333N4WUnGUXvzZTMmPOFRnMrAlipKc9wLAgDcG1R2EeLXEIU7aDSjlKT00fR57G1w7OnJyqvV648yNxHEoA0wxhR4t/pH8671t7GupLxL2q5Psv9s59XjSiuWhHCKznXEir/wCInH92/wC0a/yr01vY2Fgv5cUn9Wc+U7q6euX/AIKlmHG43EMd/wAz/wCkfzFb1OIf8F9SxS4X/wA39Ct5hnE839ZISPwjZf0jn8b1RqV6lT4mdGnb06fwo0KhJhQCgFAKAUAoBQCgFAKAUAoD9X18jOuRWY4AtJsLrIjRv5W3Rvga9HwzikKNtibxKnNSj55+JHMurWU6uUtJJp/kw+HRAjTsqkR9m4vs42+J+HjW8Lu6uJzp2cJNOfPF9YmrpUqajKvJJ8uGu5oPxBDEuiFC1uRNwPXfvH6V2qPstfXk/FvKnLndL9NClPitCiuWjHOO/wC8kHmvEb2JllEaeukel+Z+dektPZ/htkublTfeWpzql9dXLws+iKbj+M4VuIlaQ+Pur8zuflXQnfQisQX5GafDaktZvBW8w4nxMu2vQvgm3/Vz+tUal3Vn1wdClZUafTPqQ5qsW9jysAUAoBQCgFAKAUAoBQCgMkULNcKrNYXOkE2HU7chWHJR3ZnB8VkweUAoD9L4ziKFNlJc/l5fqP8AlevGWPsjfXGHUXIvPf6Ga/GKFPSPvPyIPHcSSsDYiNfLn+o/7V7Cy9krC2xKr7789vocatxe4q6Q09Nym5nxdh0J75lf8u//AFnb6mu3+It6EeWmvkiGFlXqvmnp6lZzDjGd9owsQ8t2+Z2+lVal9Ul8OhfpcOpR+LUgJ5mc6nYs3ixJPzNU5ScnlsvRiorCRjrUyKAUAoBQCgFAKAUAoBQH1GhZgqgsx2CqLk+gG5o2ksvYG7mOT4iBY2miaMSAlNWxYDmdPMfHxHiKhpXFKq2oSzjfBs4tbknwXwu+Om07iNRdmvp/CCAxB3AYHkenQ3Fe+vYWtPme/Q2hDmeCZ4j40EbywZciwQn+GWUL37FtTKALANex57ILWub1bTh8pwjUunzS39M9PkbTmk8RKKTXYITygFAW3H8bOdoYwv5n3P6RsPma6VTiEn8COXS4ZFazeSt43MJZjeWRm8idv0jYfKqM6s5/EzoU6UKfwrBrVGSCgFAKAUAoBQCgJGDIsS8iRdjIryX0CRSmqwubF7X26C5PQE1BK5pKLlzLTfBtyvODbxGTQnDPiYJ2dY3SNhJH2eosCQYzqbVy902Nt/AVHG4n4qpzjum9Hn6meVYyiDq2aCgLDwnwhiMeW7IoqpbWzHlcEiyjcnbrYedUb7iNKzSdTOpJCm57GLHZKuDxZgxwk0LveDTd1PusuraxsfMfCtqV1+JoeJbta98mHHleJHRMfMmAypMVl0aqXaINI6hnsVtrPQPqAuOQYtYda4FNSu790bqWUk9Fot9vPT7Fh+7TzE5TmWZy4iQyTyNI56senQAcgPIV6elRp0Y8lNYRVcm9WdO4HzHBz5d9ikn7KUal1PYaC7Og0MbXJViPLXbxv5ziVK5pXf4inHmj2XXGupYpuLhytkUfZTJzGOwum/Pf3fG17X8r/GrP8ej1pTz6GvgeaIvPeAZoITiIpYsTEuoSNFzTSLsSCbEDxBvuNt6tW/FqdWoqU4uEnsn1NZUmllalQrqEQoBQCgFAKAUAoBQCgPR8T6cz6edHsC78SYCLAYiMCKGJUmikW8jyTyIGDaiCAIlte6kKSRtqAvXJtq0rmnJ8zejW2En28yaUeVkhjMZi8KcUcUzPGkyTYR5G1F3EwIMTE3KNDfVbYeRqCNKjW5PCWG01JLtjr5pmctZyV/P89w7zSqkSzYbW8kWsyI0ZfvOFAewGsnYrvV62tqkacXJ4lhJ7a4NJSWdNiu4ONWkRXbSrMoZhbugkAnc22q7NuMW1roaI6VN7IHEcmmcGUMezB91lBt3u6CGIsb8gTa21z5xe0lPnScXjq+zLH4d4Knwdnj5djdTrYXMMym/dGsBz3ebKRfryPjXU4haQvrflXqvyIqc3CR0X2wZMJsKuLQXaLSbje8ZuT5WFwfO/M1532eunSrO2n1zp5li4jlcyJLLYoJsliGJDPCkKuyx3vpjGpF7p3IUL1FyL7XtVeu6tLikvB0k3hN+e5ssOnqcy4i4gjxZTC4DBLChNgqoO0kJKtyXluo6nzNentLWdtF1LmpzPz2RWnJS0iiJ4g4XxWDCfaYwvaA6bMreFwdJNj+9ja9qs2t9Qusuk84NZQlHc2uEuDXxwkk7SKGKK2t5OmxNwuwNgNySBUd9xBWuI8rlJ7JGadPnJniPOMLhMM+W5excO3/MTk3D91e6pBtY+6eQGkje96p2ltXuKyurlYx8Me3qbylGK5YlErtkAoBQCgFAKAUAoBQCgFAS2YYnETRRI8J/5aPTr7NtWjUdOtvwr7o9DVenCnTlKSl8T2zpny/M2eWRJ/bb/AGqwkjU65wr7OMJJBDLMXdpUDd2TugFLgjui53Bsb2sOe9eVv+NV6dSUaa0T6r9S1CjFpNlD48yZcNi5Y0QpHqOhSdVhYEWa/UG+k7gEX5gnu8OuHXt4zk8vqQ1I8ssHRc24sOGGXY03KYiFFkQb3AXU5sTYsGcWIt7rAncW87R4fG48e26xk2n6k8qnLiRWvaTw4p/pTDNrw+IKsQA11LLcty2Unne1i1q6XCL2X/Z1licNPVI0qw/vWzLhwxH/AMQyNYdbBlRoT2ZsbpsinUbHUmm4O3e2tYW415L8DxTxMaPD189/oSw9+lgx+yLNVkwrYGS3aQmRSuoHWhYkn0DMVuNraa24/bzhXjcw2ePk/wBUYoSTjysjZY8LkULNGUnxcjFVJIui7kd3cqoFrn7xI6bC1F1+LVEppxprdd2avFJaas5hmeYy4iRpZnZ3bmSSbeAFzsANhXpqVGFKPJBYRWbb1ZqGpDBu4DKp5v6uNmH4uS/qNhUtOjOfwoiqV6dP4mWTL+CDzmk/wx/6iP8AL41ep8Pe82c6rxRbQX1J2PhnCAAdip8yST871bVnR7FJ31dvc5jXBPRigFAKAUAoBQEnlXD2LxNjBBJICbagO7zt7x2G9QVrqjR/qSSNlFvYx5zk0+FcRzxlGZQwv1B8x1uCLcxas0LmnXjzU3lCUXHc7Zw/nsIwmCmkRbzoIpJbA2KARXfqVLKAT0Om+248bdWteVerCEn7jyl666FuMoqKb6nMvadkC4TGHs00QygPGB7oNgHUeHe3t+bbavR8GvHc2yc3mS0ZXrQ5ZabFvwMIxWTQNFK8LYVGZQo/tI798nTe1r8jb+Jvy35U3+H4jNTipKbWvk+hKveprHQ9xhjznLu27v2uAESIovYk2vYXJUqCykG17g3sbKPPwy88J/057NvYPFSGeqNLGQl+HwjAmTDuyte3c0SlgDe2kaGXxJ1L05TU24cVbW0lleen3MNfyiH4E4uSNPsGL3wkgkQ720B92JYG4UG/L8Z8BVviPDnOX4mj/UWH64NKdTC5XsR3DPFRy+eQQkyYV2GpXWxZRyIF7K9tr3sflae74fG7px8RYmuvZ/6NYVHB6bEFisUBJIYDJHG5ay6t9JJOg6bBgBt4VehD3Up4bX+TTOuhhwuFeQ2jRnPXSL/Pw+NTxhKWkVk0nOMFmTwWLL+DJm3lZYx4DvN9Nh8zVynYTl8WhQq8Spx+DUs+XcK4eMaxGXta7v3gD06aQfhV2na0YPG7OfVvK1Rdl5EsBVtIpNt6sVkCgON15c9cKAUAoDNHhZGGpY3YXtcKSL+FwOflWrnFPDa+pnDN/h2fCLLbGRO8TWBZHKtH4tpHv+nltUF1Gu4fyGlLzWjMxxnUtvtI4Ojw6pPh0AiPOxY2uGe3u202BIa4sAQfu25nCeJSrt06nxIlq0+XVE7wLmRw+T9uIe0ZZHCog3l0t2l2YKdOkarH8o6mqHE7fx+IeG5YXLu+mdNNdcm9OXLTya/H2XJmGGTMMKdXuh1ubrz1awAQCgNie6ALklha2/Ca0rOq7Ot8n39PUVUprnRH5PCcTw/NGCQcPLI3I7gASFPU6j6danryVHisZf8AOOP1NY60sdiQ4OzaLMsG2X4yX+NcLE5sXYbsGBbmy6bHry3uRUN/bzsrhXVuvd/uXQzCSnHlkbHsqMkS4zAYjumJ1NmsdBKsTyNiDpDCxIN/O5j4ylUdK6o657dTajpmMig4fMny7Gs2FmWRUZQSh7ky2DFTa46kbXsb2ru1KEL23UascZXXdMgUnCWjNjijjFsSHSGMwRSMZJV16jI5tuTpBA25XO23LatbTh6opOb5pJYT7ITqc2xV1Uk2AJJ5Abk/Cuill6ETaW5OZfwpiZNyojXxfn+gb/O1WqdnVn5Ip1b+jDrl+RZct4NgUjXqlY2FjsCfJBz9CTV6FjTgsz1OfU4jVnpDQueE4fKqL2hUAlhp933bWVeezA9Ng3Oxrf8AEQjpBZ9CLwKk/em/qbSLhYT39UjAAEbMLn3tth3WBFidw4YVrmvUWmiM4oU3rqzF/wAQlmJijS+pQoXn7o3IB2BIG/mK2VGFNKc3sauvOo+SC3NLEYF0UO1rG3UXF11LcdLruKnhWjOWEQToyjHmZrVKRigON15c9cZ8HhHldYo1LO5Cqo6k8hvtWlSpGnFyk8JGUs6Ito4HhiYJjMyw0ElgTGBrK3tsTcAG1/8Acb1y/wCKTqLmoUZSXfYl8JLd4MmaezHFxxdtC8eJW2q0V7kbbqPv9eW+3W9a0eOW86nhTTi/MzKhJLKLL7GMSWixMQuF7pK7gBioUm9jp1HmN7ab2rne0MUp0qnXP2N7d7o5PicP2bvGSDoZkuORsSLg2Fxt4CvUQlzRUu6KzOwZbMZ+HGue8kUiAk2toYqveuNtNhv42NeSqx8HjKwtHhv5lpPNHUjvYjjr/aMNqN9pVWwsRbQ+5BI30Xqz7R01FQq464ya273RGcPcT/8ADcXiMNPc4V3fVYXKm+ntAD4gd5Rt4bWvZvLBXtGFWn8cUsefkawnyNp7FjxSwZbDigXLYbERxmEgjU8mgqbFRbSQF8OTbWqlDxb6pTnjE4N8y8vmbvEE10Zx+KVlIZGKsNwV2I9Lcq9TKKksPYrGxnOay4mVpp31O3M9AL3CgdFHQVHRoQpRUILCQcm3lmfL8hxE26RkL+Ju6PrufgDVynbVKmyK1W6pU/iZZMBwSg3mkLflTYfq5n6Vfp8PS1mznVeJt/00XLJ+GwutI40iZdNww0sdTBRcne2+536VNzUqKTitytitXb5nt3JCXBrAY3YhzrBZCLdy191YBgTuOW1vMVlVZVcpLGm/mYlSjRxJvOu3kZ2zdUDLh47DY69Nt9VlOm7bW02ueYJ6kVH+Hbw6kvkbu4UcqnH5nrQzYhlDL2SAaNOy8rtfQbXA1i9hsrUUqdFaPLMuNSs1lYR8thMPFtLpdl2srHvd5bnuk2Ni6i9rGNbjesqpVqfDojDp0qaxLVjFYsNHH2KOGjcMCFFlACp0G5Y6Gtvu3M3FYpwcZvxGsNCc1KK8NPKZGYyaQnTIT3funYL5BeS+gFWqcIJZiVakpt4ka9SkYoDjdeXPXG3lWYyYeVZojZ0NwenoR1HlUdWlGrBwlszKeHk6fxxlyYzKoswWPRKAJXuQSwYKklz15KR6chvbzPDridvfytZPMdl5dUWakeampEH7I+JXgxK4RiTDMbAE+49iQwH5rWPwPSrnHrCNag60fijr6o0oTxLBbMu+z4DOHwqjTHi4V5sbK4L6V3vzTz5n4Vy6zrXvDlW/ug/sSrEKmO5UOP8AhCcY9/s8Lustn7q90M7MLazsDcdT187Dr8L4lTnaKVSSTWnnoRVabU8IkOL8WcBl0GVgqZWXVMRvbUxcjwPVd7G2k9ahsKau7ud5/btH5dTM3ywUCncJZ+cDiO3EYk7pXSW08yp5gH8P1rrXtorql4beCKE+V5PjijiCTGzmeRVU20gL0AJIuT7zWNidvdGwtW1paQtaapxE5OTyzSwWXyzW7ONn6AgbDflqOw3v1q5ClKfwogqVoU17zLHgOCXO80gUfhTc/qOw+Rq/T4fJ/Gzn1eJxWkFkt+RcJxD+piUkEDU7C9zfSAWPM2PKrPh0aGMoputXuM66fQsOGypYysk5GnuMUXmQSt7k2tYMDte+9JXLmuWnv3MRtuR81T6HpxmGjA7NCzWKsb+YuVYgixttZR3WPI1hUq0/iegdWjD4FqajyTTHUFNyuhmF+8NJ95ibE6V59dPjUqVOmsN+f/oibq1HlLyNp8mCAmaUA3sLX53KknUASAwANgb6rg7VH+Jb0px/fyJPw6WtSX7+Z8SY+KOQPh1IXTYhr876kO5O4IU+F186yqU5xxVeuTDqwhLNNaY1PtPtM4sCUVtKhe8qEFrXBN7jURff7w+Gv8mi+7+5svGqrsvsfGWYaDSXlcWuVYb3tYWZRa7G+/SwB2ratUqZUYLzNaNOnhub8jI+dBV0xKeti21h3tOwJNwCBe/9khrVWrk8zZs7pRWIIi8ZimkbW/PYbeXKrVOmqceVFWpUc5czMNSGgoDjdeXPXCgOx+yLMFlwUmDLDUhfum1wjb6gOo1Fh6geNeS45S8K6hc47a+aLdB5i4kHwzwK+Em+140pHBhnLLdheUrcxsL20rcBt7E25VduuKRuafgW+spLD7LO5pGlyvmlsU7ifO2xeKkxJuNTDRa40qtlTbUdLWAJseZNdaztY29CNJdP2yKcnKWSeg9qGZKiprjawA1sl2Nje5IYXJ5HbkPG5NGXArNzcuXfpnQ3VeeCuYmbEY3ENJpaWaQgsI0ueQUd1RsLAV0IRo2tJRyoxXdkbzJ5LZknspxstmmKYdfBu+/6FNh8WB8q5N17RWtLSGZP7fUmjbze+h0HJPZrl+HsWjM7j70xuPhGLL8wfWvOXXtBd1tIvlXl/ssRt4o0s4kBmewAVToUAWAC7bAchtf419R4DbujYU09W1lvzZ47iFXxLiT6J4+hpV2CkbGExMi6ljJHaAIbczuCLed/3NR1IRlrLpqSU5yjlR6m9Hk8h09q4QA2AYkkKArMRa62CHUN97G3Kq7uYL+msk6tpv43g+2kw8U1ygkQot1BD2bYMNV7b2J1Dlq8rVhRq1Ke+Hn7GW6VOpnGVg9hzTESMQiFu6VtubXRY28rGwNuWo1h0KUF7zMxr1Jv3UfK5OQA08mkaVNubAHTa4YiwAYHa+wYcxWfxK2pox+Ge9RnmFzFIkKqo7Qa1LAAh+8Gje5PQ3HLdW51mdGVSWXtp+qMQrRpxwlr/nsYcVnEjbCyKNgF2sOQF/IAC/5R4VvC1hHzNJ3M5aLQjiasFcVkCgFAKwDjdeYPXCgJbhniGbBSmaHSSVKsrglWGxFwCORAI3qrd2dO6p8lTbfQ3hNxeUecQZ9PjZQ8pu1gAi3tfqQlzuTc7eNqzbWtK1hyw0XcxKTk8sl8k9neYYix7LsUP3pjp+SWLH5D1qndcatKGjll9lr+hvGjOR0DJPZNhI7NiHedvD3E/SDqPxa3lXnbn2lrT0oxUV9WWY2yW5esBgIoF0QxpGvgigD6c64Fa5q1nzVJN+rJ1FLY2agNhRg55mKFZZAejt+5tX3bhdRVLOlKO3Kv8HgbqLjWmn3Zr1fID1TY3HTesNZWGE8PKNibFPKw7RzuQLkbDfnpHhcnao40404+6iR1JVH7zJOWHDRaQ3fZb3IN72Kst0OwJUsu/Iovib1YyrVMtaL99S3KNCnhPV/voauK4njR1QdmgIcJGxG+rSbhDcbSLqA33Nr7U8GK0nLV/v8AQeNOS5qcdEV7OOJYo3CTSsW523bTc3uQOVzvUsq1Gi+Ujhb1q65l9zzMs4ihiExOpTbTpsdV9xb4b/Ct6txCEOffOxpStp1KnJs0a2RcQpidQ0lGUXIJBBHjfy6+tR0LuNXPTBJc2UqOHvkksLjI5ATG6OBsdLA2+VWI1Iz+F5K06U4fEsGetzQUBsYHAyStpQX8T0Hqa5/EOJ21jT560sdl1ZYt7WpXliCLLFwvFYamct1IIA+VjXgavtvc878OCUemdz0EOB0lFc0nk/NxNemJiayThTG4uxhgcqfvt3U9dTWB+F6p3PELa3/qTXp1N405S2R0DJPY+BZsXOT/AOnDsPjIwufgo9a87de0/ShD5v8A0WI23/JnQMl4cwmFH8CBEP4rXY+rm7H515654jc3D/mTfp0LEacY7IlaokgrIFAKAVgFY4ry7ft15bB/2B/y+VfRfY7i6cfwVTdax9OqPN8as9fHj8yt17888KyDRzvG9jBJIOajb1Oy/U1DXqeHTcie2peJUUXsUCHiXFqb9sT5MAR8rftXGjd1k85O7KyoNY5TTzXHtPK0rbE22HIACwA/f41FVqOpLmZNSpKlDkRrySFiWYkk8yTcn41o3nVm6SSwj1pmKhCx0qSQt9gTzIHS9Z5njAUUnnqfKsRexIuLG3UdR6VhMzg3cozR8O7OliWUrvy5gg262/zqWjWlSeYkNehGslGRL5VxhKmvtry3F15Cx8LgbLbyPKrNK+lHPPqVK3DoTxyadzpeQLhZBGZsTCruqN2AlXWNShtJ3vffkBXD4r7SXMIuNrSfnJrT5I2tuDw5s1Zadi9QQqgCqAoHQV83uLmrcVHUqybfmeip0oU48sFhGSoCQrORcB4DC2KQh3H35e+1/EA91T6AV1rrjV3caOWF2Wn6kMaMYlmrkt5eWSihkUAoBQCgFAKAj8/jLYeQDwv8iCfoK7fs5WjS4lSlJ9cfVFDiUHK2mkVDLMAZmZVIBC6hfkdwLXHLnX1Ti3FafDqcatSLcW8adPM8naWkrmTjF4aWSI40gxOGwzyBSpBUatiACwBsdxeoYcatrqlm2ms9upao8PnCslWjp9jl+JzCaQWeV2HgWNvlyqtKrOW7OtClCHwpI1qjJBQCgFAKAUAoDxl2IoD9IcL8WYTGKFhlvIFBZGBV9gLmx94X6gkV834jw24tpOc4+63utjpU6kZLCLBXKJBWTIoBQCgFAKAUAoBQHlE2nlGGskEmW9hiFkQfwmupH4L8v8Oq3pXtJcXXE+Fytqr/AJscNf8Alj8ziKzdrdKpD4X9ih+3QkthhrXSBJdNQ1XOmzaL3IsCL2238a19l44hNtPVrUv3W6OVV6oqigFAKAUAoBQCgFAXj2OSAZiBo1FopAGv7nIk263tp/xVxPaFN2Tecar5k9v8Z3evn2hfFDIoBQCgFYArIFDAoZFAKA8IrKbTyjDWT85ccZXiYsZO+IWQ6pWtKVOlwd0sxFtksNI5Wt0r6Zw6vRq28PCa2WnVftnNqRalqV6r5GKAUAoBQCgFAKAUBd/ZPh8Z9sSSBW7EkpM33CoW5UnlrF1IHPfwvXF45O3/AAso1Xr0XXPkTUFLmyjvFfO3k6OT4l1W7ttXTVe30qxbqm6iVXPL5bkdRyUXy7kVDmcpWJiikSEgKl9Wwb8RA5j5Xr0dTg1rz1acJtOCTzLbV+RzY3tXEJOKfM3ot9DK+eRAKe9uuo8rqLkbgnc3B2F+VVI+zty3JNrR4XnpnT5dyV8SpJLR66+hsYzHrGyqQSWva1gOnViBfflzqnZ8Lq3MJzi0uXR98/L/ACTVruNJpNbmuM1tcFWc6pbaVAsEax5t9evhV+XA3PDjJRWIbvdy2x6kCv1HKabeXt2R9DOEsTpfkhAsLsGOlSN/Hxsa0/8Aj9fnUVOO7TfZxWWmbfxGGM4fT55PHzUalFioBcOGG62TWORI3HrW1PgUnTk1JSbScWtnl4+xiV+lJLGNXnPTTJnwGYJLcLcEAGxtyPI90n5cxVG/4VVsknNpp5WndE9vdQrZUUbdc0tCgFAcv9uGCmZMPKqs0SGQPa5Ck6dLEDpYEX6X869Z7MVacXODeJPH0KlynozkNewKZ5QCgFAL0B9RIWIVQWY8gouT8BvQH1NCyMUdWVlNirAgg9QQdwfKgMdAbuS5c2Iniw6kK0jBQTyHmbdKiuKyo0pVHslk2isvB+geB+GRgMN2OvtGZzI7WsLkKtgPABR67+g+d8V4h+NrKolhJYR0KVPkWCw1yyUxYmcIpc3sovtzqzaW869aNODSbfUirVFTg5Mi4MTGDCqxsFUOytqB022Y7MQRYnr1Hw9HVsrlwrTlVXM3GLWN+3Q5sK1JSglF4WXvsYo8ThrAqkg06bBW3IZ9vdfcajybcX5VZdrxSM3B1I+9nOVoml6duqIlVtWuZRem3nlm48kM3dkup1aNDNpudjaytZr3Hjzrl06V7Y60WpRkubmSzptnXYtSnQr/AB6NaYZpYXGRaBI8bAlZGuOR1MO1I71/A7+BtXUu7K7dR06VVNJxWHuml7udP31KtGtSUVKcGs59NdzPPHAwKA6baIwSfeCEOVUXubcr87+NVbepxC3qKclzZzJrs5aZZLUjb1I8qeMYXqlroYY54SEKxOwZyN2BJ1IQSe8bnTtZrfCrUqF7maqVox5Y50Wmjzpp36oijUoYjywby+/dHq4qAbKZLIS/vE6tAN1F2uB6gA2rWdrxCos1OVuSUfTm67amY1beLxHKw8+uOhJ4bGhyV0srABrMACQb2IsfKvPXXDJ26jLmTi3y5Wya3TOjRuo1MpJppZw+xgGcxfm9zXa3nbTz9+/SrX8AusZ0xzY/PPoRfxCl9s/p6nsmbopZSGuoJPI7A2bk3Tnvbasx4DXlCM4yWG0uvXb6h8QgpOLT0/bNqHEBiwX7ptfoTYHbxtcVz61pO1cHU0b1x1SyWKdaNXPL0PzrnvCWPwzMZoHIuSZEGtT1J1Ly+Nq+hWvEbWvFeHNej0ZTlTlF6oj8lyXEYtzHhomlcKWIW2w2FySQOZFXiM6dwNkDYHD4hcwwJlbGNFFh8KdJeVkEjk87Rqt7lyRaxPhfDMk9lfsdgkZnxUMcKEd2LDzTMym/3pZTZtugUetYBbct9nWXYeJ44sLE5ce9Ova3I924c8gegtQGng8dNlxRcXhcKkDsEGJwa6UQsQqCWJhqQEm2oMwBIva9Ac39qfs3xMc2KzCNkeBmaZhezpc3YaSLMATtY3t0rOQc/wAo4exeKBOHgeQA6SwsFBsDbUxAvYg/Gq9e8oW/9WaRmMJS2RfuBvZ3jYcXDiZjHGsZLFdWpj3StrKNIvfneuBxPjlrUoSpU8ybWPIsUqE1JNnXa8UXRWQauZy6YnYgmwJsCQf1DcV0OFU5VLunCMkm3u9fsVruSjRk2s6EfrgW145Bp7zG5OnX+M6u8DYXG+1q70ocQqOeKkXzZUV35P8Aj2aOepW8Uvdemr8s9z4zHDqhEKq5UgOQCWICOpsAzgKLX5eVTcMuq1eDuaslzRfKs6JuSa17s0uqUKclTgnhrOnkzPhcww6EIl+8VJYm+7AFbljqO1uhAqnc8N4lWj4lRpNJpRWmi7Y0/wBk1K6toPlj16+prp2QTVGji40oWBZWDG1lUvtq87eNW/8ArKlZQrzi8ayUdGuVZ9546EP8mMHKEWs6JvVa9kZsLi4441iVJCQHBAA1ArYuTvz3vsetV7mxu7q5lcOpFJ8rTy8NPbBLSr0qVNU1Ft6576bmIS4bSSVkHuSBmY6m30oVbVcc7bkc6sTo8UdSMVOD+KDS2XV5I4ztVFvDWz832wbEGHilSTs9SltaEXJCk7k6Q2nqDtVG5vbyzr01Xako4ksbtLbXcnp0KNaEvD0zlehuYTBpHfTe5ABJJJsOQ3JsPKuRe8RrXek8YTbSSxv19S5QtoUttz4GWRXvp+/2nM+94+nlyqZ8ZvGsc+nLy/L99TT8FRznl65+Z8nLUF2TZu9bVdlGo3fuagN6khxqtLlhW1isbaP3dtTR2NNZlDRvP33M2AwoijWMbgdfE8yfnVPiF7O8uJVp9enZE9vQVGmoI0M/xMt4MNCwSXEydkHIDdmoRpJHCnZiEUgA7XIq9wKxjc1257RWRXnyx0KpwPwLPhsyx2GixjwxRrCdcap2kivraNbspCWs17LvYchX0AoF3xXDRUh5M2xalb2ZzhwRfnYmDa9AaxwMh1DC53LJOql1jdoJFNujIkYbSdgSCCL0BHR8cS41cNHGXwCyQtiJ8RIigKiaAwhaS6kF2trYbAXtvQGS+Dl/h/8AaF3B5qZsKQfgYt6Ak8fwU2JgeNs0xjxyKVNzCVIP92EXHoRQFJ4VwE2X4PtROXjhxj4bERFFC7ziHtUYDXqBKNuSLXHQVyeKcNpXNOU2vfS0foS0qji8dDolfOzoChkUBhxenQ2oXWxuPEW3HMfvVmz5/Hh4bxLOj7EVfl8N8y0wRsCQOjSaWITZgWJvp7wBsxD+Vya79xV4hb1o0HKP8zVNJf3aPGmV5nOpxt6kHPD93dZ7f5PnFYqF++6SghRa1wWV2A20tuCbbc6ltLK+t806M4NOTz1SlFeaNa1ehV9+cZZxp0ymfcbwiQEJItiiEi4UNYBVYBrEgEDkR51ryX86LTqReU5f+XLnVp42M81up5UWsaeWeiZ95dg43iVihGoA6dbWXe40793ffa1VOIcRuLe6cIzT5dM4WunXv8ya2tqdSkm1jPTL09OxtR4CNbWBuNW5JJOq2okk7k2G5qhU4rc1MptY00wse7tgnjaUo7Lv99zw5bFYDTsECDc7AG6735g9edZjxe7jLmUtXJy26vR/+g7Ok1hrpj5GeCEILC/xJJ+ZNVLm5ncT554z5LBNSpRpx5YmSoCQgs4d5MVh8H2xw8UwctKuzuykWgR+UbMLtfnYWG9el9n7GhWcqlTVrp+ZWuJyWiPcJJNhJhgsU5kDE/ZsQ3OUc+ykI27dR1++Bfnet+N8H8P+fQWnVdvNGKFbPusnK8uWiEz2TssRgMQfcjxIRz4CWN4QT5a2X516T2ZqqNeUH1X+Ctcr3UyWyT/zfMf/AGsF+09e2KRTvaB7I5swzB8Uk8cSOsYNwzNqVdB2FhawXrQG1wF7Kmyyd8U2LEn8KRCoi087G+oueVvCgI/J8q+1Q5fhdfZ9tlOIj1Wva74ffTcX23tcUBoS/wD8+bd3MN/PD/5iWgOp8D8P/YMDDhNQYxhtTDkzMxZjv0uaAomIk1YPEYce9ic3lRbeC4kSyH0CRtvVe7qqnQnN9EzaCzJIuZr5a3nU6YoZFAY54VdSjC6nYipre4nQqKrTeGtiOpTjUi4y2ZhGCUI6rcawbkkk3K6b7nwq5LidarXp1quvJjCWmzyQq1hGnKEepihyqNVAIJNkFyx+6QRa52Fxew2qevxy5qVHJYS10SX92mvd4NKdhSjHD1en2MrYCMvrsb3Dcza42Dab2v52qtDilzCj4KemMba47Z7EkrSlKfO1rv8AMzwxBVCi9h4kk/M7mqlatKtNzlu+xNCChFRR91EbigFAKAgeMJYzCMO0bTSzHTDEhs5cAsrh/wCz0W1F+luvI9nglvcVLhTpPCW78u3mQV5RUcMzZS0mKibKc2UDEqqssqNtMo92eJrAiVG97bY2PI2H0BpPRlAx5XjpYpTgsYR26i8cvJcTHewkHhINg6dDuNjXh+M8IdCfi0V7r+36F2jV5tHuSWZ4COeJ4ZRdJFKsPXwPQjmD4iuJb150KkakN0TyipLBU83yzNW0vFLGuIhRkXFoxEmIQAlIpICugtqt3iSAbkDevaU/aO2ko5TTe/kUnbyLFw9l02Lw8WIjzbGWkUEgrBdG5Oh/g7MrXU+Yrvp5IDdn4QkkBjnzPGSRt78d4k1r1UtHEGCnkbEbHnWQR+RcBkQFJyIp0xEksWIwrkMAwCrZWWyL2YWPszqWyCgJMcM4nf8ApbGbc+7Bt/8ATQFRz2HMjiXwuEzKd+yjDTtJ2S7uRohV0iujlAzarG102qhfcRpWai6nXt/kkp03PY3uHshdGSWZUTslZIIY2LrEGOqV2kYAyTSH3msPqa8rxfjKuo+FS+Hq+5Zo0eV5ZZK88WRQCgFAKAUAoBQCgFAKAUWMrJgqGQcOxYuKVZHeLN4nDtOTd0a57Jo+hwpG2gC1rg7719PsnQdCPgfD+/ucyeeb3jUz7PosTLg8PmcZikw8soxSoZAoBhYRTpJH3hE7WsLjdrG9t7ZqbGPhyFopVhwckshR1Vlwk8huVIBDsh3vbe9ASnBmPlkwwSdCk8B7CZSb99VU6r9dSsrepIr51xqz/DXTS2l7y+f6nQoz5ok9XKJSvTQTYGZ8ZhFLxyHVisKP7TxniHJZwOY5OB0O9er4NxrlxQrvTo/yZVrUf7ombizKo8yiw+ZYJmkeK9hFI0Tyxn+si1qQY5FO4B5MCCN69eVCFfE4Vl0x4vOcTOdlwTSSI4b8MhCKUUHmzNaw60BN5XhVyTLzcCXFzuSI1YntZm2WNS5LdmgAGonkpY7mtJzjCLlJ4SC1M/D+WGCKztrldmlmk/HIxux/ujZQOiqK+b8Svnd13PpsvQ6VOHJHBJ1QJBQCgFAKAUAoBQCgFAKAUAoCHz7KpJNM+HfssXED2UnQg+9E4+9G3XwNiOVdbhXE5WdTD1g91+aIatJTXmbns07EwSMDIcWz/wDOdsQZe1AtY22EYHuae7ptbrX0GnUjUipxeUyg1jRmr7TPaPDlidmmmTFsO5H0Twd7ch4LzPkNxuYOYeyzj09vJBi2BOIkaUSkAfxWsCrW2s1gB4WtyIt5zj3DZV4+NT3itV5FihU5XhnZa8QXiC4y4mjwGHMz95j3Y0vu7eHko5k+Hnauhw3h87yryLRLd+RFUqKCOG8P+0XHYTEyYlHB7Vy8sTD+G5P5R7p8CN9utfR6dNU4KEdkc9vLydL/AO/+Ls7/AGJ+1ty7QaL/AN7Te3+GtzByjibjPGY3EripZCrof4QS4WLe/dF9jfmeZrEoqSw1oDtns54yXMIbPZcRGB2i/iHISKPA9R0PkRXz/jHDHaVOaHwPby8i/Rq86w9y31xicUAoBQCgFAKAUAoBQCgFAKAUBFZlkUcsgmDzQy209pBIY2ZfwtbZh4XBt0rp2XFri0XLBprsyKdKMtziHtR4Rkwc5m1vJDMSRI7FmDcyjsdyeoJ5j0Nex4VxON7T10mt1+aKdWk4Mo9dYiO4+zH2gJLAYMXIFlhQsJGP9ZGouST1dRz6kb7m9eN4zwaXieJQWknql0f+i5RraYkcu444nfH4lpjcRjuxIfuL/qPM+ZtyAr0vD7KFpRVOO/V92Vqk3N5K9V00FAKAkuH85lwk6YiI2ZDy6MPvKfIjaobm3hcU3TnszMZOLyj9OZFm0eLgjxER7kgvbqp5Mp8wbj4V80vLWdtWdKXQ6UJKSyjfqsbigFAKAUAoBQCgFAKAUAoBQCgNPN8sixMLwTLqRxYj9iD0YHcHyqe2ualvUVSD1RrKKksM/NfGHDMuAxDQybqd436OvQ+RHIjofKxP0iyvKd3SVSHzXZnOnBxeGQVWzQUAoBQCgFAdN9iXEZinbBOe5Ndk8pAN/wBSi3qq1532hsvFo+NHeP8Aj9CxbzxLHc7hXhi8KyBQCgFAKAUAoBQCgFAKAUAoBQEDxpw1Fj8M0UhCsLtHJ+BvH+6eRHh5gV0eF307WsnHVPRruRVYKSPzCw38fMV9JOceUAoBQCgFAZ8DimikSVDZ0ZXU+YNx9a1nBTi4y2ehlPB+rMrxyzwxzp7siK4+IBt8OVfLbmi6NaVN9Hg6cXzLJtVCbCgFAKAUAoBQCgFAKAUAoBQCgK77Qsx7DLsTIDYlNC+rkIP3v8K6fB6Pi3kE9lr9NSKtLEGfmSvo5zhQCgFAKAUAoD9AexbMe1y4RnnDI6fA2kX/APRHwrwntHR5LpTX9y+60L1tLMcF9rgFgUAoBQCgFAKAUAoBQCgFAKAUBQvbWf6N/wDmj/Zq9D7N/wDdv/8AJXuPhPz/AF7koigFAKAUAoBQHZPYCe5jB01Q/tJXkvaj/wCv5/kW7XqdZryRbFAf/9k="
                        //  src={p.ebook_file} 
                         alt={p.title} />

                        {hasDiscount ? (
                          <div className="badge">-{Math.round(p.discountPercentage)}%</div>
                        ) : null}

                        <div className="iconsBox">
                          <button title="Compare">⇄</button>
                          <button title="Search">⌕</button>
                          <button title="Wishlist"
                           onClick={() => addToWishlistManager(productData, wishlistExecute)}>♡</button>
                        </div>

                        {/* shows only on hover like your image */}
                        <button className="addCart"
                        onClick={() => addToCartManager(productData, cartExecute)}>ADD TO CART</button>
                      </div>

                      <div className="info">
                        <div className="pTitle">{p.title}</div>
                        {/* category shown below product */}
                        <div className="pCat">{p.category}</div>

                        <div className="pPrice">
                          {hasDiscount ? (
                            <>
                              <span className="mrp">{money(p.price)}</span>
                              <span className="sale">{money(fp)}</span>
                            </>
                          ) : (
                            <span className="sale">{money(p.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}