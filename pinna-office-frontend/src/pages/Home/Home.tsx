import { Award, Building2, MapPin, Package, Shield, TrendingUp, Users } from 'lucide-react';
import TopBar from '../../components/layout/Header/TopBar/TopBar';
import Navbar from '../../components/layout/Header/Navbar/Navbar';
import Hero from '../../components/home/Hero';
import Categories from '../../components/home/Categories';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import Brands from '../../components/home/Brands';
import BusinessSolutions from '../../components/home/BusinessSolutions';
import CTA from '../../components/home/CTA';
import Footer from '../../components/layout/Footer/Footer';

// Constants
const WHATSAPP_NUMBER = '254700000000';
const CONTACT_EMAIL = 'info@pinnaofficesupplies.co.ke';
const ROUTES = {
  PRODUCTS: '/products',
  ABOUT: '/about',
  CONTACT: '/contact',
};

// Categories data
const categories = [
  { id: 1, name: 'Computers & Laptops', slug: 'computers', image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop' },
  { id: 2, name: 'Printers & Scanners', slug: 'printers', image: 'https://images.unsplash.com/photo-1587145829366-a69be367d1b4?w=400&h=300&fit=crop' },
  { id: 3, name: 'Networking', slug: 'networking', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop' },
  { id: 4, name: 'Office Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop' },
  { id: 5, name: 'Stationery & Paper', slug: 'stationery', image: 'https://images.unsplash.com/photo-1529927047332-0199fcd2e0e8?w=400&h=300&fit=crop' },
  { id: 6, name: 'Power & UPS', slug: 'power', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop' },
];

// Trust cards
const trustCards = [
  { icon: MapPin, title: 'Visit Our Store', description: 'Pinna House, Moi Avenue, Nairobi' },
  { icon: Shield, title: 'Genuine Products', description: '100% authentic and quality guaranteed' },
  { icon: Award, title: 'Best Prices', description: 'Competitive rates and value for money' },
  { icon: Users, title: 'Expert Support', description: 'Professional assistance when you need it' },
];

// Statistics
const statistics = [
  { id: 1, value: '500+', label: 'Corporate Clients', icon: Building2 },
  { id: 2, value: '2000+', label: 'Products', icon: Package },
  { id: 3, value: '100+', label: 'Brands', icon: Award },
  { id: 4, value: '15+', label: 'Years Experience', icon: TrendingUp },
];

// Brands
const brands = [
  'HP', 'Dell', 'Canon', 'Epson', 'Lenovo',
  'Logitech', 'Cisco', 'Brother', 'APC', 'Microsoft',
];

const Home: React.FC = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'HP LaserJet Pro MFP M428fdw',
      brand: 'HP',
      price: 'KSh 45,000',
      image: 'https://images.unsplash.com/photo-1587145829366-a69be367d1b4?w=400&h=400&fit=crop&auto=format',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Dell XPS 15 9530 Laptop',
      brand: 'Dell',
      price: 'KSh 185,000',
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop&auto=format',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Steelcase Ergonomic Chair',
      brand: 'Steelcase',
      price: 'KSh 32,000',
      image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=400&fit=crop&auto=format',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Cisco SG250-08 Switch',
      brand: 'Cisco',
      price: 'KSh 28,000',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop&auto=format',
      rating: 4.6,
    },
  ];

  const getWhatsAppMessage = (productName: string, price: string) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Pinna%20Office%20Supplies%2C%0A%0AI%20am%20interested%20in%20the%20${encodeURIComponent(productName)}%20(${encodeURIComponent(price)}).%0A%0APlease%20provide%20a%20quote.%0A%0AThank%20you.`;
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <Hero routes={ROUTES} whatsappNumber={WHATSAPP_NUMBER} trustCards={trustCards} statistics={statistics} />
      <Categories categories={categories} />
      <FeaturedProducts featuredProducts={featuredProducts} routes={ROUTES} getWhatsAppMessage={getWhatsAppMessage} />
      <Brands brands={brands} />
      <BusinessSolutions whatsappNumber={WHATSAPP_NUMBER} contactEmail={CONTACT_EMAIL} />
      <CTA whatsappNumber={WHATSAPP_NUMBER} />
      <Footer />
    </div>
  );
};

export default Home;