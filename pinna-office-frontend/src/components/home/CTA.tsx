import { MessageCircle } from 'lucide-react';

type CTAProps = {
  whatsappNumber: string;
};

const CTA: React.FC<CTAProps> = ({ whatsappNumber }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Chat with Sales on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
          Chat with Sales
        </span>
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-30 animate-ping"></div>
      </a>
    </div>
  );
};

export default CTA;
