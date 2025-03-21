
import React from 'react';
import styled from 'styled-components';
import '../styles/responsive.css';

/**
 * Container component with responsive padding
 * Provides a centered, width-constrained container for page content
 * 
 * @param {string} maxWidth - Maximum width of the container (default: '1200px')
 * @param {string} padding - Horizontal padding on desktop (default: '20px')
 * @param {string} mobilePadding - Horizontal padding on tablet (default: '15px')
 * @param {string} smallMobilePadding - Horizontal padding on mobile (default: '10px')
 * @param {boolean} fluid - If true, container will have no max-width
 * @param {boolean} fullHeight - If true, container will have height: 100%
 */
const Container = styled.div`
  width: 100%;
  max-width: ${props => props.fluid ? '100%' : props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${props => props.padding || '20px'};
  ${props => props.fullHeight && 'height: 100%;'}
  
  @media (max-width: 768px) {
    padding: 0 ${props => props.mobilePadding || '15px'};
  }
  
  @media (max-width: 576px) {
    padding: 0 ${props => props.smallMobilePadding || '10px'};
  }
`;

/**
 * Row component with responsive gap and alignment
 * Creates a flex row with customizable gutters and alignment
 * 
 * @param {string} gutter - Horizontal gap between columns on desktop (default: '15px')
 * @param {string} mobileGutter - Horizontal gap between columns on tablet (default: '10px')
 * @param {string} smallMobileGutter - Horizontal gap between columns on mobile (default: '5px')
 * @param {boolean} noWrap - If true, flex items won't wrap to next line
 * @param {string} justifyContent - Horizontal alignment of items (start, center, end, between, around)
 * @param {string} alignItems - Vertical alignment of items (start, center, end, stretch)
 * @param {string} mobileDirection - Flex direction on mobile devices (row, column)
 * @param {string} mobileJustifyContent - Horizontal alignment on mobile
 * @param {string} smallMobileDirection - Flex direction on small mobile devices
 * @param {string} gap - Gap between child elements (uses CSS gap property where supported)
 */
const Row = styled.div`
  display: flex;
  flex-wrap: ${props => props.noWrap ? 'nowrap' : 'wrap'};
  margin: 0 -${props => props.gutter || '15px'};
  ${props => props.gap && `gap: ${props.gap};`}
  
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
    
    ${props => props.mobileGap && `
      gap: ${props.mobileGap};
    `}
  }
  
  @media (max-width: 576px) {
    margin: 0 -${props => props.smallMobileGutter || '5px'};
    
    ${props => props.smallMobileDirection && `
      flex-direction: ${props.smallMobileDirection};
    `}
    
    ${props => props.smallMobileGap && `
      gap: ${props.smallMobileGap};
    `}
    
    ${props => props.stackOnMobile && `
      flex-direction: column;
    `}
  }
  
  /* Apply utility classes for proper spacing when stacking on mobile */
  &.mobile-stack > * {
    @media (max-width: 576px) {
      width: 100%;
      margin-bottom: 15px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

/**
 * Column component with responsive widths based on a 12-column grid
 * 
 * @param {number} xs - Width (1-12) on extra small screens (<576px)
 * @param {number} sm - Width (1-12) on small screens (≥576px)
 * @param {number} md - Width (1-12) on medium screens (≥768px)
 * @param {number} lg - Width (1-12) on large screens (≥992px)
 * @param {number} xl - Width (1-12) on extra large screens (≥1200px)
 * @param {string} gutter - Horizontal padding (default: '15px')
 * @param {string} mobileGutter - Horizontal padding on tablet (default: '10px')
 * @param {string} smallMobileGutter - Horizontal padding on mobile (default: '5px')
 * @param {string} flex - Custom flex value (e.g., '1 1 auto')
 * @param {string} width - Custom width value
 * @param {string} order - Controls the order of the column
 * @param {string} mobileOrder - Controls the order on mobile devices
 */
const Column = styled.div`
  flex: ${props => props.flex || '0 0 auto'};
  width: ${props => props.width || 'auto'};
  padding: 0 ${props => props.gutter || '15px'};
  
  ${props => props.order && `
    order: ${props.order};
  `}
  
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
    
    ${props => props.mobileOrder && `
      order: ${props.mobileOrder};
    `}
  }
  
  @media (max-width: 576px) {
    padding: 0 ${props => props.smallMobileGutter || '5px'};
    
    ${props => props.smallMobileOrder && `
      order: ${props.smallMobileOrder};
    `}
  }
`;

/**
 * Section component with responsive spacing
 * Provides consistent vertical padding for page sections
 * 
 * @param {string} padding - Vertical padding on desktop (default: '40px 0')
 * @param {string} mobilePadding - Vertical padding on tablet (default: '30px 0')
 * @param {string} smallMobilePadding - Vertical padding on mobile (default: '20px 0')
 * @param {string} background - Background color or image
 * @param {boolean} fullWidth - If true, section extends to full viewport width
 */
const Section = styled.section`
  padding: ${props => props.padding || '40px 0'};
  ${props => props.background && `background: ${props.background};`}
  ${props => props.fullWidth && `
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  `}
  
  @media (max-width: 768px) {
    padding: ${props => props.mobilePadding || '30px 0'};
  }
  
  @media (max-width: 576px) {
    padding: ${props => props.smallMobilePadding || '20px 0'};
  }
`;

/**
 * Spacing component to add responsive vertical spacing
 * 
 * @param {string} height - Height on desktop (default: '20px')
 * @param {string} mobileHeight - Height on tablet (default: '15px')
 * @param {string} smallMobileHeight - Height on mobile (default: '10px')
 */
const Spacing = styled.div`
  height: ${props => props.height || '20px'};
  
  @media (max-width: 768px) {
    height: ${props => props.mobileHeight || '15px'};
  }
  
  @media (max-width: 576px) {
    height: ${props => props.smallMobileHeight || '10px'};
  }
`;

/**
 * Hidden component for responsive visibility control
 * Hides content at specified breakpoints
 * 
 * @param {boolean} xs - Hide on extra small screens (<576px)
 * @param {boolean} sm - Hide on small screens (≥576px and <768px)
 * @param {boolean} md - Hide on medium screens (≥768px and <992px)
 * @param {boolean} lg - Hide on large screens (≥992px and <1200px)
 * @param {boolean} xl - Hide on extra large screens (≥1200px)
 */
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

/**
 * Visible component for responsive visibility control
 * Shows content only at specified breakpoints
 * 
 * @param {boolean} xs - Show only on extra small screens (<576px)
 * @param {boolean} sm - Show only on small screens (≥576px and <768px)
 * @param {boolean} md - Show only on medium screens (≥768px and <992px)
 * @param {boolean} lg - Show only on large screens (≥992px and <1200px)
 * @param {boolean} xl - Show only on extra large screens (≥1200px)
 * @param {string} display - Display property when visible (default: 'block')
 */
const Visible = styled.div`
  display: none !important;
  
  ${props => props.xs && `
    @media (max-width: 575px) {
      display: ${props.display || 'block'} !important;
    }
  `}
  
  ${props => props.sm && `
    @media (min-width: 576px) and (max-width: 767px) {
      display: ${props.display || 'block'} !important;
    }
  `}
  
  ${props => props.md && `
    @media (min-width: 768px) and (max-width: 991px) {
      display: ${props.display || 'block'} !important;
    }
  `}
  
  ${props => props.lg && `
    @media (min-width: 992px) and (max-width: 1199px) {
      display: ${props.display || 'block'} !important;
    }
  `}
  
  ${props => props.xl && `
    @media (min-width: 1200px) {
      display: ${props.display || 'block'} !important;
    }
  `}
`;

/**
 * GridContainer component for modern CSS Grid layouts
 * Provides a responsive grid with customizable columns and gaps
 * 
 * @param {string} columns - Grid template columns on desktop
 * @param {string} gap - Gap between grid items on desktop
 * @param {string} mobileColumns - Grid template columns on tablet
 * @param {string} mobileGap - Gap between grid items on tablet
 * @param {string} smallMobileColumns - Grid template columns on mobile
 * @param {string} smallMobileGap - Gap between grid items on mobile
 * @param {string} rowGap - Gap between rows
 * @param {string} alignItems - Vertical alignment of grid items
 * @param {string} justifyItems - Horizontal alignment of grid items
 */
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(12, 1fr)'};
  gap: ${props => props.gap || '20px'};
  ${props => props.rowGap && `row-gap: ${props.rowGap};`}
  ${props => props.alignItems && `align-items: ${props.alignItems};`}
  ${props => props.justifyItems && `justify-items: ${props.justifyItems};`}
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => props.mobileColumns || 'repeat(6, 1fr)'};
    gap: ${props => props.mobileGap || '15px'};
  }
  
  @media (max-width: 576px) {
    grid-template-columns: ${props => props.smallMobileColumns || 'repeat(4, 1fr)'};
    gap: ${props => props.smallMobileGap || '10px'};
  }
`;

/**
 * GridItem component for positioning items within a CSS Grid
 * 
 * @param {string} colSpan - Number of columns to span on desktop
 * @param {string} rowSpan - Number of rows to span
 * @param {string} colStart - Column start position
 * @param {string} rowStart - Row start position
 * @param {string} mobileColSpan - Number of columns to span on tablet
 * @param {string} mobileColStart - Column start position on tablet
 * @param {string} smallMobileColSpan - Number of columns to span on mobile
 * @param {string} smallMobileColStart - Column start position on mobile
 */
const GridItem = styled.div`
  grid-column: ${props => props.colStart ? `${props.colStart} / span ${props.colSpan || 1}` : `span ${props.colSpan || 1}`};
  ${props => props.rowSpan && `grid-row: ${props.rowStart ? `${props.rowStart} / span ${props.rowSpan}` : `span ${props.rowSpan}`};`}
  
  @media (max-width: 768px) {
    grid-column: ${props => props.mobileColStart ? `${props.mobileColStart} / span ${props.mobileColSpan || 1}` : 
      props.mobileColSpan ? `span ${props.mobileColSpan}` : props.colStart ? `${props.colStart} / span ${props.colSpan || 1}` : `span ${props.colSpan || 1}`};
  }
  
  @media (max-width: 576px) {
    grid-column: ${props => props.smallMobileColStart ? `${props.smallMobileColStart} / span ${props.smallMobileColSpan || 1}` : 
      props.smallMobileColSpan ? `span ${props.smallMobileColSpan}` : props.mobileColStart ? `${props.mobileColStart} / span ${props.mobileColSpan || 1}` : 
      props.mobileColSpan ? `span ${props.mobileColSpan}` : props.colStart ? `${props.colStart} / span ${props.colSpan || 1}` : `span ${props.colSpan || 1}`};
  }
`;

/**
 * Card component with responsive styling
 * 
 * @param {string} padding - Padding on desktop
 * @param {string} mobilePadding - Padding on mobile
 * @param {string} borderRadius - Border radius 
 * @param {boolean} shadow - If true, adds a box shadow
 * @param {string} background - Background color
 */
const Card = styled.div`
  background: ${props => props.background || 'white'};
  border-radius: ${props => props.borderRadius || '8px'};
  padding: ${props => props.padding || '20px'};
  ${props => props.shadow && `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);`}
  
  @media (max-width: 768px) {
    padding: ${props => props.mobilePadding || '15px'};
  }
  
  @media (max-width: 576px) {
    padding: ${props => props.smallMobilePadding || '12px'};
    border-radius: ${props => props.mobileRadius || props.borderRadius || '6px'};
  }
`;

/**
 * ResponsiveGrid component provides a simpler API for common grid layouts
 * Creates a responsive grid that adjusts columns based on screen size
 * 
 * @param {string} gap - Gap between grid items (default: '20px')
 * @param {number} desktopColumns - Number of columns on desktop (default: 3)
 * @param {number} tabletColumns - Number of columns on tablet (default: 2)
 * @param {number} mobileColumns - Number of columns on mobile (default: 1)
 * @param {string} minItemWidth - Minimum width of each grid item
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Grid items
 */
const ResponsiveGridContainer = styled.div`
  display: grid;
  gap: ${props => props.gap || '20px'};
  
  /* Auto-fit responsive grid based on min-width */
  ${props => props.minItemWidth ? `
    grid-template-columns: repeat(auto-fill, minmax(${props.minItemWidth}, 1fr));
  ` : `
    grid-template-columns: repeat(${props.desktopColumns || 3}, 1fr);
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(${props.tabletColumns || 2}, 1fr);
    }
    
    @media (max-width: 576px) {
      grid-template-columns: repeat(${props.mobileColumns || 1}, 1fr);
    }
  `}
`;

const ResponsiveGrid = ({ 
  gap,
  desktopColumns,
  tabletColumns,
  mobileColumns,
  minItemWidth,
  className,
  children,
  ...props
}) => {
  return (
    <ResponsiveGridContainer
      gap={gap}
      desktopColumns={desktopColumns}
      tabletColumns={tabletColumns}
      mobileColumns={mobileColumns}
      minItemWidth={minItemWidth}
      className={className}
      {...props}
    >
      {children}
    </ResponsiveGridContainer>
  );
};

// FlexCenter - A convenience component for centering content
const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.column && 'flex-direction: column;'}
  ${props => props.fullHeight && 'height: 100%;'}
  ${props => props.gap && `gap: ${props.gap};`}
  
  @media (max-width: 768px) {
    ${props => props.mobileColumn && 'flex-direction: column;'}
    ${props => props.mobileGap && `gap: ${props.mobileGap};`}
  }
`;

// Export all components
export { 
  Container, 
  Row, 
  Column, 
  Section, 
  Spacing, 
  Hidden, 
  Visible,
  GridContainer,
  GridItem,
  Card,
  ResponsiveGrid,
  FlexCenter
};
