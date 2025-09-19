import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { brandName, brandDomain } from "../utils/brand";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Online Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Online Shop</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8801894800865?text=Hello%20Kidora%2C%20I%20need%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Chat on WhatsApp"
                >
                  Contact (WhatsApp)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/category/women"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/category/men"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/category/kids"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <p>📍 House-26, Dhaka, Bangladesh</p>
              <p>📞 +8801894-800865</p>
              <p>✉️ kidorabd@gmail.com</p>
              <p>🌐 www.kidora.com.bd</p>
            </div>
          </div>

          {/* Follow Us & Payment */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.facebook.com/share/173gAeTFDs/"
                className="text-gray-300 hover:text-blue-500 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>

            <h4 className="text-sm font-semibold mb-2">Payment Methods</h4>
            <div className="flex items-center space-x-3">
              <div className="bg-white text-black px-3 py-1 rounded text-md font-bold tracking-wide">COD</div>
              <img src="/bkash.png" alt="bKash" className="h-8 w-auto object-contain rounded-sm shadow-sm bg-white p-0.5" loading="lazy" />
              <img src="/nogod.png" alt="Nagad" className="h-8 w-auto object-contain rounded-sm shadow-sm bg-white p-0.5" loading="lazy" />
              <img src="/rocket.png" alt="Rocket" className="h-8 w-auto object-contain rounded-sm shadow-sm bg-white p-0.5" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025-Kidora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
