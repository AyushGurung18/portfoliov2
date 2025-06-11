// components/ui/BeautifulError.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BeautifulErrorProps {
  error?: string;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  backTo?: string;
  backText?: string;
  showParticles?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

const BeautifulError: React.FC<BeautifulErrorProps> = ({
  error,
  title = "Oops! Something went wrong",
  description,
  onRetry,
  retryText = "Try Again",
  backTo = "/",
  backText = "← Go Back",
  showParticles = true,
  variant = 'error'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number; delay: number; duration: number}>>([]);

  // Color schemes for different variants
  const variants = {
    error: {
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      particleColor: 'bg-red-500/30',
      buttonGradient: 'from-red-500 to-red-600',
      buttonShadow: 'hover:shadow-red-500/25',
      rippleColor: 'bg-red-500/30'
    },
    warning: {
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      particleColor: 'bg-yellow-500/30',
      buttonGradient: 'from-yellow-500 to-yellow-600',
      buttonShadow: 'hover:shadow-yellow-500/25',
      rippleColor: 'bg-yellow-500/30'
    },
    info: {
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      particleColor: 'bg-blue-500/30',
      buttonGradient: 'from-blue-500 to-blue-600',
      buttonShadow: 'hover:shadow-blue-500/25',
      rippleColor: 'bg-blue-500/30'
    }
  };

  const currentVariant = variants[variant];

  useEffect(() => {
    setIsVisible(true);
    
    if (showParticles) {
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 0.2,
        duration: 3 + Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [showParticles]);

  // Icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        );
      case 'info':
        return (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        );
      default: // error
        return (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-black">
      {/* Animated background particles */}
      {showParticles && particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 ${currentVariant.particleColor} rounded-full animate-pulse`}
          style={{
            left: `${20 + particle.id * 15}%`,
            top: `${20 + particle.id * 10}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* Main error container */}
      <div 
        className={`
          max-w-md w-full bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 
          border border-gray-700/50 shadow-2xl transform transition-all duration-700 ease-out
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
        `}
      >
        {/* Icon with pulse animation */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className={`w-16 h-16 ${currentVariant.iconBg} rounded-full flex items-center justify-center mx-auto animate-pulse`}>
              <svg 
                className={`w-8 h-8 ${currentVariant.iconColor}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {getIcon()}
              </svg>
            </div>
            {/* Ripple effect */}
            <div className={`absolute inset-0 w-16 h-16 ${currentVariant.rippleColor} rounded-full animate-ping opacity-75`}></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white text-center mb-3">
          {title}
        </h1>

        {/* Description/Error message */}
        <p className="text-gray-300 text-center mb-6 leading-relaxed">
          {description || error || "Something unexpected happened. Please try again."}
        </p>

        {/* Action buttons */}
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`
                w-full bg-gradient-to-r ${currentVariant.buttonGradient}
                text-white font-medium py-3 px-6 rounded-xl
                transform transition-all duration-200 ease-out
                hover:scale-105 hover:shadow-lg ${currentVariant.buttonShadow}
                active:scale-95
              `}
            >
              {retryText}
            </button>
          )}
          
          <Link href={backTo}>
            <button className={`
              w-full bg-gradient-to-r from-gray-700 to-gray-600
              text-white font-medium py-3 px-6 rounded-xl
              transform transition-all duration-200 ease-out
              hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25
              active:scale-95
            `}>
              {backText}
            </button>
          </Link>
        </div>

        {/* Subtle bottom accent */}
        <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
          <p className="text-gray-500 text-sm">
            If this persists, please try refreshing the page
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeautifulError;