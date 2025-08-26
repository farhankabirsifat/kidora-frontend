import { Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Scroll to top immediately before navigating
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  // Calculate discounted price if discount exists
  const getDiscountedPrice = (product) => {
    if (!product.discount) return product.price;
    const priceNum = parseFloat(product.price.replace(/[৳$\s]/g, ""));
    const discounted = Math.round(priceNum * (1 - product.discount / 100));
    return `৳ ${discounted}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer relative"
    >
      {/* Discount badge */}
      {product.discount && (
        <span className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded z-10">
          {product.discount}% OFF
        </span>
      )}
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight line-clamp-2">
          {product.title}
        </h3>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {getDiscountedPrice(product)}
          </span>
          {product.discount && (
            <span className="text-base text-gray-500 line-through">
              {product.price}
            </span>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-xs text-gray-500">
              ({product.reviews || "1000"})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
