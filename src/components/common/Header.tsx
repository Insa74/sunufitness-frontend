import React, { useState } from 'react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)]">
      <div className="w-full max-w-[1512px] mx-auto">
        <div className="relative w-full h-[53px] sm:h-[80px] md:h-[106px]">
          {/* Background Stack */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-full h-full bg-global-background8 px-4 sm:px-8 md:px-[52px] py-2 sm:py-4 md:py-[20px]">
              <div className="flex justify-end items-center h-full">
                {/* Hamburger Menu (Mobile only) */}
                <button 
                  className="block lg:hidden p-2 text-global-text5" 
                  aria-label="Open menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-[12px] md:gap-[24px]">
                  <nav className="flex items-center gap-[12px] md:gap-[24px]" role="menubar">
                    <button 
                      role="menuitem" 
                      className="text-[14px] md:text-[20px] font-bahnschrift font-normal leading-[20px] md:leading-[25px] text-global-text5 mb-[5px] md:mb-[10px] hover:text-gray-200 transition-colors"
                    >
                      Accueil
                    </button>
                    <button 
                      role="menuitem" 
                      className="text-[14px] md:text-[20px] font-bahnschrift font-normal leading-[20px] md:leading-[25px] text-global-text5 mb-[4px] md:mb-[8px] hover:text-gray-200 transition-colors"
                    >
                      A propos
                    </button>
                    <button 
                      role="menuitem" 
                      className="text-[14px] md:text-[20px] font-bahnschrift font-normal leading-[20px] md:leading-[25px] text-global-text5 mb-[5px] md:mb-[10px] hover:text-gray-200 transition-colors"
                    >
                      Services
                    </button>
                    <button 
                      role="menuitem" 
                      className="text-[14px] md:text-[20px] font-bahnschrift font-normal leading-[20px] md:leading-[25px] text-global-text5 bg-global-background10 border border-global-text5 rounded-[5px] px-[14px] md:px-[28px] py-[5px] md:py-[10px] hover:bg-global-text5 hover:text-button-text1 transition-all"
                    >
                      Réservez
                    </button>
                  </nav>
                  
                  <Button 
                    variant="primary"
                    className="text-[14px] md:text-[20px] font-bahnschrift font-normal leading-[20px] md:leading-[25px] text-button-text1 bg-global-background8 rounded-[5px] px-[17px] md:px-[34px] py-[5px] md:py-[10px] hover:bg-gray-100"
                  >
                    Contact
                  </Button>
                  
                  <button className="w-[30px] h-[30px] md:w-[60px] md:h-[60px] bg-global-background9 rounded-[15px] md:rounded-[30px] p-[3px] md:p-[6px] hover:bg-global-background10 transition-colors">
                    <img 
                      src="/images/img_mdi_user.svg" 
                      alt="User" 
                      className="w-full h-full"
                    />
                  </button>
                </div>

                {/* Mobile Navigation Menu */}
                <nav className={`${menuOpen ? 'block' : 'hidden'} lg:hidden absolute top-full left-0 right-0 bg-global-background8 shadow-lg z-50`}>
                  <div className="flex flex-col p-4 space-y-4">
                    <button role="menuitem" className="text-left text-button-text1 hover:text-gray-600 transition-colors">
                      Accueil
                    </button>
                    <button role="menuitem" className="text-left text-button-text1 hover:text-gray-600 transition-colors">
                      A propos
                    </button>
                    <button role="menuitem" className="text-left text-button-text1 hover:text-gray-600 transition-colors">
                      Services
                    </button>
                    <button role="menuitem" className="text-left text-button-text1 border border-button-text1 rounded-[5px] px-4 py-2 hover:bg-button-text1 hover:text-global-text5 transition-all">
                      Réservez
                    </button>
                    <Button variant="primary" className="text-left">
                      Contact
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="absolute left-[29px] sm:left-[44px] md:left-[58px] top-0 w-[54px] sm:w-[81px] md:w-[108px] h-[53px] sm:h-[80px] md:h-[106px]">
            <img 
              src="/images/img_logo_500x500_px.png" 
              alt="MMT Fitness Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Profile Circle */}
          <div className="absolute right-[22px] sm:right-[33px] md:right-[44px] top-[11px] sm:top-[16px] md:top-[21px] w-[35px] sm:h-[52px] md:w-[70px] h-[35px] sm:h-[52px] md:h-[70px] bg-global-background6 rounded-[17px] sm:rounded-[26px] md:rounded-[34px]">
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;