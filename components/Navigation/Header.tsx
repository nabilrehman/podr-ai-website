import Link from 'next/link';

const Header = () => {
  return (
    <nav className="main-nav">
      <Link href="/" className="logo">
        podr.ai
      </Link>
      
      <div className="nav-links">
        <Link href="#about">
          About
        </Link>
        <Link href="#services">
          Services
        </Link>
        <Link href="#pricing">
          Pricing
        </Link>
        <Link href="/chat" className="cta-button">
          Start Chat
        </Link>
        <Link href="/voice-chat" className="cta-button ml-2">
          Voice Chat
        </Link>
      </div>
    </nav>
  );
};

export default Header;