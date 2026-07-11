import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Section, Input, Button, Card } from '../../components/ui';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/config/constants';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate(ROUTES.HOME);
    } catch {
      toast.error('Invalid email or password');
    }
  };

  return (
    <Section spacing="lg" className="min-h-screen flex items-center">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <div className="px-6 py-8 sm:px-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Welcome Back
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Sign in to your PINNA account
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
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

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to={ROUTES.REGISTER} className="text-blue-600 hover:text-blue-700 font-semibold">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-4">
                  Or continue with
                </p>
                <div className="flex gap-4">
                  <Button fullWidth variant="outline" size="md">
                    Google
                  </Button>
                  <Button fullWidth variant="outline" size="md">
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Login;
