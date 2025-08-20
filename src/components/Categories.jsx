const Categories = () => {
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

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-64 w-full"
            >
              {/* Image Container */}
              <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Info Box - Different positioning for each category */}
                {index === 0 && ( // Women
                  <div className="absolute bottom-35 left-65 bg-white rounded-lg px-6 py-4 shadow-sm">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {category.items}
                    </p>
                  </div>
                )}

                {index === 1 && ( // Men
                  <div className="absolute bottom-35 right-50 bg-white rounded-lg px-6 py-4 shadow-sm">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {category.items}
                    </p>
                  </div>
                )}

                {index === 2 && ( // Kids
                  <div className="absolute bottom-35 right-20 bg-white rounded-lg px-6 py-4 shadow-sm">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {category.items}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
