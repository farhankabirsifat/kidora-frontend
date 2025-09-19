import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ImageZoom - desktop hover zoom (magnifier) component.
 *  - Shows the base image normally
 *  - On hover (pointer device, md and up), displays a separate zoom panel to the right (or below on small width fallback)
 *  - Zoom panel uses background positioning for smooth movement
 */
const ImageZoom = ({
  src,
  hiResSrc, // optional higher resolution image
  alt = '',
  zoomScale = 2.2,
  panelWidth = 320,
  panelHeight = 320,
  className = '',
  panelClassName = ''
}) => {
  const containerRef = useRef(null);
  const [showZoom, setShowZoom] = useState(false);
  const [bgPos, setBgPos] = useState('50% 50%');
  const [panelSide, setPanelSide] = useState('right'); // or 'bottom' if not enough room

  // Decide where to place zoom panel based on viewport width
  useEffect(() => {
    const decide = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      setPanelSide(spaceRight < panelWidth + 40 ? 'bottom' : 'right');
    };
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, [panelWidth]);

  const handleMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setBgPos(`${percentX}% ${percentY}%`);
  }, []);

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const enableZoom = !isTouch; // disable on touch devices

  return (
    <div className={`relative w-full h-full group ${className}`} ref={containerRef}
      onMouseEnter={() => enableZoom && setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={enableZoom ? handleMove : undefined}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />
      {showZoom && (
        <div
          className={`hidden md:block pointer-events-none absolute z-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden ${panelSide === 'right' ? 'top-1/2 -translate-y-1/2 left-full ml-6' : 'left-1/2 -translate-x-1/2 top-full mt-4'} ${panelClassName}`}
          style={{
            width: panelWidth,
            height: panelHeight,
            maxWidth: '48vw',
            maxHeight: '48vh'
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${hiResSrc || src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${zoomScale * 100}% auto`,
              backgroundPosition: bgPos,
              transition: 'background-position 40ms linear'
            }}
          />
        </div>
      )}
      {/* Subtle overlay hint */}
      {enableZoom && (
        <div className="hidden md:flex absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-black/0 via-black/0 to-black/10 pointer-events-none" />
      )}
      {enableZoom && !showZoom && (
        <div className="hidden md:flex absolute top-3 left-3 text-[11px] px-2 py-1 rounded bg-black/60 text-white font-medium tracking-wide">Hover to Zoom</div>
      )}
    </div>
  );
};

export default ImageZoom;
