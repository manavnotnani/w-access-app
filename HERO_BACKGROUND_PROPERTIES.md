# Hero Section Background Properties

## Background Structure
The Hero component uses a layered background approach with multiple divs for depth and visual effects.

## Background Layers

### 1. Main Section Background
```css
min-h-screen flex items-center justify-center relative overflow-hidden bg-background
```

### 2. Primary Background Gradient
```css
absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-blue-accent/10
```
- **Type**: Diagonal gradient (bottom-right direction)
- **Colors**: 
  - Start: `gold` with 10% opacity
  - Middle: `background` (base color)
  - End: `blue-accent` with 10% opacity

### 3. Radial Background Effect
```css
absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent
```
- **Type**: Radial gradient (elliptical, centered)
- **Colors**:
  - Center: `gold` with 5% opacity
  - Middle: `transparent`
  - Edge: `transparent`

## Content Container
```css
container mx-auto px-6 relative z-10
```
- **Positioning**: Relative with z-index 10 to appear above background layers
- **Spacing**: Auto margins with 6 units horizontal padding

## Content Wrapper
```css
text-center max-w-4xl mx-auto animate-fade-up
```
- **Max Width**: 4xl (896px)
- **Animation**: fade-up effect

## Key Features Background
```css
bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border
```
- **Background**: Card color with 50% opacity
- **Effect**: Backdrop blur
- **Border**: Border color with rounded-full styling

## CTA Button Backgrounds

### Primary Button
```css
bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 animate-glow-pulse
```
- **Background**: Custom gradient (gradient-hero)
- **Animation**: Glow pulse effect
- **Transition**: 300ms duration

### Secondary Button
```css
border-border bg-card/30 backdrop-blur-sm hover:bg-card/50
```
- **Background**: Card color with 30% opacity
- **Effect**: Backdrop blur
- **Hover**: Card color with 50% opacity

## CSS Custom Properties Needed
- `--gold`: Gold accent color
- `--blue-accent`: Blue accent color
- `--background`: Base background color
- `--card`: Card background color
- `--border`: Border color
- `--primary-foreground`: Primary text color
- `--muted-foreground`: Muted text color

## Animation Classes Required
- `animate-fade-up`: Content fade-in animation
- `animate-float`: Logo floating animation
- `animate-glow-pulse`: Button glow pulse animation

## Gradient Classes Required
- `bg-gradient-hero`: Custom gradient for primary button
- `bg-gradient-to-br`: Diagonal gradient utility 