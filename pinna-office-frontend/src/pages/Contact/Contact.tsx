import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import Hero from '../../components/common/Hero';
import { Container, Section, Input, Textarea, Select, Button } from '../../components/ui';
import toast from 'react-hot-toast';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const Contact: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      subtext: 'Mon-Fri, 9am-6pm EST',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@pinna.com',
      subtext: 'We typically reply within 24 hours',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '123 Business Street',
      subtext: 'New York, NY 10001',
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
        title="Contact Us"
        subtitle="Have questions? We're here to help and would love to hear from you"
        backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      />

      {/* Contact Form Section */}
      <Section spacing="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {info.label}
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {info.value}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {info.subtext}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Contact Form */}
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </div>

              <Input
                label="Subject"
                placeholder="How can we help?"
                {...register('subject', { required: 'Subject is required' })}
                error={!!errors.subject}
                helperText={errors.subject?.message}
              />

              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  { value: 'sales', label: 'Sales Inquiry' },
                  { value: 'support', label: 'Technical Support' },
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'other', label: 'Other' },
                ]}
                {...register('category', { required: 'Category is required' })}
                error={!!errors.category}
              />

              <Textarea
                label="Message"
                placeholder="Tell us more about your inquiry..."
                rows={6}
                {...register('message', { required: 'Message is required' })}
                error={!!errors.message}
                helperText={errors.message?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="primary"
                size="lg"
                isLoading={isLoading}
              >
                Send Message
              </Button>
            </motion.form>
          </div>
        </Container>
      </Section>

      {/* Map Section (Placeholder) */}
      <div className="w-full h-96 bg-gray-200 relative overflow-hidden">
        <motion.div
          className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              Integrated map would appear here
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Contact;
