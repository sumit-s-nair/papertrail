/**
 * Custom image loader for Next.js
 * This allows loading images from any HTTPS source while maintaining security
 * by validating URLs and optionally using an image optimization service
 */

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS for security
    if (parsed.protocol !== 'https:') {
      return false;
    }
    // Check if it looks like an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      parsed.pathname.toLowerCase().includes(ext)
    );
    
    // Allow URLs that have image extensions or are from known image services
    const knownImageHosts = [
      'unsplash.com',
      'pexels.com',
      'pixabay.com',
      'picsum.photos',
      'imgur.com',
      'cloudinary.com',
      'imagekit.io',
    ];
    
    const isKnownHost = knownImageHosts.some(host => 
      parsed.hostname.includes(host)
    );
    
    return hasImageExtension || isKnownHost;
  } catch {
    return false;
  }
}

/**
 * Custom loader function for Next.js Image component
 * You can integrate with services like Cloudinary or imgix for optimization
 */
export function customImageLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For external URLs, return as-is (Next.js will handle optimization if unoptimized=false)
  // For production, you might want to proxy through an image optimization service
  return src;
}
