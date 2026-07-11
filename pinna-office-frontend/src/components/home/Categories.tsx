type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

type CategoriesProps = {
  categories: Category[];
};

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#0B4DDB]/10 text-[#0B4DDB] text-sm font-semibold rounded-full mb-4">
            OUR CATEGORIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find everything you need for your office</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="h-36 w-full overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x300/f0f0f0/999?text=' + cat.name;
                  }}
                />
              </div>
              <div className="p-3 text-center">
                <h4 className="text-xs font-semibold text-gray-800">{cat.name}</h4>
                <a
                  href={`/products?category=${cat.slug}`}
                  className="text-[10px] text-[#0B4DDB] font-medium hover:text-[#0a3fb8] transition-colors"
                >
                  View Products →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
