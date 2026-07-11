import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Hero from '../../components/common/Hero';
import { Container, Section, Button, Card, CardBody, CardHeader } from '../../components/ui';
import { ROUTES } from '@/config/constants';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/helpers';

const Checkout: React.FC = () => {
  const { items, total, clear } = useCart();

  const handleCheckout = async () => {
    try {
      clear();
      toast.success('Order placed successfully!');
      setTimeout(() => {
        window.location.href = ROUTES.HOME;
      }, 1000);
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
    }
  };

  const steps = [
    { number: 1, title: 'Cart Review', completed: true, current: true },
    { number: 2, title: 'Shipping Info', completed: false, current: false },
    { number: 3, title: 'Payment', completed: false, current: false },
    { number: 4, title: 'Confirmation', completed: false, current: false },
  ];

  return (
    <>
      <Hero
        title="Checkout"
        subtitle="Complete your purchase"
        backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      />

      <Section spacing="lg">
        <Container>
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                      step.completed || step.current
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-center">
                    {step.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order Review
                    </h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </motion.div>

              {/* Shipping Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">
                      Shipping Address
                    </h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="ZIP"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Payment Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-bold text-gray-900">
                      Payment Information
                    </h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Total
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3 border-b border-gray-200 pb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (8%)</span>
                      <span>{formatPrice(total * 0.08)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(total * 1.08)}
                    </span>
                  </div>

                  <Button
                    fullWidth
                    variant="primary"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Place Order
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    By placing this order, you agree to our terms and conditions
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default Checkout;
