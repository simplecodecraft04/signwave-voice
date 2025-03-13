
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-8 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div 
            className="text-primary w-10 h-10 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="block text-3xl font-bold"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 5, duration: 1.5 }}
            >
              ✋
            </motion.span>
          </motion.div>
          <h1 className="text-xl font-semibold">
            <span className="text-primary">Sign</span>Wave
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium">About</Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-primary transition-colors font-medium"
          >
            GitHub
          </a>
        </nav>
        
        <button 
          className="md:hidden text-foreground focus-ring rounded-full p-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-background z-50 pt-20 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              className="absolute top-4 right-6 text-foreground focus-ring rounded-full p-1"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            
            <nav className="flex flex-col space-y-6 items-center">
              <Link 
                to="/" 
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xl font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                GitHub
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
