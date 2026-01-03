import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-heading">Infinity Mutual Funds</h3>
          <p className="footer-text">
            Your trusted partner in wealth creation through mutual funds.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subheading">Contact Us</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Phone size={16} />
              <span>1800-123-4567</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>support@infinityfunds.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subheading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/disclaimer">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Infinity Mutual Funds. All rights reserved.</p>
        <p>SEBI Registration No: INZ000123456</p>
      </div>
    </footer>
  );
};

export default Footer;