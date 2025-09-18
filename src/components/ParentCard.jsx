const ParentCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="flex">
        {/* Image */}
        <div className="w-1/3 aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              High-quality children's clothing with premium materials and
              comfortable fit for everyday wear.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">
              ৳ {Number((typeof product.price === 'number' ? product.price : String(product.price).replace(/[৳$\s,]/g, '')) || 0).toFixed(0)}
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentCard;
