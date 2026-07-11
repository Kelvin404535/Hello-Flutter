import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Section, Button } from '../../components/ui';
import { ROUTES } from '@/config/constants';

const NotFound: React.FC = () => {
  return (
    <Section spacing="lg" className="min-h-screen flex items-center">
      <Container size="sm" className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link to={ROUTES.HOME}>
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
};

export default NotFound;
