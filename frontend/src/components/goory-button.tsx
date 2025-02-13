import React from 'react';

interface GooeyButtonProps {
    label: string;
    onClick?: () => void;
}

const GooeyButton: React.FC<GooeyButtonProps> = ({ label, onClick }) => {
    return (
        <div className="relative p-6 filter-[url('#goo')]">
            <a
                className="relative inline-block text-center font-bold text-xl text-bg bg-color px-4 py-2 rounded-full min-w-[8.23em] no-underline font-custom"
                href="#"
                onClick={onClick}
            >
                {label}
                <span className="before:absolute before:content-[''] before:inline-block before:bg-color before:rounded-full before:transition-transform before:duration-1000 before:ease-in-out before:transform-scale-0 before:z-[-1] before:top-[-25%] before:left-[20%] before:w-[4.4em] before:h-[2.95em]
                after:absolute after:content-[''] after:inline-block after:bg-color after:rounded-full after:transition-transform after:duration-1000 after:ease-in-out after:transform-scale-0 after:z-[-1] after:bottom-[-25%] after:right-[20%] after:w-[4.4em] after:h-[2.95em]
                hover:before:transform-none hover:after:transform-none" />
            </a>
            <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default GooeyButton;