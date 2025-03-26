
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-medishare-dark text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png" 
                alt="MediShare Logo" 
                className="h-14 w-auto mr-2 bg-white rounded-full p-1 shadow-md" 
              />
              <span className="text-2xl font-display font-bold">MediShare</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Connecting surplus medicines with those in need. Join our mission for a healthier, more sustainable world.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/how-it-works" label="How It Works" />
              <FooterLink href="/sign-in" label="Donate Medicines" />
              <FooterLink href="/sign-in" label="Request Medicines" />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Trusted By</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Kerala Foundation</li>
              <li className="text-gray-300">Uday Foundation</li>
              <li className="text-gray-300">ABC Pharma</li>
              <li className="text-gray-300">GHI Healthcare</li>
              <li className="text-gray-300">XYZ Medical</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-medishare-gold" />
                <span>info@medishare.org</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-medishare-gold" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-medishare-gold" />
                <span>123 Healthcare Ave, Medical District, CA 90210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} MediShare. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-400">
            <FooterLink href="/privacy" label="Privacy Policy" />
            <FooterLink href="/terms" label="Terms of Service" />
            <FooterLink href="/faq" label="FAQ" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a
    href={href}
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-medishare-gold hover:text-medishare-dark transition-colors duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link to={href} className="hover:text-medishare-gold transition-colors duration-300">
      {label}
    </Link>
  </li>
);

export default Footer;
