import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Grades", path: "/grades" },
    { name: "Schedule", path: "/schedule" },
    { name: "Academic Calendar", path: "/calendar" },
  ];

  const resources = [
    { name: "Library", path: "/library" },
    { name: "Research", path: "/research" },
    { name: "Campus Life", path: "/campus-life" },
    { name: "Alumni", path: "/alumni" },
    { name: "News & Events", path: "/news" },
  ];

  const support = [
    { name: "Help Center", path: "/help" },
    { name: "Contact Us", path: "/contact" },
    { name: "IT Support", path: "/it-support" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const socialLinks = [
    { icon: FaFacebook, name: "Facebook", url: "#" },
    { icon: FaTwitter, name: "Twitter", url: "#" },
    { icon: FaLinkedin, name: "LinkedIn", url: "#" },
    { icon: FaInstagram, name: "Instagram", url: "#" },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-8 max-900px:px-4 max-480px:px-2 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <span className="font-display text-2xl font-bold">UNICAMP</span>
            </Link>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Empowering students through quality education, innovative
              research, and transformative learning experiences. Building the
              leaders of tomorrow.
            </p>
            <div className="flex items-center gap-3 text-gray-300 mb-2">
              <MapPin size={16} />
              <span className="text-sm">University Campus, Education City</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 mb-2">
              <Phone size={16} />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Mail size={16} />
              <span className="text-sm">info@unicamp.edu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BookOpen size={18} />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and
              announcements.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors"
                aria-label={social.name}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          <div className="text-gray-300 text-sm text-center md:text-right">
            <p>© {currentYear} UNICAMP University. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 dark:bg-black py-4">
        <div className="container mx-auto px-8 max-900px:px-4 max-480px:px-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/accessibility"
                className="hover:text-white transition-colors"
              >
                Accessibility
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-white transition-colors"
              >
                Sitemap
              </Link>
              <Link
                to="/careers"
                className="hover:text-white transition-colors"
              >
                Careers
              </Link>
              <Link
                to="/emergency"
                className="hover:text-white transition-colors"
              >
                Emergency Information
              </Link>
            </div>
            <div>
              <span>Made with ❤️ for education</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
