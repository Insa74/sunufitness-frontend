import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  token: string;
  size?: number;
  fileName?: string;
  shareText?: string;
};

const MemberQrCode: React.FC<Props> = ({
  token,
  size = 220,
  fileName = 'mon-qr-sunufitness.png',
  shareText,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = wrapperRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = fileName;
    link.click();
  };

  const handleShareWhatsapp = () => {
    const publicUrl = `${window.location.origin}/mon-qr/${token}`;
    const text = shareText ?? `Voici mon QR code d'accès SUNUFITNESS : ${publicUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={wrapperRef}
        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm inline-block"
      >
        <QRCodeCanvas value={token} size={size} level="M" marginSize={2} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#05835e] hover:bg-[#3d6d4f] text-white font-semibold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger mon QR
        </button>

        <button
          type="button"
          onClick={handleShareWhatsapp}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1fb856] text-white font-semibold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 004.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.92C21.96 6.45 17.5 2 12.04 2zm5.79 14.09c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.26-.28.56-.35.75-.35.19 0 .38 0 .54.01.17.01.41-.06.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.61-.14.24.09 1.55.73 1.82.86.26.14.44.2.5.31.07.12.07.68-.17 1.36z" />
          </svg>
          Partager sur WhatsApp
        </button>
      </div>
    </div>
  );
};

export default MemberQrCode;
