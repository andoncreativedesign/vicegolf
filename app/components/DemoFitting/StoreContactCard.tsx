import { Phone, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface StoreContactCardProps {
  name: string;
  phone: string;
  email: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  emailSubject?: string;
  emailBody?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export function StoreContactCard({
  name,
  phone,
  email,
  whatsappNumber,
  whatsappMessage,
  emailSubject,
  emailBody,
  buttonColor,
  buttonTextColor
}: StoreContactCardProps) {

  const formatWhatsAppNumber = (input: string) => {
    let cleaned = input.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '971' + cleaned.substring(1);
    }
    if (cleaned.length <= 9 && !cleaned.startsWith('971')) {
      cleaned = '971' + cleaned;
    }
    return cleaned;
  };

  const rawTarget = whatsappNumber || phone;
  const finalNumber = formatWhatsAppNumber(rawTarget);
  const encodedMessage = encodeURIComponent(whatsappMessage || 'Hello, I would like to book a session.');
  const whatsappUrl = `https://wa.me/${finalNumber}?text=${encodedMessage}`;

  return (
    <div className="bg-white p-4 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 rounded-lg flex flex-col transition-transform duration-300 hover:-translate-y-1">
      <div className="w-full">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight text-left">
          {name}
        </h3>

        {/* Divider Line - Higher Contrast */}
        <div className="w-full h-[1.5px] bg-gray-300 mb-8" />

        <div className="space-y-6 flex flex-col items-start">
          {/* Phone */}
          <div className="flex items-center text-gray-700 font-bold group transition-colors">
            <Phone className="w-4 h-4 md:w-5 md:h-5 mr-3 text-black shrink-0" />
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="text-base md:text-xl transition-colors hover:text-black whitespace-nowrap"
              style={{ textDecoration: 'none' }}
            >
              {phone}
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center text-gray-700 font-bold group transition-colors w-full">
            <Mail className="w-4 h-4 md:w-5 md:h-5 mr-3 text-black shrink-0" />
            <a
          href={`mailto:${email}?subject=${encodeURIComponent(emailSubject || 'Booking Inquiry')}&body=${encodeURIComponent(emailBody || 'Hello, I would like to book a session.')}`}
              className="text-sm sm:text-base md:text-lg lg:text-xl transition-colors hover:text-black whitespace-nowrap"
              style={{ textDecoration: 'none' }}
            >
              {email}
            </a>
          </div>

          {/* WhatsApp Action */}
          <div className="flex items-center group transition-colors">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-900 rounded-md text-gray-900 font-bold text-sm tracking-tight hover:bg-gray-50 transition-all duration-200 group/wa"
              style={{
                textDecoration: 'none',
                ...(buttonColor ? {
                  borderColor: buttonTextColor || 'transparent',
                  backgroundColor: buttonColor,
                  color: buttonTextColor || '#000'
                } : {})
              }}
            >
              <FaWhatsapp className="w-5 h-5 mr-3 text-black" style={buttonTextColor ? { color: buttonTextColor } : {}} />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}