import { useNavigate } from "react-router-dom";
import heroProduct from "../data/heroProduct";

const HeroBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-pink-400/15 rounded-full blur-md animate-pulse delay-300"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-10 lg:py-10 min-h-[700px]">
          {/* Hero Image - Left Side */}
          <div className="flex-[1.5] flex justify-center lg:justify-start mb-8 lg:mb-0 h-full">
            <div className="relative group h-full w-full">
              <img
                src={heroProduct.image}
                alt={heroProduct.title}
                className="w-full h-full max-w-[700px] max-h-[650px] object-contain transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="flex-1 text-center lg:text-left">
            {/* Special Offer Badge */}
            <div className="inline-flex items-center mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                🎉 Special Offer
              </span>
              <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {heroProduct.title}
              </span>
            </h1>

            {/* Price Section */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 mb-8">
              <div className="text-center">
                <span className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                  $ {heroProduct.price}
                </span>
                <div className="text-xs text-blue-100 uppercase tracking-wide mt-1">
                  Now
                </div>
              </div>
              <div className="text-center opacity-75">
                <span className="text-2xl text-white line-through">
                  $ {heroProduct.oldPrice}
                </span>
                <div className="text-xs text-blue-200 uppercase tracking-wide mt-1">
                  Was
                </div>
              </div>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {heroProduct.discount}% OFF
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {heroProduct.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <span className="text-green-300 mr-2">
                    {idx === 0 ? "✈️" : "🛡️"}
                  </span>
                  <span className="text-white text-sm font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate(`/product/${heroProduct.id}`)}
              >
                <span className="flex items-center justify-center">
                  🛒 Shop Now
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300">
                View Details
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 mt-8 text-white/80">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">⭐⭐⭐⭐⭐</span>
                <span className="text-sm">{heroProduct.rating}/5 Rating</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">{heroProduct.reviews}+</span>{" "}
                Happy Customers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

      {/* Floating Particles */}
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-ping hidden lg:block"></div>
      <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-bounce hidden lg:block"></div>
      <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-pink-400 rounded-full animate-pulse hidden lg:block"></div>
    </div>
  );
};

export default HeroBanner;
