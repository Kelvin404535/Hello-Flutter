import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ROUTES } from '@/config/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 w-full border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid - Clean 4 Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">PINNA</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium office supplies and solutions for modern businesses in Kenya.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Facebook</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">LinkedIn</a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to={ROUTES.ABOUT} className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to={ROUTES.CONTACT} className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=computers" className="text-sm text-gray-400 hover:text-white transition-colors">Computers & Laptops</Link></li>
              <li><Link to="/products?category=printers" className="text-sm text-gray-400 hover:text-white transition-colors">Printers & Scanners</Link></li>
              <li><Link to="/products?category=furniture" className="text-sm text-gray-400 hover:text-white transition-colors">Office Furniture</Link></li>
              <li><Link to="/products?category=networking" className="text-sm text-gray-400 hover:text-white transition-colors">Networking</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">Pinna House, Moi Avenue, Nairobi</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">info@pinnaofficesupplies.co.ke</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">Mon - Sat: 8am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Clean & Simple */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} PINNA Office Supplies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/returns" className="text-sm text-gray-500 hover:text-white transition-colors">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;