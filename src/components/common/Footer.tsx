import React, { useState } from 'react';
import { newsletterService } from '../../services/newsletterService';

export const Footer: React.FC = () => {
  const [mobileEmail, setMobileEmail] = useState('');
  const [desktopEmail, setDesktopEmail] = useState('');
  const [mobileLoading, setMobileLoading] = useState(false);
  const [desktopLoading, setDesktopLoading] = useState(false);
  const [mobileMessage, setMobileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [desktopMessage, setDesktopMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleMobileSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileEmail.trim()) {
      setMobileMessage({ type: 'error', text: 'Veuillez entrer une adresse email' });
      return;
    }

    setMobileLoading(true);
    setMobileMessage(null);

    try {
      const response = await newsletterService.subscribe({ email: mobileEmail });
      setMobileMessage({ type: 'success', text: response.message || 'Inscription réussie!' });
      setMobileEmail('');
    } catch (error: any) {
      setMobileMessage({
        type: 'error',
        text: error.message || 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setMobileLoading(false);
    }
  };

  const handleDesktopSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopEmail.trim()) {
      setDesktopMessage({ type: 'error', text: 'Veuillez entrer une adresse email' });
      return;
    }

    setDesktopLoading(true);
    setDesktopMessage(null);

    try {
      const response = await newsletterService.subscribe({ email: desktopEmail });
      setDesktopMessage({ type: 'success', text: response.message || 'Inscription réussie!' });
      setDesktopEmail('');
    } catch (error: any) {
      setDesktopMessage({
        type: 'error',
        text: error.message || 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setDesktopLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Footer */}
      <div className="w-full bg-global-background7">
        <div className="w-full  mx-auto">
          <div className="flex flex-col justify-start items-start w-full p-[20px] sm:p-[24px] md:p-[28px] lg:p-[18px]">
            <div className="flex flex-col justify-start items-center w-full px-4 sm:px-6 md:px-8 lg:px-[16px] mb-[40px] sm:mb-[50px] md:mb-[60px] lg:mb-[72px]">
              <div className="flex flex-col lg:flex-row justify-start items-center lg:items-start w-full gap-[40px] sm:gap-[50px] md:gap-[60px] lg:gap-[80px]">
                {/* Logo and Description */}
                <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[24px] justify-start items-center lg:items-start w-full lg:w-[40%] px-4 lg:px-[14px]">
                  <div className="flex flex-col items-center lg:items-start w-full max-w-[350px] lg:max-w-none">
                    <img
                      src="/images/log.png"
                      alt="MMT Fitness Logo"
                      className="w-[200px] sm:w-[140px] md:w-[160px] lg:w-[206px] h-[120px] object-contain sm:mb-[20px] md:mb-[24px] lg:mb-[28px]"
                    />
                    <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] font-bahnschrift font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[25px] text-center lg:text-justify  text-global-text1 w-full">
                      Depuis notre création, nous nous engageons à offrir un environnement motivant
                      et inclusif pour tous les passionnés de fitness, où chaque pas vers vos
                      objectifs est célébré et chaque défi devient une occasion de grandir. Notre
                      équipe de coachs certifiés est là pour vous guider avec expertise
                    </p>
                  </div>
                  <div className="flex   flex-row justify-center items-center w-[160px] sm:w-[160px] md:w-[200px] lg:w-[37%] bg-global-background3 rounded-[6px] py-[10px] sm:py-[12px] px-[20px] sm:px-[24px] lg:px-[16px]">
                    <div className="flex gap-[10px] flex-row justify-between items-center w-full">
                      <a
                        href="https://www.facebook.com/profile.php?id=61582509353608&name=xhp_nt__fb__action__open_user"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-facebook text-[20px] sm:text-[22px] md:text-[24px] lg:text-[24px] text-[#05835e] cursor-pointer hover:opacity-80 transition-opacity"></i>
                      </a>
                      <a
                        href="https://www.instagram.com/sunufitness.saly?igsh=bW9oaGs1amY0d2x1&utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram text-[20px] sm:text-[22px] md:text-[24px] lg:text-[24px] text-[#05835e] cursor-pointer hover:opacity-80 transition-opacity"></i>
                      </a>
                      <a
                        href="https://www.tiktok.com/@taggatyaram?_r=1&_t=ZN-91Vf0I1CRqY"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-tiktok text-[20px] sm:text-[22px] md:text-[24px] lg:text-[24px] text-[#05835e] cursor-pointer hover:opacity-80 transition-opacity"></i>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact and Newsletter */}
                <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[10px] justify-start items-center w-full lg:w-[60%]">
                  {/* Mobile/Tablet Headers - Stacked */}
                  <div className="flex flex-col lg:hidden gap-[32px] sm:gap-[40px] md:gap-[48px] w-full">
                    <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-bahnschrift font-normal leading-[24px] sm:leading-[28px] md:leading-[32px] text-center text-global-text1">
                      Contact
                    </h3>
                  </div>

                  {/* Desktop Headers - Side by Side */}
                  <div className="hidden lg:flex flex-row w-full px-[50px]">
                    <div className="w-[38%]">
                      <h3 className="text-[30px] font-bahnschrift font-normal leading-[37px] text-left text-global-text1">
                        Contact
                      </h3>
                    </div>
                    <div className="w-[54%]">
                      <h3 className="text-[30px] ml-[36px] font-bahnschrift font-normal leading-[37px] text-left text-global-text1">
                        Newsletter
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row justify-center items-start w-full gap-[40px] sm:gap-[50px] md:gap-[60px] lg:gap-0">
                    {/* Contact Info */}
                    <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[30px] justify-start items-start lg:items-start w-full lg:w-[38%] max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-none mx-auto lg:mx-0">
                      <div className="flex flex-row justify-start items-start w-full">
                        <div className="w-[36px] sm:w-[40px] md:w-[44px] lg:w-[50px] h-[36px] sm:h-[40px] md:h-[44px] lg:h-[50px] bg-global-background3 rounded-[2px] flex-shrink-0 flex items-center justify-center">
                          <i className="fas fa-phone text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-[#05835e]"></i>
                        </div>
                        <span className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[14px] font-kanit font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[27px] text-left text-global-text1 ml-[12px] sm:ml-[14px] md:ml-[16px] lg:ml-[18px] flex items-center h-[36px] sm:h-[40px] md:h-[44px] lg:h-[50px]">
                          +221 789573842
                        </span>
                      </div>

                      <div className="flex flex-row justify-start items-start w-full">
                        <div className="w-[36px] sm:w-[40px] md:w-[44px] lg:w-[50px] h-[36px] sm:h-[40px] md:h-[44px] lg:h-[50px] bg-global-background3 rounded-[2px] flex-shrink-0 flex items-center justify-center">
                          <i className="fas fa-envelope text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-[#05835e]"></i>
                        </div>
                        <span className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[14px] font-kanit font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[27px] text-left text-global-text1 ml-[12px] sm:ml-[14px] md:ml-[16px] lg:ml-[18px] flex items-center h-[36px] sm:h-[40px] md:h-[44px] lg:h-[50px]">
                          info@sunufitness.com
                        </span>
                      </div>

                      <div className="flex flex-row justify-start items-start w-full">
                        <div className="w-[36px] sm:w-[40px] md:w-[44px] lg:w-[50px] h-[36px] sm:h-[40px] md:h-[44px] lg:h-[50px] bg-global-background3 rounded-[2px] flex-shrink-0 flex items-center justify-center">
                          <i className="fas fa-map-marker-alt text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-[#05835e]"></i>
                        </div>
                        <div className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[14px] font-kanit font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[26px] text-left text-global-text1 ml-[12px] sm:ml-[14px] md:ml-[16px] lg:ml-[18px] flex items-center h-[36px] sm:h-[40px] md:h-[44px] lg:h-[50px]">
                          Saly 10
                          <br />
                          Route de Ngaparou Saly Sénégal
                        </div>
                      </div>
                    </div>

                    {/* Newsletter - Mobile/Tablet */}
                    <div className="flex flex-col lg:hidden gap-[20px] sm:gap-[24px] md:gap-[28px] justify-start items-center w-full max-w-[400px] mx-auto">
                      <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-bahnschrift font-normal leading-[24px] sm:leading-[28px] md:leading-[32px] text-center text-global-text1">
                        Newsletter
                      </h3>
                      <p className="text-[13px] sm:text-[14px] md:text-[16px] font-bahnschrift font-light leading-[18px] sm:leading-[20px] md:leading-[22px] text-center text-global-text3 w-full">
                        Ne manquez aucune actualité, offre exclusive ou conseil coaching de votre
                        centre de fitness préféré ! En vous abonnant, vous recevrez directement dans
                        votre boîte mail .
                      </p>
                      <form onSubmit={handleMobileSubscribe} className="w-full">
                        <div className="flex flex-col sm:flex-row items-center w-full gap-[12px] sm:gap-0">
                          <input
                            type="email"
                            value={mobileEmail}
                            onChange={(e) => setMobileEmail(e.target.value)}
                            placeholder="Votre adresse email"
                            disabled={mobileLoading}
                            className="w-full sm:flex-1 h-[44px] sm:h-[48px] md:h-[50px] bg-global-background3 border border-[#05835e] rounded-[5px] sm:rounded-l-[5px] sm:rounded-r-none px-[16px] sm:px-[18px] text-[13px] sm:text-[14px] md:text-[15px] font-bahnschrift text-global-text1 placeholder:text-global-text1 placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#05835e] disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={mobileLoading}
                            className="flex flex-row justify-center items-center bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-[5px] sm:rounded-l-none sm:rounded-r-[5px] px-[16px] sm:px-[12px] py-[12px] sm:py-[14px] md:py-[16px] w-full sm:w-auto hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {mobileLoading ? (
                              <span className="text-[13px] sm:text-[14px] font-bahnschrift text-global-text5">
                                Envoi...
                              </span>
                            ) : (
                              <>
                                <img
                                  src="/images/img_tabler_send.svg"
                                  alt="Send"
                                  className="w-[20px] sm:w-[24px] md:w-[28px] h-[20px] sm:h-[24px] md:h-[28px]"
                                />
                                <span className="text-[13px] sm:text-[14px] font-bahnschrift text-global-text5 ml-[8px] sm:hidden">
                                  S'abonner
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                        {mobileMessage && (
                          <p
                            className={`mt-[12px] text-[12px] sm:text-[13px] font-bahnschrift text-center ${
                              mobileMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {mobileMessage.text}
                          </p>
                        )}
                      </form>
                    </div>

                    {/* Newsletter - Desktop */}
                    <div className="hidden lg:flex flex-col gap-[20px] justify-start items-start w-full lg:w-[54%]">
                      <p className="text-[14px] font-bahnschrift font-light leading-[21px] text-left text-global-text3 w-full">
                        Ne manquez aucune actualité, offre exclusive ou conseil coaching de votre
                        centre de fitness préféré ! En vous abonnant, vous recevrez directement dans
                        votre boîte mail .
                      </p>
                      <form onSubmit={handleDesktopSubscribe} className="w-full">
                        <div className="flex flex-row items-center w-full">
                          <input
                            type="email"
                            value={desktopEmail}
                            onChange={(e) => setDesktopEmail(e.target.value)}
                            placeholder="Votre adresse email"
                            disabled={desktopLoading}
                            className="w-[290px] h-[46px] bg-global-background3 border border-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-l-[5px] px-[16px] text-[15px] font-bahnschrift text-global-text1 placeholder:text-global-text1 placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#05835e] disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={desktopLoading}
                            className="flex flex-row items-center bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-r-[5px] px-[9px] py-[9px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {desktopLoading ? (
                              <span className="text-[14px] font-bahnschrift text-global-text5 px-[8px]">
                                ...
                              </span>
                            ) : (
                              <img
                                src="/images/img_tabler_send.svg"
                                alt="Send"
                                className="w-[32px] h-[32px]"
                              />
                            )}
                          </button>
                        </div>
                        {desktopMessage && (
                          <p
                            className={`mt-[12px] text-[13px] font-bahnschrift ${
                              desktopMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {desktopMessage.text}
                          </p>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] px-4 sm:px-6 md:px-8 lg:px-[34px] py-[12px] sm:py-[14px] md:py-[16px] lg:py-[10px]">
        <p className="text-[13px] sm:text-[15px] md:text-[14px] lg:text-[14px] font-kanit font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[27px] text-center text-global-text5 w-full  mx-auto">
          <span className="text-global-text5">© 2025 SUNUFITNESS. Tous droits réservés</span>
          <span className="block sm:inline text-global-text5"> | Design By </span>
          <a href="https://maisoft-group.com/" className="text-global-text5 underline">
            Maisoft.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
