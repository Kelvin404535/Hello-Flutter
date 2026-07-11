import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, FileText, Phone } from 'lucide-react';
import { CONTACT_PHONE } from '@/config/constants';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 py-1 md:py-2">
            <div className="flex items-center">
              <div>
                <span className="text-xl md:text-2xl font-bold text-[#0B4DDB] tracking-tight">PINNA</span>
                <span className="block text-[10px] md:text-xs text-gray-500 font-medium tracking-wider uppercase -mt-0.5">Office Supplies</span>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for office supplies, computers, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4DDB] focus:border-transparent transition-all text-sm bg-gray-50 hover:bg-white"
                aria-label="Search products"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            {/* Phone - Desktop */}
            <a 
              href={`tel:${CONTACT_PHONE}`} 
              className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-[#0B4DDB] transition-colors text-sm font-medium"
            >
              <Phone size={18} />
              <span>{CONTACT_PHONE}</span>
            </a>
            
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="hidden sm:flex items-center justify-center w-9 h-9 text-gray-600 hover:text-[#0B4DDB] hover:bg-gray-50 rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
            
            {/* Account */}
            <Link 
              to="/login" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-[#0B4DDB] hover:bg-gray-50 rounded-full transition-colors text-sm font-medium"
            >
              <User size={18} />
              <span className="hidden lg:inline">Account</span>
            </Link>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="flex items-center justify-center w-9 h-9 text-gray-600 hover:text-[#0B4DDB] hover:bg-gray-50 rounded-full transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Quote Button */}
            <Link 
              to="/quote" 
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#0B4DDB] text-white text-sm font-medium rounded-full hover:bg-[#0a3fb8] transition-all shadow-sm hover:shadow-md"
            >
              <FileText size={16} />
              <span>Quote</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 text-gray-600 hover:text-[#0B4DDB] hover:bg-gray-50 rounded-full transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B4DDB] focus:border-transparent text-sm bg-gray-50"
              aria-label="Search products"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/" 
                  className="block px-4 py-2.5 text-gray-700 hover:text-[#0B4DDB] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="block px-4 py-2.5 text-gray-700 hover:text-[#0B4DDB] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="block px-4 py-2.5 text-gray-700 hover:text-[#0B4DDB] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block px-4 py-2.5 text-gray-700 hover:text-[#0B4DDB] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="block px-4 py-2.5 text-gray-700 hover:text-[#0B4DDB] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/wishlist" 
                  className="block px-4 py-2.5 text-gray-700 hover:text-[#0B4DDB] hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link 
                  to="/quote" 
                  className="block px-4 py-2.5 text-[#0B4DDB] font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Request Quote
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="block px-4 py-2.5 text-[#0B4DDB] font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Register
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;