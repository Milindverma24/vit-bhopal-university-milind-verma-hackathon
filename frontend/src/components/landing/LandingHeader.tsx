import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Menu, 
  X, 
  BarChart3, 
  Activity, 
  Layers, 
  ShieldAlert, 
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
      className={`sticky top-0 z-40 w-full bg-white transition-all duration-200 ${
        scrolled ? 'border-b border-[#d9d9d9] shadow-[0_2px_12px_rgba(0,0,0,0.04)]' : 'border-b border-[#d9d9d9]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Geometric Waveform Brand Identity */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group text-left focus:outline-none"
            aria-label="RiskPulse AI Home"
          >
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-95">
              {/* Minimalist Geometric Signal / Waveform Mark */}
              <div className="flex items-center gap-[3px] h-4">
                <span className="w-[3px] h-2 bg-white rounded-full"></span>
                <span className="w-[3px] h-4 bg-white rounded-full"></span>
                <span className="w-[3px] h-3 bg-white rounded-full"></span>
                <span className="w-[3px] h-4 bg-white rounded-full"></span>
                <span className="w-[3px] h-2 bg-white rounded-full"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-black flex items-center gap-1.5 leading-none">
                RiskPulse <span className="font-mono text-xs px-1.5 py-0.5 bg-[#efefef] rounded text-black border border-[#d9d9d9]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#767676] mt-1 leading-none">
                Risk Intelligence Platform
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5e5e5e]" aria-label="Main Navigation">
          <button 
            onClick={() => scrollToSection('product-preview')}
            className="hover:text-black transition-colors focus:outline-none"
          >
            Product
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-black transition-colors focus:outline-none"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('intelligence')}
            className="hover:text-black transition-colors focus:outline-none"
          >
            Intelligence
          </button>
          <button 
            onClick={() => scrollToSection('methodology')}
            className="hover:text-black transition-colors focus:outline-none"
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
            className="text-xs font-medium"
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Documentation
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenDashboard}
            className="text-xs font-medium group"
            icon={<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />}
          >
            Open Dashboard
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#d9d9d9] text-black hover:bg-[#efefef] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#d9d9d9] bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-black">
            <button 
              onClick={() => scrollToSection('product-preview')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#efefef] transition-colors"
            >
              Product
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#efefef] transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('intelligence')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#efefef] transition-colors"
            >
              Intelligence
            </button>
            <button 
              onClick={() => scrollToSection('methodology')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#efefef] transition-colors"
            >
              Methodology
            </button>
          </nav>

          <div className="pt-4 border-t border-[#d9d9d9] flex flex-col gap-2">
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
              Open Dashboard
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
