import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: ${props => props.placeholderColor || '#f0f0f0'};
  
  ${props => props.aspectRatio && `
    &::before {
      content: '';
      display: block;
      padding-top: ${(1 / props.aspectRatio) * 100}%;
    }
  `}
  
  ${props => props.borderRadius && `
    border-radius: ${props.borderRadius};
  `}
  
  ${props => props.maxWidth && `
    max-width: ${props.maxWidth};
    margin: 0 auto;
  `}
  
  ${props => props.shadow && `
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `}
`;

const StyledImage = styled.img`
  width: 100%;
  height: ${props => props.aspectRatio ? 'auto' : props.height || 'auto'};
  object-fit: ${props => props.objectFit || 'cover'};
  display: block;
  transition: opacity 0.3s ease, filter 0.3s ease;
  opacity: ${props => props.isLoaded ? 1 : 0};
  filter: ${props => props.isLoaded ? 'blur(0)' : 'blur(10px)'};
  
  ${props => props.aspectRatio && `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `}
  
  @media (max-width: 768px) {
    object-position: ${props => props.mobileObjectPosition || 'center'};
  }
`;

const PlaceholderImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => props.thumbnail ? `url(${props.thumbnail})` : 'none'};
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.05);
  opacity: ${props => props.isMainLoaded ? 0 : 0.8};
  transition: opacity 0.3s ease;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  font-size: 0.9rem;
  color: #6c757d;
  text-align: center;
  padding: 10px;
`;

const ErrorIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 5px;
`;

/**
 * ResponsiveImage component for optimized image display across different screen sizes
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for the image
 * @param {number} aspectRatio - Aspect ratio (width/height) to maintain (e.g., 16/9)
 * @param {string} objectFit - CSS object-fit property (cover, contain, fill, etc.)
 * @param {string} mobileObjectPosition - Object position for mobile screens
 * @param {string} borderRadius - Border radius value (e.g., '8px' or '50%')
 * @param {string} maxWidth - Maximum width of the image container
 * @param {string} height - Height of the image (if not using aspectRatio)
 * @param {string} srcSet - Responsive image srcset attribute
 * @param {string} sizes - Responsive image sizes attribute
 * @param {string} placeholderColor - Background color to show during loading
 * @param {string} thumbnailSrc - Small thumbnail version of the image for blur-up effect
 * @param {boolean} shadow - Whether to apply a subtle shadow
 * @param {object} imgProps - Additional props to pass to the img element
 */
const ResponsiveImage = ({
  src,
  alt,
  aspectRatio,
  objectFit = 'cover',
  mobileObjectPosition = 'center',
  borderRadius,
  maxWidth,
  height,
  srcSet,
  sizes,
  placeholderColor = '#f0f0f0',
  thumbnailSrc,
  shadow = false,
  imgProps = {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [webpSupported, setWebpSupported] = useState(null);

  // Check for WebP support on mount
  useEffect(() => {
    const checkWebpSupport = async () => {
      const webpSupport = await supportsWebp();
      setWebpSupported(webpSupport);
    };
    
    checkWebpSupport();
  }, []);

  // Helper function to check WebP support
  const supportsWebp = () => {
    return new Promise(resolve => {
      const webpImage = new Image();
      webpImage.onload = () => resolve(true);
      webpImage.onerror = () => resolve(false);
      webpImage.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    });
  };

  // Get the appropriate image source based on WebP support
  const getImageSource = () => {
    if (webpSupported === null) return src; // Still checking
    
    // If webp version is available and browser supports it
    if (webpSupported && src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg')) {
      // Try to use WebP version by replacing the extension
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }
    
    return src;
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true); // Ensure the placeholder disappears
    
    // If WebP failed, fall back to original format
    if (webpSupported && imgProps.src && imgProps.src.includes('.webp')) {
      const originalSrc = imgProps.src.replace('.webp', src.match(/\.(jpg|jpeg|png)$/i)[0]);
      imgProps.src = originalSrc;
    }
  };

  const imageSource = getImageSource();

  return (
    <ImageContainer 
      aspectRatio={aspectRatio} 
      borderRadius={borderRadius}
      maxWidth={maxWidth}
      placeholderColor={placeholderColor}
      shadow={shadow}
      role="img"
      aria-label={alt}
      {...props}
    >
      {/* Blur-up thumbnail placeholder */}
      {thumbnailSrc && !hasError && (
        <PlaceholderImage 
          thumbnail={thumbnailSrc} 
          isMainLoaded={isLoaded} 
          aria-hidden="true"
        />
      )}
      
      {!hasError ? (
        <StyledImage
          src={imageSource}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          aspectRatio={aspectRatio}
          objectFit={objectFit}
          mobileObjectPosition={mobileObjectPosition}
          height={height}
          loading="lazy"
          isLoaded={isLoaded}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...imgProps}
        />
      ) : (
        <ErrorContainer>
          <ErrorIcon aria-hidden="true">🖼️</ErrorIcon>
          <div>Image failed to load</div>
        </ErrorContainer>
      )}
    </ImageContainer>
  );
};

export default ResponsiveImage;