import { motion } from 'framer-motion';
import { Container, Section, Button, Card } from '../../components/ui';
import Hero from '../../components/common/Hero';

const Admin: React.FC = () => {
  return (
    <>
      <Hero
        title="Admin Dashboard"
        subtitle="Manage your business"
        backgroundImage="linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)"
      />
      <Section spacing="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Admin Panel
                </h2>
                <p className="text-gray-600 mb-6">
                  Welcome to the admin dashboard. Build your admin features here.
                </p>
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

export default Admin;
