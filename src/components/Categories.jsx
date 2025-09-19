import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCategoryCounts } from "../services/products";

// Info box components (same code as before, just separated)
// Unified info box positioned at top-right for consistency
const CategoryInfoBox = ({ name, items }) => {
  const isMen = name?.toLowerCase() === 'men';
  // Men label shifts to top-left; others remain top-right
  return (
    <div
      className={`absolute top-3 ${isMen ? 'left-3 md:left-4' : 'right-3 md:right-4'} bg-white/90 backdrop-blur-sm rounded-md px-3 py-2 shadow-sm md:top-4 md:px-4 md:py-3`}
    >
      <h3 className="font-semibold text-sm md:text-lg text-gray-900 mb-0 md:mb-1 leading-tight">{name}</h3>
      <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">{items}</p>
    </div>
  );
};
const Categories = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true); setError("");
    listCategoryCounts()
      .then(setCounts)
      .catch(e => setError(e?.message || "Failed to load counts"))
      .finally(()=> setLoading(false));
  }, []);

  const womenCount = useMemo(() => {
    return counts.find(c => c.category === 'women')?.count || 0;
  }, [counts]);
  const menCount = useMemo(() => {
    return counts.find(c => c.category === 'men')?.count || 0;
  }, [counts]);
  const kidsCount = useMemo(() => {
    // Aggregate likely variants: kid/kids, girl/girls, boy/boys, child/children
    const stems = ['kid','girl','boy','child'];
    return counts
      .filter(c => stems.some(s => c.category?.includes(s)))
      .reduce((a,c)=> a + (c.count || 0), 0);
  }, [counts]);

  const categories = [
    {
      id: 1,
      name: "Women",
      image: "/women.png",
      items: loading ? "…" : `${womenCount} ITEMS`,
    },
    {
      id: 2,
      name: "Men",
      image: "/men.png",
      items: loading ? "…" : `${menCount} ITEMS`,
    },
    {
      id: 3,
      name: "Kids",
      image: "/kids.png",
      items: loading ? "…" : `${kidsCount} ITEMS`,
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
  <section className="py-10 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop grid */}
  <div className="hidden md:grid grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-60 lg:h-64 w-full transform hover:-translate-y-1"
            >
              <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <CategoryInfoBox name={category.name} items={category.items} />
              </div>
            </div>
          ))}
        </div>
        {/* Mobile horizontal slider */}
        <div className="md:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory px-1">
            {categories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={
                  // Unified width for all mobile cards
                  "group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-52 min-w-[72vw] max-w-[72vw] first:min-w-[85vw] first:max-w-[85vw] flex-shrink-0 snap-center relative ring-1 ring-transparent hover:ring-blue-400"
                }
              >
                <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent pointer-events-none" />
                  <CategoryInfoBox name={category.name} items={category.items} />
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
