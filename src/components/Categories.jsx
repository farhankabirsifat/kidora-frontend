import { useNavigate } from "react-router-dom";

// Info box components (same code as before, just separated)
const WomenInfoBox = ({ name, items }) => (
  <div className="absolute bottom-35 left-65 bg-white rounded-lg px-6 py-4 shadow-sm">
    <h3 className="font-semibold text-xl text-gray-900 mb-2">{name}</h3>
    <p className="text-sm text-gray-500 font-medium">{items}</p>
  </div>
);

const MenInfoBox = ({ name, items }) => (
  <div className="absolute bottom-35 right-50 bg-white rounded-lg px-6 py-4 shadow-sm">
    <h3 className="font-semibold text-xl text-gray-900 mb-2">{name}</h3>
    <p className="text-sm text-gray-500 font-medium">{items}</p>
  </div>
);

const KidsInfoBox = ({ name, items }) => (
  <div className="absolute bottom-35 right-12 bg-white rounded-lg px-6 py-4 shadow-sm">
    <h3 className="font-semibold text-xl text-gray-900 mb-2">{name}</h3>
    <p className="text-sm text-gray-500 font-medium">{items}</p>
  </div>
);
const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Women",
      image: "/women.png",
      items: "15 ITEMS",
    },
    {
      id: 2,
      name: "Men",
      image: "/men.png",
      items: "12 ITEMS",
    },
    {
      id: 3,
      name: "Kids",
      image: "/kids.png",
      items: "18 ITEMS",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-64 w-full transform hover:-translate-y-1"
            >
              <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {index === 0 && (
                  <WomenInfoBox name={category.name} items={category.items} />
                )}
                {index === 1 && (
                  <MenInfoBox name={category.name} items={category.items} />
                )}
                {index === 2 && (
                  <KidsInfoBox name={category.name} items={category.items} />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Mobile horizontal slider */}
        <div className="md:hidden">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
            {categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={
                  index === 0
                    ? "group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-64 min-w-full max-w-full flex-shrink-0 snap-center"
                    : "group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-64 min-w-[80vw] max-w-xs flex-shrink-0 snap-center"
                }
              >
                <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index === 0 && (
                    <WomenInfoBox name={category.name} items={category.items} />
                  )}
                  {index === 1 && (
                    <MenInfoBox name={category.name} items={category.items} />
                  )}
                  {index === 2 && (
                    <KidsInfoBox name={category.name} items={category.items} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
