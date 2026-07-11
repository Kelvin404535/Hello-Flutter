import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Hero from '../../components/common/Hero';
import { Container, Section, Card, CardBody, Button } from '../../components/ui';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Bulk Ordering',
      description: 'Get special discounts on large quantity orders for your office',
      features: ['Volume discounts', 'Custom packaging', 'Priority delivery'],
      price: 'Starting from custom quotes',
    },
    {
      title: 'Business Solutions',
      description: 'Tailored solutions for your specific business needs',
      features: ['Consultation', 'Custom procurement', 'Account management'],
      price: 'Customized pricing',
    },
    {
      title: 'Subscription Service',
      description: 'Regular deliveries of essential office supplies on schedule',
      features: ['Automated orders', 'Flexible scheduling', '10% discount'],
      price: '$49/month',
    },
    {
      title: 'Corporate Gifts',
      description: 'Personalized office products for your corporate gifting needs',
      features: ['Branding options', 'Custom selection', 'Gift wrapping'],
      price: 'Starting from quotes',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Hero
        title="Our Services"
        subtitle="Comprehensive solutions tailored to your business needs"
        backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      />

      <Section title="What We Offer" subtitle="Explore our range of professional services" spacing="lg">
        <Container>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card hoverable className="h-full flex flex-col">
                  <CardBody className="flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        {service.price}
                      </p>
                      <Button fullWidth variant="primary">
                        Learn More
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" className="bg-blue-600">
        <Container size="lg">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact our team to discuss your specific business requirements and get a tailored proposal.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => (window.location.href = '/contact')}
            >
              Get in Touch
            </Button>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

export default Services;
