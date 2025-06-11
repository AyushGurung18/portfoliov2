// components/Tooltip.tsx

'use client';

import { useState } from 'react';

interface TooltipProps {
    text: string;
    tooltipText: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, tooltipText }) => {
    const [show, setShow] = useState(false);

    return (
        <span
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            className="relative cursor-help text-[#3CCF91] hover:text-[#3CCF91] transition-colors duration-200"
        >
            {text}
            {show && (
                <div className="absolute left-0 z-10 mt-2 w-60 p-2 bg-gray-800 text-white text-xs rounded shadow-lg hidden md:block">
                    {tooltipText}
                </div>
            )}
        </span>
    );
};

export default Tooltip;
