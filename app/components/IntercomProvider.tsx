"use client";

import { useEffect } from 'react';
import Intercom, { show as showIntercom } from '@intercom/messenger-js-sdk';

interface User {
  id: string;
  name?: string;
  email?: string;
  createdAt?: number; // Unix timestamp in seconds
}

interface IntercomProviderProps {
  user?: User;
}

export default function IntercomProvider({ user }: IntercomProviderProps) {
  useEffect(() => {
    // Create custom launcher button that matches the website design
    const createCustomLauncher = () => {
      // Remove any existing custom launcher
      const existingLauncher = document.getElementById('custom-intercom-launcher');
      if (existingLauncher) {
        existingLauncher.remove();
      }

      // Create the custom button
      const customButton = document.createElement('button');
      customButton.id = 'custom-intercom-launcher';
      customButton.className = 'custom-intercom-launcher';
      customButton.setAttribute('aria-label', 'Open Intercom Messenger');
      customButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
        </svg>
      `;
      
      // Apply styles with orange border, exact background blue (#033ba3), 3D effect, responsive size
      customButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #033ba3;
        border: 3px solid #bc4500;
        box-shadow: 
          0 8px 16px rgba(0, 0, 0, 0.4),
          0 4px 8px rgba(0, 0, 0, 0.3),
          inset 0 2px 4px rgba(3, 59, 163, 0.4),
          inset 0 -2px 4px rgba(3, 59, 163, 0.6),
          0 0 0 1px rgba(188, 69, 0, 0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
        transition: all 0.3s ease;
        transform: perspective(1000px) translateZ(0);
      `;

      // Style the SVG icon - orange to match the border, responsive size
      const svg = customButton.querySelector('svg');
      if (svg) {
        svg.style.cssText = `
          width: 24px;
          height: 24px;
          fill: #bc4500;
          filter: drop-shadow(0 2px 4px rgba(188, 69, 0, 0.4));
          transition: all 0.3s ease;
        `;
      }

      // Hover effects - enhanced 3D with slightly lighter blue and stronger shadow
      customButton.addEventListener('mouseenter', () => {
        customButton.style.backgroundColor = '#0448c4';
        customButton.style.borderColor = '#bc4500';
        customButton.style.boxShadow = `
          0 12px 24px rgba(0, 0, 0, 0.5),
          0 6px 12px rgba(0, 0, 0, 0.4),
          inset 0 2px 4px rgba(3, 59, 163, 0.5),
          inset 0 -2px 4px rgba(3, 59, 163, 0.7),
          0 0 0 1px rgba(188, 69, 0, 0.3)
        `;
        customButton.style.transform = 'perspective(1000px) translateY(-2px) translateZ(10px) scale(1.05)';
      });

      customButton.addEventListener('mouseleave', () => {
        customButton.style.backgroundColor = '#033ba3';
        customButton.style.borderColor = '#bc4500';
        customButton.style.boxShadow = `
          0 8px 16px rgba(0, 0, 0, 0.4),
          0 4px 8px rgba(0, 0, 0, 0.3),
          inset 0 2px 4px rgba(3, 59, 163, 0.4),
          inset 0 -2px 4px rgba(3, 59, 163, 0.6),
          0 0 0 1px rgba(188, 69, 0, 0.2)
        `;
        customButton.style.transform = 'perspective(1000px) translateZ(0) scale(1)';
      });

      // Click handler to open Intercom
      customButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Try multiple methods to show Intercom
        try {
          // Method 1: Use the imported show function
          showIntercom();
        } catch (error) {
          // Method 2: Use window.Intercom if available
          if (window.Intercom && typeof window.Intercom === 'function') {
            window.Intercom('show');
          } else if (window.Intercom && typeof window.Intercom.show === 'function') {
            window.Intercom.show();
          }
        }
      });

      // Add to body
      document.body.appendChild(customButton);

      return customButton;
    };

    // Inject CSS to hide default Intercom launcher and add responsive styles
    const styleId = 'intercom-custom-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        /* Hide default Intercom launcher but keep messenger window visible */
        #intercom-launcher,
        [id*="intercom-launcher"]:not(#custom-intercom-launcher),
        div[id*="IntercomButton"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }

        /* Ensure Intercom messenger window is visible and make it larger */
        #intercom-container {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        /* Make Intercom messenger window bigger - match screenshot size */
        iframe[id*="intercom"] {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 450px !important;
          height: 85vh !important;
          min-height: 600px !important;
          max-width: 450px !important;
          max-height: 90vh !important;
        }

        /* Container adjustments for proper positioning */
        #intercom-container {
          width: 450px !important;
          height: 85vh !important;
          min-height: 600px !important;
          max-height: 90vh !important;
        }

        /* On mobile, make it full width/height */
        @media (max-width: 767px) {
          iframe[id*="intercom"] {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            min-height: 100vh !important;
          }

          #intercom-container {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            min-height: 100vh !important;
          }
        }

        /* Responsive sizing for custom Intercom button */
        #custom-intercom-launcher {
          width: 60px !important;
          height: 60px !important;
        }

          #custom-intercom-launcher svg {
            width: 24px !important;
            height: 24px !important;
            fill: #bc4500 !important;
          }

        /* Larger size on desktop/tablet */
        @media (min-width: 768px) {
          #custom-intercom-launcher {
            width: 120px !important;
            height: 120px !important;
          }

          #custom-intercom-launcher svg {
            width: 48px !important;
            height: 48px !important;
            fill: #bc4500 !important;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Initialize Intercom with customization options
    Intercom({
      app_id: 'g0t8dac9',
      hide_default_launcher: true, // Hide default launcher
      action_color: '#bc4500', // Orange action color
      background_color: '#ffffff', // White background for messenger
      ...(user && {
        user_id: user.id,
        ...(user.name && { name: user.name }),
        ...(user.email && { email: user.email }),
        ...(user.createdAt && { created_at: user.createdAt }),
      }),
    });

    // Wait for Intercom to be fully loaded before creating custom launcher
    let checkInterval: NodeJS.Timeout | null = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;

    const waitForIntercom = () => {
      checkInterval = setInterval(() => {
        if (window.Intercom || document.getElementById('intercom-frame')) {
          if (checkInterval) clearInterval(checkInterval);
          createCustomLauncher();
        }
      }, 100);

      // Fallback: create launcher after max 3 seconds
      fallbackTimeout = setTimeout(() => {
        if (checkInterval) clearInterval(checkInterval);
        createCustomLauncher();
      }, 3000);
    };

    // Start checking for Intercom
    waitForIntercom();

    // Cleanup
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      const launcher = document.getElementById('custom-intercom-launcher');
      if (launcher) {
        launcher.remove();
      }
    };
  }, [user]);

  return null;
}

