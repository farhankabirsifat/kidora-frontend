import ProductCard from "./ProductCard";
import ParentCard from "./ParentCard";

const ProductSection = ({
  title,
  products,
  titleColor = "text-blue-600",
  isParentSection = false,
}) => {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-bold ${titleColor} mb-5 md:mb-8 text-center lg:text-left tracking-tight`}
        >
          {title}
        </h2>
        {isParentSection ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {products.map((product) => (
              <div className="col-span-1 md:col-span-2 w-full" key={product.id}>
                <ParentCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {products.map((product) => (
              <div className="w-full" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
