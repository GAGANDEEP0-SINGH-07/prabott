export const GlobalStyles = () => (
    <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    :root{
      --cream:#f5f0eb;--cream-dark:#ede8e1;--sand:#d4c9b8;
      --warm-white:#faf9f7;--charcoal:#1a1a18;--mid:#888;
      --border:rgba(26,26,24,0.08);--card-bg:#f5f3f0;
    }
    .page-title-font{font-family:'Inter',sans-serif}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:#faf9f7}
    ::-webkit-scrollbar-thumb{background:rgba(26,26,24,0.12);border-radius:4px}

    /* NAV */
    .nav-pill{
      display:flex;align-items:center;gap:6px;
      padding:8px 16px;border-radius:100px;
      font-size:13px;font-weight:400;color:#888;
      background:transparent;border:none;cursor:pointer;
      transition:all .25s ease;text-decoration:none;white-space:nowrap;
      letter-spacing:0.3px;font-family:'Inter',sans-serif;
    }
    .nav-pill:hover{color:#1a1a18;background:rgba(26,26,24,0.04)}
    .nav-pill.active{background:rgba(26,26,24,0.04);color:#1a1a18;font-weight:500}

    /* ICON BTN */
    .ibtn{
      width:38px;height:38px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:none;transition:all .22s ease;
      cursor:pointer;color:#666;background:transparent;
    }
    .ibtn:hover{color:#1a1a18}

    /* PRODUCT CARD */
    .pcard{
      background:#fff;overflow:hidden;border-radius:16px;
      cursor:pointer;transition:all .4s cubic-bezier(.16,1,.3,1);
      position:relative;border:1px solid rgba(0,0,0,0.06);
    }
    .pcard:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.08)}
    .pcard-img{overflow:hidden;position:relative;aspect-ratio:1/1;background:#f0ede8}
    .pcard-img img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.16,1,.3,1);display:block}
    .pcard:hover .pcard-img img{transform:scale(1.05)}

    /* WISHLIST BTN */
    .wish-btn{
      position:absolute;top:14px;right:14px;z-index:5;
      width:36px;height:36px;border-radius:50%;
      background:rgba(255,255,255,.9);backdrop-filter:blur(8px);
      border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
      transition:all .3s ease;color:#1a1a18;
      opacity:1;transform:translateY(0);
    }
    .wish-btn:hover{background:white;box-shadow:0 2px 12px rgba(0,0,0,0.1)}
    .wish-btn.active{background:#ffe6ea;color:#ff477e}

    /* BADGE */
    .badge{
      position:absolute;top:14px;left:14px;z-index:5;
      padding:5px 12px;border-radius:100px;font-size:10px;font-weight:600;
      letter-spacing:0.5px;text-transform:uppercase;font-family:'Inter',sans-serif;
    }
    .badge-new{background:#1a1a18;color:white}
    .badge-sale{background:#c44d3f;color:white}

    /* Quick add overlay */
    .pcard-quick{
      position:absolute;bottom:0;left:0;right:0;z-index:4;
      padding:24px 16px 16px;
      background:linear-gradient(transparent,rgba(0,0,0,0.4));
      transform:translateY(100%);
      transition:transform .4s cubic-bezier(.16,1,.3,1);
    }
    .pcard:hover .pcard-quick{transform:translateY(0)}
    .pcard-quick button{
      width:100%;padding:12px;background:#fff;color:#1a1a18;
      border:none;font-size:12px;font-weight:500;border-radius:10px;
      letter-spacing:0.3px;cursor:pointer;
      font-family:'Inter',sans-serif;transition:all .2s;
    }
    .pcard-quick button:hover{background:#1a1a18;color:#fff}

    /* BTN PRIMARY */
    .btn-p{
      display:inline-flex;align-items:center;gap:8px;
      background:#1a1a18;color:white;padding:14px 32px;
      border-radius:12px;font-size:13px;font-weight:500;
      letter-spacing:0.3px;
      border:none;cursor:pointer;transition:all .3s ease;
      font-family:'Inter',sans-serif;
    }
    .btn-p:hover{background:#333;transform:translateY(-2px);box-shadow:0 12px 32px rgba(26,26,24,.2)}

    /* BTN OUTLINE */
    .btn-o{
      display:inline-flex;align-items:center;gap:8px;
      background:transparent;color:#1a1a18;padding:13px 28px;
      border-radius:12px;font-size:13px;font-weight:500;
      letter-spacing:0.3px;
      border:1px solid rgba(26,26,24,.15);cursor:pointer;
      transition:all .3s ease;font-family:'Inter',sans-serif;
    }
    .btn-o:hover{background:#1a1a18;color:white;border-color:#1a1a18}

    /* SIDEBAR FILTER */
    .filter-section{border-bottom:1px solid #f0ede8;padding-bottom:0;margin-bottom:0}

    /* PRICE RANGE SLIDER */
    .slider{-webkit-appearance:none;appearance:none;width:100%;height:2px;
      background:linear-gradient(to right,#1a1a18 60%,#e0dbd3 60%);border-radius:2px;outline:none;cursor:pointer}
    .slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
      width:16px;height:16px;border-radius:50%;background:#1a1a18;cursor:pointer;border:2px solid white;
      box-shadow:0 1px 6px rgba(0,0,0,.2)}

    /* BREADCRUMB */
    .breadcrumb a{color:rgba(255,255,255,.5);font-size:13px;text-decoration:none;transition:color .2s;letter-spacing:.3px;font-family:'Inter',sans-serif}
    .breadcrumb a:hover{color:white}

    /* REVEAL */
    .rv{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s cubic-bezier(.16,1,.3,1)}
    .rv.in{opacity:1;transform:translateY(0)}
    .rv1{transition-delay:.08s}.rv2{transition-delay:.16s}.rv3{transition-delay:.24s}.rv4{transition-delay:.32s}

    /* PAGE HERO */
    .page-hero{
      position:relative;overflow:hidden;border-radius:20px;
      min-height:500px;display:flex;align-items:flex-end;
    }
    .page-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
      transition:transform 8s cubic-bezier(.16,1,.3,1)}
    .page-hero.in img{transform:scale(1)}
    .page-hero-overlay{position:absolute;inset:0;
      background:linear-gradient(to top,rgba(10,10,10,.8) 0%,rgba(10,10,10,.35) 40%,rgba(10,10,10,.12) 100%)}
    .page-hero-content{position:relative;z-index:2;padding:60px 72px;color:white;max-width:600px}

    /* SORT DROPDOWN */
    .sort-select{
      padding:10px 36px 10px 14px;border-radius:10px;border:1px solid #e8e5e0;
      background:transparent;font-size:13px;font-family:'Inter',sans-serif;
      color:#666;cursor:pointer;outline:none;appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E");
      background-repeat:no-repeat;background-position:right 12px center;
      transition:border-color .2s;
    }
    .sort-select:focus{border-color:#1a1a18}

    /* GRID TOGGLE */
    .grid-btn{
      width:36px;height:36px;border-radius:10px;border:1px solid #e8e5e0;
      background:transparent;cursor:pointer;display:flex;align-items:center;
      justify-content:center;color:#ccc;transition:all .2s ease;
    }
    .grid-btn.active{color:#1a1a18;background:#f5f3f0}
    .grid-btn:hover{color:#1a1a18}

    /* PAGINATION */
    .page-btn{
      width:40px;height:40px;border-radius:10px;
      border:1px solid #e8e5e0;background:transparent;
      cursor:pointer;font-size:13px;font-weight:400;
      display:flex;align-items:center;justify-content:center;
      color:#999;transition:all .2s ease;
      font-family:'Inter',sans-serif;
    }
    .page-btn:hover{border-color:#1a1a18;color:#1a1a18}
    .page-btn.active{background:#1a1a18;color:white;border-color:#1a1a18}

    /* CART NOTIFICATION */
    .cart-toast{
      position:fixed;bottom:28px;right:28px;z-index:999;
      background:#1a1a18;color:white;
      padding:16px 24px;border-radius:14px;
      font-size:13px;font-weight:400;letter-spacing:.3px;
      box-shadow:0 20px 48px rgba(0,0,0,.25);
      transform:translateY(80px);opacity:0;
      transition:all .4s cubic-bezier(.16,1,.3,1);
      pointer-events:none;display:flex;align-items:center;gap:12px;
      font-family:'Inter',sans-serif;
    }
    .cart-toast.show{transform:translateY(0);opacity:1}

    /* SEARCH OVERLAY */
    .search-ov{
      position:fixed;inset:0;background:rgba(10,10,10,.4);
      backdrop-filter:blur(16px);z-index:500;
      display:flex;align-items:flex-start;justify-content:center;
      padding-top:120px;opacity:0;pointer-events:none;
      transition:opacity .3s ease;
    }
    .search-ov.open{opacity:1;pointer-events:auto}
    .search-box{
      background:white;border-radius:16px;padding:28px 32px;
      width:100%;max-width:560px;
      box-shadow:0 40px 80px rgba(0,0,0,.15);
      transform:translateY(-20px);
      transition:transform .4s cubic-bezier(.16,1,.3,1);
    }
    .search-ov.open .search-box{transform:translateY(0)}
    .search-box input{width:100%;border:none;outline:none;
      font-size:18px;font-family:'Inter',sans-serif;color:#1a1a18;font-weight:300;letter-spacing:.3px}

    /* responsive helpers */
    .hide-mobile{ display:flex }
    .show-mobile{ display:none }

    /* FOOTER */
    .footer-brand{
      font-family:'Inter',sans-serif;
      font-size:clamp(60px,12vw,140px);
      font-weight:700;
      color:#f0ede8;
      letter-spacing:6px;
      line-height:0.9;
      user-select:none;
      pointer-events:none;
      white-space:nowrap;
      overflow:hidden;
    }
    .footer-col h4{
      font-size:11px;font-weight:600;
      letter-spacing:1.5px;text-transform:uppercase;
      color:#1a1a18;margin-bottom:18px;
      font-family:'Inter',sans-serif;
    }
    .footer-col p, .footer-col a{
      font-size:13px;color:#999;line-height:1.9;
      text-decoration:none;display:block;
      transition:color .18s ease;font-family:'Inter',sans-serif;
    }
    .footer-col a:hover{color:#1a1a18}
    .social-btn{
      width:32px;height:32px;border-radius:8px;
      border:1px solid #e8e5e0;
      background:transparent;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      color:#999;transition:all .22s ease;
    }
    .social-btn:hover{background:#1a1a18;color:white;border-color:#1a1a18}
    .newsletter-wrap{
      display:flex;
      border-bottom:1px solid #d4d0cb;
      padding-bottom:4px;
      margin-top:4px;
    }
    .newsletter-wrap input{
      flex:1;border:none;outline:none;
      padding:8px 0;font-size:13px;
      font-family:'Inter',sans-serif;
      background:transparent;color:#1a1a18;
      min-width:0;
    }
    .newsletter-wrap input::placeholder{color:#ccc}
    .newsletter-wrap button{
      background:none;color:#1a1a18;border:none;
      padding:8px 12px;cursor:pointer;
      font-family:'Inter',sans-serif;
      font-size:12px;font-weight:500;letter-spacing:.5px;
      transition:transform .3s ease;
    }
    .newsletter-wrap button:hover{transform:translateX(4px)}

    /* EDITORIAL BAND */
    .editorial-band{
      display:flex;align-items:center;justify-content:center;
      gap:60px;padding:72px 60px;
      border-bottom:1px solid #eceae6;
    }
    .band-item{display:flex;align-items:flex-start;gap:20px;max-width:280px}
    .band-number{font-family:'Inter',sans-serif;font-size:32px;font-weight:600;color:#d4cfc6;line-height:1;flex-shrink:0}
    .band-label{font-size:14px;font-weight:600;color:#1a1a18;margin-bottom:6px;letter-spacing:.3px;font-family:'Inter',sans-serif}
    .band-desc{font-size:13px;color:#999;line-height:1.6;font-weight:400;font-family:'Inter',sans-serif}
    .band-divider{width:1px;height:48px;background:#e8e5e0;flex-shrink:0}

    /* CTA DARK SECTION */
    .cta-dark{
      background:#1a1a18;border-radius:20px;text-align:center;
      position:relative;overflow:hidden;padding:100px 60px;
    }
    .cta-dark::before{
      content:'';position:absolute;top:-50%;left:-50%;
      width:200%;height:200%;
      background:radial-gradient(ellipse at center,rgba(255,255,255,.03) 0%,transparent 70%);
      pointer-events:none;
    }

    @media(max-width:900px){
        .sidebar{display:none!important}
        .page-hero-content{padding:40px 36px}
        .page-hero{min-height:380px}
        .footer-grid{grid-template-columns:1fr 1fr!important}
        .editorial-band{flex-direction:column;gap:32px;padding:48px 24px}
        .band-divider{width:40px;height:1px}
    }
    @media(max-width:700px){
        .nav-cats{display:none!important}
        .hide-mobile{display:none!important}
        .show-mobile{display:flex!important}
        .page-hero{min-height:320px}
        .page-hero-content{padding:28px 24px}
        .footer-grid{grid-template-columns:1fr!important}
        .editorial-band{padding:40px 20px;gap:24px}
        .cta-dark{padding:60px 24px}
    }
  `}</style>
);

export default GlobalStyles;
