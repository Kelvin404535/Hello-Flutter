import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_EMAIL, CONTACT_ADDRESS } from '@/config/constants';

const TopBar: React.FC = () => {
  return (
    <div className="bg-blue-700 text-white text-xs sm:text-sm border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Left Section: Location, Phone, Email */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-200" />
              <span className="hidden sm:inline font-medium text-blue-50">{CONTACT_ADDRESS}</span>
              <span className="sm:hidden font-medium text-blue-50">Location</span>
            </div>

            <div className="hidden sm:flex items-center gap-4">
              <a 
                href={`tel:${CONTACT_PHONE}`} 
                className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-200"
              >
                <Phone className="w-4 h-4 text-blue-200" />
                <span className="font-medium">{CONTACT_PHONE}</span>
              </a>

              <a 
                href={`mailto:${CONTACT_EMAIL}`} 
                className="flex items-center gap-2 hover:text-blue-200 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 text-blue-200" />
                <span className="font-medium">{CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>

          {/* Right Section: Social Links */}
          <div className="flex items-center gap-4 sm:gap-5">
            <a 
              href="#facebook" 
              className="text-blue-200 hover:text-white transition-colors duration-200 font-medium text-xs"
              aria-label="Facebook"
            >
              f
            </a>
            <a 
              href="#instagram" 
              className="text-blue-200 hover:text-white transition-colors duration-200 font-medium text-xs"
              aria-label="Instagram"
            >
              IG
            </a>
            <a 
              href="#linkedin" 
              className="text-blue-200 hover:text-white transition-colors duration-200 font-medium text-xs"
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
