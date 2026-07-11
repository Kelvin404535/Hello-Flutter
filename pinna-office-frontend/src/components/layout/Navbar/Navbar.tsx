import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  MessageSquare,
  ChevronDown,
  X,
} from "lucide-react";

import { ROUTES, WHATSAPP_NUMBER } from "@/config/constants";
import logo from "@/assets/logos/pinna-logo.png";

const navItems = [
  { id: "about-us", label: "About Us", href: ROUTES.ABOUT, hasDropdown: false },
  { id: "products", label: "Products", href: ROUTES.PRODUCTS, hasDropdown: true },
  { id: "services", label: "Services", href: ROUTES.SERVICES, hasDropdown: true },
  { id: "clients", label: "Clients", href: ROUTES.ABOUT, hasDropdown: false },
  { id: "contact", label: "Contact", href: ROUTES.CONTACT, hasDropdown: false },
];

const productCategories = [
  { id: "comp", label: "Computers & Laptops", href: "#" },
  { id: "print", label: "Printers & Scanners", href: "#" },
  { id: "net", label: "Networking", href: "#" },
  { id: "power", label: "Power & UPS", href: "#" },
  { id: "furn", label: "Office Furniture", href: "#" },
  { id: "stat", label: "Stationery & Paper", href: "#" },
];

const serviceCategories = [
  { id: "it-sup", label: "IT Support", href: "#" },
  { id: "equip", label: "Equipment Maintenance", href: "#" },
  { id: "biz", label: "Business Consultation", href: "#" },
  { id: "custom", label: "Custom Solutions", href: "#" },
  { id: "bulk", label: "Bulk Ordering", href: "#" },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Header Section: Logo, Search, Account Buttons */}
      <nav className="sticky top-10 z-50 border-b border-gray-100 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 py-4">
            {/* Logo Section - Left */}
            <Link
              to={ROUTES.HOME}
              className="flex-shrink-0 flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={logo}
                alt="Pinna Office Supplies"
                className="h-14 w-14 object-contain"
              />
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">
                  PINNA
                </p>
                <h1 className="text-base font-bold text-blue-700 leading-tight">
                  Office Supplies
                </h1>
              </div>
            </Link>

            {/* Search Section - Center (Desktop) */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <div className="w-full max-w-2xl flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
                <select
                  aria-label="Product Category"
                  className="px-4 py-3 text-sm text-gray-700 bg-white border-r border-gray-300 outline-none hover:bg-gray-50"
                >
                  <option>All Categories</option>
                  <option>Computers & Laptops</option>
                  <option>Printers & Scanners</option>
                  <option>Office Furniture</option>
                  <option>Stationery & Paper</option>
                </select>
                <input
                  type="text"
                  placeholder="Search products, categories, brands..."
                  className="flex-1 px-4 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  aria-label="Search"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quote Button - Right */}
            <div className="flex items-center gap-2 lg:gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white text-sm font-semibold shadow-md transition-all duration-200"
              >
                <MessageSquare size={20} />
                <span>Quote</span>
              </a>

              {/* Mobile Menu Button */}
              <button
                type="button"
                aria-label="Toggle Menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Bar - Blue Background with Links */}
      <nav className="sticky top-24 z-40 bg-blue-600 border-b border-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex items-center gap-2 py-0">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <NavLink
                  to={item.href}
                  onMouseEnter={() =>
                    item.hasDropdown && setOpenDropdown(item.label)
                  }
                  onMouseLeave={() =>
                    item.hasDropdown && setOpenDropdown(null)
                  }
                  onClick={() => setOpenDropdown(null)}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-3 font-semibold text-sm transition-all duration-300 whitespace-nowrap rounded-full ${
                      item.label === "About Us"
                        ? isActive || true
                          ? "bg-red-500 text-white shadow-md hover:bg-red-600"
                          : "bg-red-500 text-white shadow-md hover:bg-red-600"
                        : isActive
                        ? "bg-blue-700 text-white"
                        : "text-white hover:bg-blue-700"
                    }`
                  }
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </NavLink>

                {/* Dropdown Menu */}
                {item.hasDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{
                      opacity: openDropdown === item.label ? 1 : 0,
                      y: openDropdown === item.label ? 0 : -8,
                      pointerEvents:
                        openDropdown === item.label ? "auto" : "none",
                    }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="absolute left-0 top-full z-50 mt-0 w-56 rounded-lg border border-gray-100 bg-white shadow-lg"
                  >
                    <ul className="py-2">
                      {(item.label === "Products"
                        ? productCategories
                        : serviceCategories
                      ).map((category) => (
                        <li key={category.id}>
                          <a
                            href={category.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                            {category.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-blue-700"
            >
              <div className="flex flex-col py-2">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() =>
                        item.hasDropdown
                          ? setOpenDropdown(
                              openDropdown === item.label ? null : item.label
                            )
                          : setIsMobileMenuOpen(false)
                      }
                      className={`w-full flex items-center justify-between px-5 py-3 text-white font-semibold text-sm transition-all duration-300 ${
                        item.label === "About Us"
                          ? "bg-red-500"
                          : "hover:bg-blue-700"
                      }`}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            openDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Mobile Dropdown */}
                    {item.hasDropdown && openDropdown === item.label && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.2 }}
                        className="bg-blue-700 border-l-2 border-white"
                      >
                        {(item.label === "Products"
                          ? productCategories
                          : serviceCategories
                        ).map((category) => (
                          <li key={category.id}>
                            <a
                              href={category.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-6 py-3 text-white text-sm transition-colors duration-200 hover:bg-blue-600"
                            >
                              {category.label}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;