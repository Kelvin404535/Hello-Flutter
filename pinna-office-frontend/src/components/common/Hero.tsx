import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Container from '../ui/Container';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  cta,
  secondaryCta,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      className="relative py-20 sm:py-32 overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? backgroundImage : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated Background Elements */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20"
        animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"
        animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Container size="lg" className="relative z-10">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              className="text-lg sm:text-xl text-gray-100 mb-8 max-w-2xl"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>
          )}

          {(cta || secondaryCta) && (
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              {cta && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => (window.location.href = cta.href)}
                  className="flex items-center gap-2"
                >
                  {cta.label}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
              {secondaryCta && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => (window.location.href = secondaryCta.href)}
                  className="text-white border-white hover:bg-white/10"
                >
                  {secondaryCta.label}
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
};

export default Hero;
