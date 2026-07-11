type BrandsProps = {
  brands: string[];
};

const Brands: React.FC<BrandsProps> = ({ brands }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#0B4DDB]/10 text-[#0B4DDB] text-sm font-semibold rounded-full mb-4">
            Our Partners
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Brands We Stock</h2>
          <p className="text-gray-500 mt-2">Trusted brands for your office needs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-100 hover:-translate-y-1"
            >
              <span className="text-sm font-semibold text-gray-700">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
