# Responsive UI Guide

This guide explains how to use the responsive UI components and utilities in this project to create mobile-friendly interfaces.

## Responsive CSS Classes

The `responsive.css` file provides utility classes for responsive design:

### Breakpoints

- **xs**: Extra small devices (< 576px)
- **sm**: Small devices (≥ 576px)
- **md**: Medium devices (≥ 768px)
- **lg**: Large devices (≥ 992px)
- **xl**: Extra large devices (≥ 1200px)

### Display Classes

```jsx
<div className="d-none d-md-block">Only visible on medium and larger screens</div>
<div className="d-block d-md-none">Only visible on small screens</div>
```

### Responsive Width Classes

```jsx
<div className="w-100 w-md-50">Full width on mobile, 50% width on medium screens</div>
```

### Flex Utilities

```jsx
<div className="d-flex flex-column flex-md-row">
  <div>Column on mobile, row on medium screens</div>
</div>
```

### Mobile-Specific Classes

```jsx
<div className="mobile-stack">Elements will stack on mobile</div>
<div className="mobile-hide">Hidden on mobile</div>
<div className="mobile-full-width">Full width on mobile</div>
<div className="mobile-centered">Centered content on mobile</div>
```

## Responsive Components

### ResponsiveImage

```jsx
import ResponsiveImage from '../components/ResponsiveImage';

<ResponsiveImage 
  src="/path/to/image.jpg"
  alt="Description"
  aspectRatio={16/9}
  borderRadius="8px"
  maxWidth="600px"
/>
```

### Responsive Layout Components

```jsx
import { Container, Row, Column, Section } from '../components/ResponsiveLayout';

<Section padding="60px 0" mobilePadding="30px 0">
  <Container>
    <Row>
      <Column xs={12} md={6}>
        Left column (full width on mobile, half width on medium screens)
      </Column>
      <Column xs={12} md={6}>
        Right column (full width on mobile, half width on medium screens)
      </Column>
    </Row>
  </Container>
</Section>
```

### Responsive Visibility

```jsx
import { Hidden, Visible } from '../components/ResponsiveLayout';

<Hidden xs>
  This content is hidden on extra small screens
</Hidden>

<Visible xs>
  This content is only visible on extra small screens
</Visible>
```

## Best Practices for Mobile UI

1. **Touch Targets**: Make buttons and interactive elements at least 44x44px
2. **Font Sizes**: Use relative units (rem) and ensure minimum font size of 16px
3. **Whitespace**: Increase spacing between elements on smaller screens
4. **Testing**: Test on actual devices or using browser dev tools device emulation
5. **Performance**: Optimize images and minimize unnecessary elements on mobile
6. **Simplify**: Consider simplifying complex layouts for mobile views

## Media Query Usage in Styled Components

```jsx
const MyComponent = styled.div`
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;
```
