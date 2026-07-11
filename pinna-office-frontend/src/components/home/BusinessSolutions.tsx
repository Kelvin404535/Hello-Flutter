import { Mail, MessageCircle } from 'lucide-react';

type BusinessSolutionsProps = {
  whatsappNumber: string;
  contactEmail: string;
};

const BusinessSolutions: React.FC<BusinessSolutionsProps> = ({ whatsappNumber, contactEmail }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#0B4DDB] to-[#0a3fb8] rounded-2xl overflow-hidden relative shadow-2xl shadow-[#0B4DDB]/20">
          <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Workspace?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get in touch to request a catalog, quote, or personalized product list.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1da85c] transition-all shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/30"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSolutions;
