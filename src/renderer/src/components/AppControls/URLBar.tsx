/**
 * URL Bar Component
 * Displays current URL with security indicator and allows navigation
 * Single Responsibility: URL display and input
 */

import { useState, useEffect, KeyboardEvent } from 'react';

interface URLBarProps {
  url: string;
  isLoading?: boolean;
  onNavigate: (url: string) => void;
}

export function URLBar({ url, isLoading = false, onNavigate }: URLBarProps) {
  const [inputValue, setInputValue] = useState(url);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(url);
    }
  }, [url, isEditing]);

  const isSecure = url.startsWith('https://');
  const isLocalFile = url.startsWith('file://');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigate();
    } else if (e.key === 'Escape') {
      setInputValue(url);
      setIsEditing(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleNavigate = () => {
    let urlToNavigate = inputValue.trim();
    
    // If no protocol, assume https
    if (urlToNavigate && !urlToNavigate.match(/^[a-z]+:\/\//i)) {
      // Check if it looks like a domain
      if (urlToNavigate.includes('.') || urlToNavigate.includes('localhost')) {
        urlToNavigate = `https://${urlToNavigate}`;
      } else {
        // Treat as search query
        urlToNavigate = `https://www.google.com/search?q=${encodeURIComponent(urlToNavigate)}`;
      }
    }
    
    if (urlToNavigate && urlToNavigate !== url) {
      onNavigate(urlToNavigate);
    }
    
    setIsEditing(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const getSecurityIcon = () => {
    if (isLocalFile) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }

    if (isSecure) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  };

  const getSecurityTooltip = () => {
    if (isLocalFile) return 'Local file';
    if (isSecure) return 'Connection is secure (HTTPS)';
    return 'Connection is not secure (HTTP)';
  };

  return (
    <div className="flex items-center flex-1 max-w-2xl mx-2">
      <div className="flex items-center bg-gray-700 rounded-lg px-3 py-1.5 flex-1 border border-gray-600 focus-within:border-indigo-500 transition-colors">
        {/* Security Icon */}
        <div className="mr-2" title={getSecurityTooltip()}>
          {getSecurityIcon()}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mr-2">
            <svg className="w-4 h-4 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* URL Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            setIsEditing(true);
            // Select all on focus for easy editing
            (document.activeElement as HTMLInputElement)?.select();
          }}
          onBlur={() => {
            setIsEditing(false);
            setInputValue(url);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter URL or search..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />

        {/* Navigate/Refresh Button */}
        {isEditing && inputValue !== url && (
          <button
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent blur
              handleNavigate();
            }}
            className="ml-2 p-1 hover:bg-gray-600 rounded transition"
            title="Navigate"
          >
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
