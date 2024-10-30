import Link from 'next/link';

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-white/30 px-10 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-[--accent-color] text-2xl font-bold">
          podr.ai
        </Link>
        
        <div className="flex items-center gap-10">
          <Link href="#about" className="text-[--text-dark] hover:text-[--accent-color] transition-colors font-medium">
            About
          </Link>
          <Link href="#services" className="text-[--text-dark] hover:text-[--accent-color] transition-colors font-medium">
            Services
          </Link>
          <Link href="#pricing" className="text-[--text-dark] hover:text-[--accent-color] transition-colors font-medium">
            Pricing
          </Link>
          <Link href="/chat" className="cta-button">
            Start Chat
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;