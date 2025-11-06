'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fallback?: string | React.ReactNode;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  sizes,
  fallback,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // If no src or error occurred, show fallback
  if (!src || error) {
    if (typeof fallback === 'string') {
      return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 ${className}`}>
          <span className="text-6xl">{fallback}</span>
        </div>
      );
    }
    return fallback ? <>{fallback}</> : (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50 ${className}`}>
        <svg className="w-16 h-16 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${loading ? 'blur-sm' : 'blur-0'} transition-all duration-300`,
    onError: () => setError(true),
    onLoad: () => setLoading(false),
    priority,
    quality,
    style: objectFit ? { objectFit } : undefined,
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 animate-pulse" />
        )}
        <Image
          {...imageProps}
          fill
          sizes={sizes || '100vw'}
        />
      </div>
    );
  }

  if (width && height) {
    return (
      <div className="relative">
        {loading && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 animate-pulse rounded"
            style={{ width, height }}
          />
        )}
        <Image
          {...imageProps}
          width={width}
          height={height}
          sizes={sizes}
        />
      </div>
    );
  }

  // Default: responsive image
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 animate-pulse" />
      )}
      <Image
        {...imageProps}
        fill
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      />
    </div>
  );
}
