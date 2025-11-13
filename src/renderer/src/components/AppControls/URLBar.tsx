/**
 * URL Bar Component
 * Displays current URL with security indicator and allows navigation
 * Single Responsibility: URL display and input
 */

import { useState, useEffect, KeyboardEvent } from 'react';
import { LockIcon, DocumentIcon, WarningIcon, SpinnerIcon, ArrowRightCircleIcon } from '../Icons';

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
      return <DocumentIcon className="w-4 h-4 text-gray-400" title="Local file" />;
    }

    if (isSecure) {
      return <LockIcon className="w-4 h-4 text-green-500" title="Connection is secure (HTTPS)" />;
    }

    return (
      <WarningIcon className="w-4 h-4 text-amber-500" title="Connection is not secure (HTTP)" />
    );
  };

  return (
    <div className="flex items-center flex-1 max-w-2xl mx-2">
      <div className="flex items-center bg-gray-700 rounded-lg px-3 py-1.5 flex-1 border border-gray-600 focus-within:border-indigo-500 transition-colors">
        {/* Security Icon */}
        <div className="mr-2">{getSecurityIcon()}</div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mr-2">
            <SpinnerIcon className="w-4 h-4 text-indigo-500 animate-spin" />
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
            <ArrowRightCircleIcon className="w-4 h-4 text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
}
