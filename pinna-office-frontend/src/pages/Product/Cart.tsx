import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Section, Button } from '../../components/ui';
import Hero from '../../components/common/Hero';
import { ROUTES } from '@/config/constants';

const Cart: React.FC = () => {
  const handleWhatsAppContact = () => {
    const message = `Hi PINNA, I'd like to inquire about your office supplies and services. Can you help me find what I need?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Hero
        title="Let's Connect!"
        subtitle="Reach out to us for personalized assistance"
        backgroundImage="linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)"
      />
      <Section spacing="lg">
        <Container size="md" className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Chat with Us on WhatsApp
            </h2>
            <p className="text-gray-600 mb-6 text-lg max-w-2xl mx-auto">
              At PINNA Office Supplies, we offer personalized service for all your office needs.
              Simply send us a message on WhatsApp and our team will help you find the perfect products and solutions for your business.
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Chat on WhatsApp?</h3>
              <ul className="text-left max-w-2xl mx-auto space-y-2 text-gray-700">
                <li>✓ Get instant responses from our team</li>
                <li>✓ Personalized product recommendations</li>
                <li>✓ Direct pricing and bulk order inquiries</li>
                <li>✓ Fast delivery and support</li>
              </ul>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleWhatsAppContact}
                variant="success"
                size="lg"
                className="flex items-center justify-center gap-2 mx-auto mb-6"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </Button>
            </motion.div>

            <p className="text-gray-500 mb-4">or</p>

            <Link to={ROUTES.PRODUCTS}>
              <Button variant="outline" size="lg">
                Browse Products
              </Button>
            </Link>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

export default Cart;
