import React from 'react';
import styled from 'styled-components';

// Container component with responsive padding
const Container = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${props => props.padding || '20px'};
  
  @media (max-width: 768px) {
    padding: 0 ${props => props.mobilePadding || '15px'};
  }
  
  @media (max-width: 576px) {
    padding: 0 ${props => props.smallMobilePadding || '10px'};
  }
`;

// Row component with responsive gap
const Row = styled.div`
  display: flex;
  flex-wrap: ${props => props.noWrap ? 'nowrap' : 'wrap'};
  margin: 0 -${props => props.gutter || '15px'};
  
  ${props => props.justifyContent && `
    justify-content: ${props.justifyContent};
  `}
  
  ${props => props.alignItems && `
    align-items: ${props.alignItems};
  `}
  
  @media (max-width: 768px) {
    margin: 0 -${props => props.mobileGutter || '10px'};
    
    ${props => props.mobileDirection && `
      flex-direction: ${props.mobileDirection};
    `}
    
    ${props => props.mobileJustifyContent && `
      justify-content: ${props.mobileJustifyContent};
    `}
  }
  
  @media (max-width: 576px) {
    margin: 0 -${props => props.smallMobileGutter || '5px'};
    
    ${props => props.smallMobileDirection && `
      flex-direction: ${props.smallMobileDirection};
    `}
  }
`;

// Column component with responsive widths
const Column = styled.div`
  flex: ${props => props.flex || '0 0 auto'};
  width: ${props => props.width || 'auto'};
  padding: 0 ${props => props.gutter || '15px'};
  
  ${props => props.xs && `
    @media (min-width: 0) {
      flex: 0 0 ${(props.xs / 12) * 100}%;
      max-width: ${(props.xs / 12) * 100}%;
    }
  `}
  
  ${props => props.sm && `
    @media (min-width: 576px) {
      flex: 0 0 ${(props.sm / 12) * 100}%;
      max-width: ${(props.sm / 12) * 100}%;
    }
  `}
  
  ${props => props.md && `
    @media (min-width: 768px) {
      flex: 0 0 ${(props.md / 12) * 100}%;
      max-width: ${(props.md / 12) * 100}%;
    }
  `}
  
  ${props => props.lg && `
    @media (min-width: 992px) {
      flex: 0 0 ${(props.lg / 12) * 100}%;
      max-width: ${(props.lg / 12) * 100}%;
    }
  `}
  
  ${props => props.xl && `
    @media (min-width: 1200px) {
      flex: 0 0 ${(props.xl / 12) * 100}%;
      max-width: ${(props.xl / 12) * 100}%;
    }
  `}
  
  @media (max-width: 768px) {
    padding: 0 ${props => props.mobileGutter || '10px'};
  }
  
  @media (max-width: 576px) {
    padding: 0 ${props => props.smallMobileGutter || '5px'};
  }
`;

// Section component with responsive spacing
const Section = styled.section`
  padding: ${props => props.padding || '40px 0'};
  
  @media (max-width: 768px) {
    padding: ${props => props.mobilePadding || '30px 0'};
  }
  
  @media (max-width: 576px) {
    padding: ${props => props.smallMobilePadding || '20px 0'};
  }
`;

// Responsive spacing component
const Spacing = styled.div`
  height: ${props => props.height || '20px'};
  
  @media (max-width: 768px) {
    height: ${props => props.mobileHeight || '15px'};
  }
  
  @media (max-width: 576px) {
    height: ${props => props.smallMobileHeight || '10px'};
  }
`;

// Hidden component for responsive visibility
const Hidden = styled.div`
  ${props => props.xs && `
    @media (max-width: 575px) {
      display: none !important;
    }
  `}
  
  ${props => props.sm && `
    @media (min-width: 576px) and (max-width: 767px) {
      display: none !important;
    }
  `}
  
  ${props => props.md && `
    @media (min-width: 768px) and (max-width: 991px) {
      display: none !important;
    }
  `}
  
  ${props => props.lg && `
    @media (min-width: 992px) and (max-width: 1199px) {
      display: none !important;
    }
  `}
  
  ${props => props.xl && `
    @media (min-width: 1200px) {
      display: none !important;
    }
  `}
`;

// Visible component for responsive visibility
const Visible = styled.div`
  display: none !important;
  
  ${props => props.xs && `
    @media (max-width: 575px) {
      display: block !important;
    }
  `}
  
  ${props => props.sm && `
    @media (min-width: 576px) and (max-width: 767px) {
      display: block !important;
    }
  `}
  
  ${props => props.md && `
    @media (min-width: 768px) and (max-width: 991px) {
      display: block !important;
    }
  `}
  
  ${props => props.lg && `
    @media (min-width: 992px) and (max-width: 1199px) {
      display: block !important;
    }
  `}
  
  ${props => props.xl && `
    @media (min-width: 1200px) {
      display: block !important;
    }
  `}
`;

export { Container, Row, Column, Section, Spacing, Hidden, Visible };
