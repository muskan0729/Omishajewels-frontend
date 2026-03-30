import heroImg from "../../assets/images/herosectionshop.webp";

export default function ShopPageSkeleton() {
  return (
    <div className="page">
      {/* Hero Section Skeleton - Matching ShopHero structure with image */}
      <section className="hero">
        <img 
          src={heroImg} 
          alt="Loading Shop Banner" 
          className="hero__img"
          style={{ filter: 'brightness(0.7)' }}
        />
        <div className="hero__overlay">
          <div className="hero__inner">
            {/* Title Skeleton */}
            <div className="hero__titleRow">
              <div
                style={{
                  height: '48px',
                  width: '200px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                  margin: '0 auto',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              />
            </div>

            {/* Category Chips Skeleton */}
            <div className="hero__cats" style={{ 
              display: 'flex', 
              gap: '15px', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              padding: '0 20px'
            }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="hero__cat"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '40px',
                    backdropFilter: 'blur(4px)',
                    minWidth: '100px',
                    cursor: 'pointer',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                >
                  <div
                    style={{
                      height: '20px',
                      width: '80px',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '4px'
                    }}
                  />
                  <div
                    style={{
                      height: '14px',
                      width: '60px',
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
  
      
      {/* Breadcrumb Skeleton */}
      <div className="crumbRow">
        <div className="wrap">
          <div className="crumbText" style={{ 
            height: '24px', 
            width: '200px', 
            backgroundColor: '#e0e0e0',
            borderRadius: '4px'
          }} />
        </div>
      </div>
      
      {/* Shop Body Skeleton */}
      <div className="wrap shopWrap">
        {/* Top Row Skeleton */}
        <div className="topRow">
          <div className="topRow__left" />
          <div className="topRow__right">
            <div className="showCount" style={{ display: 'flex', gap: '10px' }}>
              {[9, 12, 18, 24].map((n) => (
                <div key={n} style={{ 
                  width: '40px', 
                  height: '32px', 
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px'
                }} />
              ))}
            </div>
            <div className="gridBtns" style={{ display: 'flex', gap: '10px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px'
                }} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="layout">
          {/* Left Sidebar Skeleton */}
          <aside className="sidebar">
            <div className="box">
              <div style={{ 
                height: '30px', 
                width: '200px', 
                backgroundColor: '#e0e0e0',
                marginBottom: '20px',
                borderRadius: '4px'
              }} />
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  marginBottom: '20px',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    width: '60px', 
                    height: '80px', 
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px'
                  }} />
                  <div>
                    <div style={{ 
                      height: '16px', 
                      width: '120px', 
                      backgroundColor: '#e0e0e0',
                      marginBottom: '8px',
                      borderRadius: '4px'
                    }} />
                    <div style={{ 
                      height: '14px', 
                      width: '80px', 
                      backgroundColor: '#e0e0e0',
                      marginBottom: '6px',
                      borderRadius: '4px'
                    }} />
                    <div style={{ 
                      height: '14px', 
                      width: '100px', 
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
          
          {/* Main Content Skeleton */}
          <main className="main">
            <div className="filtersRow">
              <div className="filtersCol">
                <div style={{ 
                  height: '24px', 
                  width: '100px', 
                  backgroundColor: '#e0e0e0',
                  marginBottom: '15px',
                  borderRadius: '4px'
                }} />
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={{ 
                    height: '20px', 
                    width: '150px', 
                    backgroundColor: '#e0e0e0',
                    marginBottom: '10px',
                    borderRadius: '4px'
                  }} />
                ))}
              </div>
              
              <div className="filtersCol">
                <div style={{ 
                  height: '24px', 
                  width: '100px', 
                  backgroundColor: '#e0e0e0',
                  marginBottom: '15px',
                  borderRadius: '4px'
                }} />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ 
                    height: '20px', 
                    width: '180px', 
                    backgroundColor: '#e0e0e0',
                    marginBottom: '10px',
                    borderRadius: '4px'
                  }} />
                ))}
              </div>
            </div>
            
            <div className="metaRow">
              <div style={{ 
                height: '20px', 
                width: '120px', 
                backgroundColor: '#e0e0e0',
                borderRadius: '4px'
              }} />
              <span className="pipe">|</span>
              <div style={{ 
                height: '20px', 
                width: '200px', 
                backgroundColor: '#e0e0e0',
                borderRadius: '4px'
              }} />
            </div>
            
            {/* Products Grid Skeleton - Responsive Grid */}
            <div className="products grid3">
              {Array(9).fill(null).map((_, index) => (
                <div key={index} className="card">
                  <div className="media">
                    <div style={{ 
                      width: '100%', 
                      height: '250px', 
                      backgroundColor: '#e0e0e0',
                      borderRadius: '8px',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '10px', 
                      left: '10px', 
                      right: '10px',
                      height: '40px', 
                      backgroundColor: '#d0d0d0',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <div className="info" style={{ padding: '15px' }}>
                    <div style={{ 
                      height: '20px', 
                      width: '80%', 
                      backgroundColor: '#e0e0e0',
                      marginBottom: '10px',
                      borderRadius: '4px'
                    }} />
                    <div style={{ 
                      height: '16px', 
                      width: '60%', 
                      backgroundColor: '#e0e0e0',
                      marginBottom: '15px',
                      borderRadius: '4px'
                    }} />
                    <div style={{ 
                      height: '24px', 
                      width: '70%', 
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      
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
        
        /* Responsive Styles */
        @media (max-width: 1200px) {
          .products.grid3 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (max-width: 992px) {
          .products.grid3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .hero__cats {
            gap: 12px !important;
          }
          
          .hero__cat {
            min-width: 80px !important;
            padding: 10px 20px !important;
          }
        }
        
        @media (max-width: 768px) {
          .products.grid3 {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          
          .layout {
            flex-direction: column !important;
          }
          
          .sidebar {
            width: 100% !important;
            margin-bottom: 30px !important;
          }
          
          .main {
            width: 100% !important;
          }
          
          .topRow {
            flex-direction: column !important;
            gap: 15px !important;
          }
          
          .topRow__right {
            justify-content: space-between !important;
            width: 100% !important;
          }
          
          .filtersRow {
            flex-direction: column !important;
            gap: 20px !important;
          }
          
          .hero__cats {
            gap: 10px !important;
          }
          
          .hero__cat {
            min-width: 70px !important;
            padding: 8px 16px !important;
          }
          
          .hero__catName {
            font-size: 12px !important;
          }
          
          .hero__catCount {
            font-size: 10px !important;
          }
        }
        
        @media (max-width: 576px) {
          .showCount {
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          
          .gridBtns {
            gap: 8px !important;
          }
          
          .pagination {
            gap: 8px !important;
          }
          
          .pagination button {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
          
          .hero__cat {
            min-width: 60px !important;
            padding: 6px 12px !important;
          }
          
          .hero__titleRow div {
            width: 150px !important;
            height: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}