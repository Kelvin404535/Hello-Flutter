import { motion } from 'framer-motion';
import Hero from '../../components/common/Hero';
import { Container, Section, Card, CardBody } from '../../components/ui';

const About: React.FC = () => {
  const team = [
    { name: 'John Smith', role: 'CEO & Founder', bio: 'Visionary leader with 20+ years in office supplies' },
    { name: 'Sarah Johnson', role: 'COO', bio: 'Operations expert ensuring quality and efficiency' },
    { name: 'Mike Davis', role: 'CTO', bio: 'Tech innovator building digital solutions' },
    { name: 'Emma Wilson', role: 'Head of Customer Service', bio: 'Dedicated to customer satisfaction' },
  ];

  const values = [
    { title: 'Quality', description: 'We provide only premium products that meet industry standards' },
    { title: 'Reliability', description: 'Consistent delivery and service you can depend on' },
    { title: 'Innovation', description: 'Constantly improving our products and services' },
    { title: 'Sustainability', description: 'Eco-friendly practices in all our operations' },
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
        title="About PINNA"
        subtitle="Leading provider of premium office supplies since 2010"
        backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      />

      {/* About Content */}
      <Section title="Our Story" spacing="lg">
        <Container size="md">
          <motion.div
            className="prose prose-lg max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Founded in 2010, PINNA Office Supplies started with a simple mission: to provide
              businesses with high-quality office products at competitive prices. What began as a
              small operation has grown into one of the most trusted names in the industry.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              We believe that a well-equipped workspace leads to better productivity and happier
              employees. That's why we carefully curate our product selection and maintain
              exceptional customer service.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Today, we serve thousands of businesses of all sizes, from startups to large
              corporations, helping them equip their offices with the best supplies available.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Values */}
      <Section title="Our Values" spacing="lg" className="bg-gray-50">
        <Container>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card>
                  <CardBody className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {value.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Team */}
      <Section title="Our Team" spacing="lg">
        <Container>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card>
                  <CardBody>
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.bio}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Stats */}
      <Section spacing="lg" className="bg-blue-600">
        <Container>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '50K+', label: 'Products Available' },
              { number: '98%', label: 'Customer Satisfaction' },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="text-white">
                  <div className="text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

export default About;
