import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useHeroBanners from "../context/useHeroBanners";

const HeroBanner = () => {
  const navigate = useNavigate();
  const INTERVAL = 5000;
  const { banners, loading } = useHeroBanners();
  const [current, setCurrent] = useState(1); // start from first actual slide (index 1)
  const [isPaused, setIsPaused] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const len = banners.length;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchThreshold = 50;

  // clone slides: [last, ...original, first]
  const slides = len > 0 ? [banners[len - 1], ...banners, banners[0]] : [];

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  // auto-slide
  useEffect(() => {
    if (isPaused || len === 0) return;
    const t = setTimeout(next, INTERVAL);
    return () => clearTimeout(t);
  }, [current, isPaused, len]);

  // seamless loop logic
  useEffect(() => {
    if (!slides.length) return;
    if (current === slides.length - 1) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrent(1);
      }, 700);
    }
    if (current === 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrent(len);
      }, 700);
    }
  }, [current, slides.length, len]);

  // enable transition after jump
  useEffect(() => {
    if (!transitionEnabled) {
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  }, [transitionEnabled]);

  // touch handlers
  const onTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    setIsPaused(false);
    const dx = touchStartX.current - touchEndX.current;
    if (Math.abs(dx) > touchThreshold) {
      if (dx > 0) next();
      else prev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (loading) return null;
  if (!len) return null;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 pt-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[700px] overflow-hidden">
          <div
            className={`flex h-full box-border ${
              transitionEnabled
                ? "transition-transform duration-700 ease-in-out"
                : ""
            }`}
            style={{
              width: `${slides.length * 100}%`,
              transform: `translateX(-${(current * 100) / slides.length}%)`,
            }}
          >
            {slides.map((b, i) => (
              <div
                key={i}
                className="w-full flex-shrink-0 box-border"
                style={{ width: `${100 / slides.length}%` }}
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 px-4 sm:px-6 lg:px-12 h-full">
                  <div className="flex-[1.5] flex justify-center lg:justify-start mb-8 lg:mb-0 h-full">
                    <div className="relative group h-full w-full overflow-hidden">
                      <img
                        src={b.imageUrl}
                        alt={b.title || ''}
                        className="w-full h-full max-w-[700px] max-h-[650px] object-contain transform group-hover:scale-105 transition-transform duration-500 mx-auto"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center mb-6">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        🎉 Special Offer
                      </span>
                      <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        {b.title || 'Kidora' }
                      </span>
                    </h1>
                    <p className="text-white text-lg mb-6">{b.subtitle || ''}</p>
                    <div className="flex items-center justify-center lg:justify-start space-x-6 mb-8">
                      {/* Keep spacing/alignment, but product pricing is not part of banner payload */}
                      <div className="text-center">
                        <span className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                          Kidora
                        </span>
                        <div className="text-xs text-blue-100 uppercase tracking-wide mt-1">Shop</div>
                      </div>
                    </div>
                    <button
                      className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                      onClick={() => {
                        if (b.linkUrl && /^https?:\/\//i.test(b.linkUrl)) window.location.href = b.linkUrl;
                        else if (b.linkUrl) navigate(b.linkUrl);
                      }}
                    >
                      <span className="flex items-center justify-center">
                        🛒 Shop Now
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots below slider */}
          <div className="flex justify-center space-x-2 mt-6">
            {banners.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i + 1 === current ? "bg-white scale-125" : "bg-gray-400"
                }`}
                onClick={() => setCurrent(i + 1)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
