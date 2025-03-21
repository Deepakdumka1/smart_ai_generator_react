import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  
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
`;

const StyledImage = styled.img`
  width: 100%;
  height: ${props => props.aspectRatio ? 'auto' : props.height || 'auto'};
  object-fit: ${props => props.objectFit || 'cover'};
  display: block;
  
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
  imgProps = {},
  ...props
}) => {
  return (
    <ImageContainer 
      aspectRatio={aspectRatio} 
      borderRadius={borderRadius}
      maxWidth={maxWidth}
      {...props}
    >
      <StyledImage
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        objectFit={objectFit}
        mobileObjectPosition={mobileObjectPosition}
        height={height}
        loading="lazy"
        {...imgProps}
      />
    </ImageContainer>
  );
};

export default ResponsiveImage;
