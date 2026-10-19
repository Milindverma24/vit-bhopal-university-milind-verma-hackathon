import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Menu, 
  X, 
  FileText 
} from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingHeaderProps {
  onOpenDashboard: () => void;
  onNavigateRoute: (routeId: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onOpenDashboard,
  onNavigateRoute
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur-md transition-all duration-200 ${
        scrolled ? 'border-b border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]' : 'border-b border-[#282828]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group text-left focus:outline-none cursor-pointer"
            aria-label="RiskPulse Home"
          >
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                RiskPulse
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#b3b3b3] mt-1 leading-none">
                Risk Intelligence Platform
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[1.4px] text-[#b3b3b3]" aria-label="Main Navigation">
          <button 
            onClick={() => scrollToSection('product-preview')}
            className="hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            Product
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('intelligence')}
            className="hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            Intelligence
          </button>
          <button 
            onClick={() => scrollToSection('methodology')}
            className="hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            Methodology
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateRoute('methodology')}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Documentation
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenDashboard}
            icon={<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />}
          >
            Launch Platform
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#333333] text-white hover:bg-[#1f1f1f] focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#282828] bg-[#181818] px-4 py-6 space-y-4 animate-in slide-in-from-top-2 duration-150 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <nav className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-[1.4px] text-[#b3b3b3]">
            <button 
              onClick={() => scrollToSection('product-preview')}
              className="text-left py-2.5 px-3 rounded-full hover:bg-[#242424] hover:text-white transition-colors"
            >
              Product
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2.5 px-3 rounded-full hover:bg-[#242424] hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('intelligence')}
              className="text-left py-2.5 px-3 rounded-full hover:bg-[#242424] hover:text-white transition-colors"
            >
              Intelligence
            </button>
            <button 
              onClick={() => scrollToSection('methodology')}
              className="text-left py-2.5 px-3 rounded-full hover:bg-[#242424] hover:text-white transition-colors"
            >
              Methodology
            </button>
          </nav>

          <div className="pt-4 border-t border-[#282828] flex flex-col gap-2.5">
            <Button
              variant="secondary"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateRoute('methodology');
              }}
              className="w-full justify-center"
            >
              Documentation
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDashboard();
              }}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Platform
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
