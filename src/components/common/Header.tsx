import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Listen for auth:logout events from apiClient
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [logout]);

  return (
    <header
      className="scroll-smooth w-full fixed top-0 left-0"
      style={{ zIndex: 999999, position: 'fixed', isolation: 'isolate' }}
    >
      <div className="w-full  mx-auto">
        <div className="relative w-full h-[60px] flex">
          {/* White section for logo - trapézoïdale (15% width) */}
          <div
            className="bg-white flex items-center pl-[40px] pr-[70px] relative"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)' }}
          >
            <img
              src="/images/log.png"
              alt="MMT Fitness Logo"
              className="w-[200px] object-contain"
            />
          </div>

          {/* Green section for navigation */}
          <div className="w-full bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] flex items-center justify-end pr-[40px] gap-[30px] ml-[-40px]">
            {/* Hamburger Menu (Mobile only) */}
            <button
              className="block lg:hidden p-2 text-white"
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-[40px]">
              <nav className="flex items-center gap-[40px]" role="menubar">
                <a
                  href="#home"
                  role="menuitem"
                  onClick={() => navigate('/')}
                  className="text-[16px]  text-white hover:text-gray-200 transition-colors"
                >
                  Accueil
                </a>
                <a
                  href=""
                  role="menuitem"
                  onClick={() => navigate('/about')}
                  className="text-[16px]  text-white hover:text-gray-200 transition-colors"
                >
                  A propos
                </a>
                <a
                  href=""
                  onClick={() => navigate('/services')}
                  role="menuitem"
                  className="text-[16px]  text-white hover:text-gray-200 transition-colors"
                >
                  Services
                </a>
                {/* <button
                  role="menuitem"
                  onClick={() => navigate('/services')}
                  className="text-[16px]  text-white border border-white rounded-[3px] px-[20px] py-[8px] hover:bg-white hover:text-green-600 transition-all"
                >
                  Réservez
                </button> */}
              </nav>

              {/* <a
                href="#contact"
                className="text-[16px]  text-green-600 bg-white rounded-[3px] px-[20px] py-[8px] hover:bg-gray-100 transition-all"
              >
                Contact
              </a> */}

              {isAuthenticated ? (
                <button
                  className="w-[40px] h-[40px]   rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                  onClick={() => navigate('/member')}
                  title="Mon compte"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-[16px] text-white border border-white rounded-[3px] px-[16px] py-[8px] hover:bg-white hover:text-green-600 transition-all"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-[16px]  text-green-600 bg-white rounded-[3px] px-[16px] py-[8px] hover:bg-gray-100 transition-all"
                  >
                    Créer un compte
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <nav
            className={`${menuOpen ? 'block' : 'hidden'} lg:hidden absolute top-full left-0 right-0 bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] shadow-lg z-50`}
          >
            <div className="flex flex-col p-4 space-y-4">
              <a
                href="#home"
                role="menuitem"
                onClick={() => {
                  navigate('/');
                  setMenuOpen(false);
                }}
                className="text-left text-global-text5 hover:text-gray-200 transition-colors"
              >
                Accueil
              </a>
              <a
                href=""
                onClick={() => navigate('/about')}
                role="menuitem"
                className="text-left text-global-text5 hover:text-gray-200 transition-colors"
              >
                A propos
              </a>
              <a
                href=""
                onClick={() => navigate('/services')}
                role="menuitem"
                className="text-left text-global-text5 hover:text-gray-200 transition-colors"
              >
                Services
              </a>
              <button
                role="menuitem"
                onClick={() => {
                  navigate('/services');
                  setMenuOpen(false);
                }}
                className="text-left text-global-text5 border border-global-text5 rounded-[5px] px-4 py-2 hover:bg-global-text5 hover:text-button-text1 transition-all"
              >
                Réservez
              </button>
              <a href="#contact" className="text-left bg-white text-button-text1">
                Contact
              </a>
              {isAuthenticated ? (
                <button
                  role="menuitem"
                  onClick={() => {
                    navigate('/member');
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-left text-global-text5 hover:text-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Mon compte
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    role="menuitem"
                    onClick={() => {
                      navigate('/login');
                      setMenuOpen(false);
                    }}
                    className="text-left text-global-text5 border border-global-text5 rounded-[5px] px-4 py-2 hover:bg-global-text5 hover:text-button-text1 transition-all"
                  >
                    Se connecter
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      navigate('/register');
                      setMenuOpen(false);
                    }}
                    className="text-left bg-white text-button-text1 rounded-[5px] px-4 py-2"
                  >
                    Créer un compte
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
