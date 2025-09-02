import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full">
      <div className="w-full max-w-[1512px] mx-auto">
        <div className="relative w-full h-[60px] flex">
          {/* White section for logo - trapézoïdale (15% width) */}
          <div className="bg-white flex items-center pl-[40px] pr-[70px] relative" style={{clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)'}}>
            <img 
              src="/images/img_logo_500x500_px.png" 
              alt="MMT Fitness Logo" 
              className="w-[70px] object-contain"
            />
          </div>
          
          {/* Green section for navigation */}
          <div className="w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] flex items-center justify-end pr-[40px] gap-[30px] ml-[-40px]">
            {/* Hamburger Menu (Mobile only) */}
            <button 
              className="block lg:hidden p-2 text-white" 
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-[40px]">
              <nav className="flex items-center gap-[40px]" role="menubar">
                <button 
                  role="menuitem" 
                  className="text-[16px] font-medium text-white hover:text-gray-200 transition-colors"
                >
                  Accueil
                </button>
                <button 
                  role="menuitem" 
                  className="text-[16px] font-medium text-white hover:text-gray-200 transition-colors"
                >
                  A propos
                </button>
                <button 
                  role="menuitem" 
                  className="text-[16px] font-medium text-white hover:text-gray-200 transition-colors"
                >
                  Services
                </button>
                <button 
                  role="menuitem" 
                  className="text-[16px] font-medium text-white border border-white rounded-[5px] px-[20px] py-[8px] hover:bg-white hover:text-green-600 transition-all"
                >
                  Réservez
                </button>
              </nav>
              
              <Button 
                variant="primary"
                className="text-[16px] font-medium text-green-600 bg-white rounded-[5px] px-[20px] py-[8px] hover:bg-gray-100 transition-all"
              >
                Contact
              </Button>
              
              <button 
                className="w-[40px] h-[40px] bg-[#3BB641] rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                onClick={() => navigate('/member')}
                title="Espace Membre"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
            </div>

          </div>
          
          {/* Mobile Navigation Menu */}
          <nav className={`${menuOpen ? 'block' : 'hidden'} lg:hidden absolute top-full left-0 right-0 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] shadow-lg z-50`}>
            <div className="flex flex-col p-4 space-y-4">
              <button role="menuitem" className="text-left text-global-text5 hover:text-gray-200 transition-colors">
                Accueil
              </button>
              <button role="menuitem" className="text-left text-global-text5 hover:text-gray-200 transition-colors">
                A propos
              </button>
              <button role="menuitem" className="text-left text-global-text5 hover:text-gray-200 transition-colors">
                Services
              </button>
              <button role="menuitem" className="text-left text-global-text5 border border-global-text5 rounded-[5px] px-4 py-2 hover:bg-global-text5 hover:text-button-text1 transition-all">
                Réservez
              </button>
              <Button variant="primary" className="text-left bg-white text-button-text1">
                Contact
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;