import { motion } from 'framer-motion';
import { Star, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Badge } from '../ui';
import type { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/utils/helpers';
import { ROUTES } from '@/config/constants';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hi, I'm interested in "${product.name}" - ${formatPrice(product.price)}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <Link to={`${ROUTES.PRODUCTS}/${product.id}`}>
        <Card hoverable>
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100 h-64">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="danger" size="sm">
                  -{discount}%
                </Badge>
              )}
              {product.stock < 5 && product.stock > 0 && (
                <Badge variant="warning" size="sm">
                  Limited
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" size="sm">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppEnquiry}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white text-gray-900 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <CardBody>
            {/* Category */}
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase">
              {product.category}
            </p>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Action Button */}
            <Button
              fullWidth
              variant="success"
              onClick={handleWhatsAppEnquiry}
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
            </Button>
          </CardBody>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
