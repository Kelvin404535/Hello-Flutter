import type { LucideIcon } from 'lucide-react';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';

type HeroProps = {
  routes: {
    PRODUCTS: string;
    ABOUT: string;
    CONTACT: string;
  };
  whatsappNumber: string;
  trustCards: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
  statistics: Array<{
    id: number;
    value: string;
    label: string;
    icon: LucideIcon;
  }>;
};

const Hero: React.FC<HeroProps> = ({ routes, whatsappNumber, trustCards, statistics }) => {
  return (
    <div>
      <section className="bg-[#F8FAFC] py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-[#0B4DDB]/10 rounded-xl">
                    <stat.icon className="w-6 h-6 text-[#0B4DDB]" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50/50 py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[#0B4DDB] font-bold text-sm uppercase tracking-wider mb-4 bg-[#0B4DDB]/10 px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                Welcome to PINNA Office Supplies
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B4DDB] leading-tight mb-4">
                Complete Office &<br />
                <span className="text-gray-900">ICT Solutions</span>
              </h1>

              <p className="text-gray-600 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                We supply top quality office equipment, computers, furniture,
                stationery and business essentials for all your needs.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={routes.PRODUCTS}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B4DDB] text-white font-semibold rounded-lg hover:bg-[#0a3fb8] transition-all shadow-lg shadow-[#0B4DDB]/30"
                >
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-[#0B4DDB] hover:bg-blue-50 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Request a Quote
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                {trustCards.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-2.5 bg-blue-50 rounded-xl mb-2">
                        <item.icon className="w-5 h-5 text-[#0B4DDB]" />
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B4DDB]/10 to-transparent rounded-full blur-3xl" />
                <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-[#0B4DDB]/10 border border-gray-100">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏢</div>
                    <h3 className="text-2xl font-bold text-[#0B4DDB]">PINNA</h3>
                    <p className="text-sm text-gray-600">Office Supplies</p>
                    <p className="text-xs text-gray-400 mt-2">Complete Office & ICT Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
