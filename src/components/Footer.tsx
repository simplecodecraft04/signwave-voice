
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SignWave. All rights reserved.
          </p>
        </div>
        
        <div className="flex space-x-8">
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms of Service
          </a>
        </div>
        
        <div className="mt-4 md:mt-0">
          <motion.div 
            className="flex items-center text-sm text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            Made with 
            <motion.div 
              className="mx-1 text-accent"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart size={14} />
            </motion.div>
            for accessibility
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
