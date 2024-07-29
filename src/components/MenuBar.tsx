import React, { useState, useRef, useEffect } from 'react';
import { Gamepad, Settings, Info, Search, Menu as MenuIcon } from 'lucide-react';

interface MenuBarProps {
  onOpenPanel: (panelName: string) => void;
}

const Logo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2"/>
    <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="20" r="4" fill="white"/>
  </svg>
);

const MenuBar: React.FC<MenuBarProps> = ({ onOpenPanel }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { icon: Gamepad, label: 'Jeux', panelName: 'games' },
    { icon: Settings, label: 'Paramètres', panelName: 'settings' },
    { icon: Info, label: 'Info', panelName: 'info' },
  ];

  const handleMenuItemClick = (panelName: string) => {
    onOpenPanel(panelName);
    setIsMenuOpen(false);
  };

  return (
    <nav ref={menuRef} className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Logo />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item.panelName}
                  onClick={() => handleMenuItemClick(item.panelName)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300"
                >
                  <item.icon className="inline-block mr-2" size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-200 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-500 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <MenuIcon className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} />
              <MenuIcon className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item) => (
            <button
              key={item.panelName}
              onClick={() => handleMenuItemClick(item.panelName)}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-purple-500 hover:bg-opacity-50 hover:text-white transition-colors duration-300"
            >
              <item.icon className="inline-block mr-2" size={18} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="px-2">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;