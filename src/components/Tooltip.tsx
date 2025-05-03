"use client";

import { useState } from 'react';
import "../app/globals.css";

interface TooltipProps {
  text: string;
  tooltipText: string;
}

const Tooltip = ({ text, tooltipText }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="text-[#3CCF91]">{text}</div>
      {showTooltip && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-4 py-2 bg-black text-white border border-[#3CCF91] rounded w-auto whitespace-nowrap z-50">
          {tooltipText}
          <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-[#3CCF91] border-b-4 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
