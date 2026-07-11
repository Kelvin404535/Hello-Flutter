import { ArrowRight, MessageCircle, Star } from 'lucide-react';

type FeaturedProduct = {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
  rating: number;
};

type FeaturedProductsProps = {
  featuredProducts: FeaturedProduct[];
  routes: {
    PRODUCTS: string;
  };
  getWhatsAppMessage: (productName: string, price: string) => string;
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ featuredProducts, routes, getWhatsAppMessage }) => {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#0B4DDB]/10 text-[#0B4DDB] text-sm font-semibold rounded-full mb-4">
            Featured Products
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Premium Office Equipment</h2>
          <p className="text-gray-500 mt-2">Request a quote for any product</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x400/f0f0f0/999?text=' + product.name;
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#0B4DDB]">{product.brand}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                <p className="text-lg font-bold text-[#0B4DDB] mt-2">{product.price}</p>

                <div className="flex gap-2 mt-3">
                  <a
                    href={`/product/${product.id}`}
                    className="flex-1 text-center text-xs bg-gray-100 text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Details
                  </a>
                  <a
                    href={getWhatsAppMessage(product.name, product.price)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center text-xs bg-[#25D366] text-white font-medium px-3 py-2 rounded-lg hover:bg-[#1da85c] transition-all flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Enquire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={routes.PRODUCTS}
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#0B4DDB] text-[#0B4DDB] font-semibold rounded-lg hover:bg-[#0B4DDB] hover:text-white transition-all"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
