import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Section, Button } from '../../components/ui';
import Hero from '../../components/common/Hero';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Hero
        title="Product Details"
        subtitle="View product information"
        backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      />
      <Section spacing="lg">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Product ID: {id}
              </h2>
              <p className="text-gray-600 mb-6">
                Product details page. Connect to API to fetch product information.
              </p>
              <Button variant="primary">Contact for Details</Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

export default Product;
