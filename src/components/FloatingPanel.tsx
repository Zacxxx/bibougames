import React from 'react';

interface FloatingPanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl transition-all duration-300 transform scale-95 hover:scale-100">
        <div className="sticky top-0 bg-white z-10 flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;