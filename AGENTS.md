# Xweet Wallpapers — Design System & Agent Instructions

> **Product:** Xweet Wallpapers  
> **Design direction:** Warm editorial minimalism  
> **Primary stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4  
> **Core principle:** Let the wallpapers bring the color. Keep the interface calm, useful, and beautifully restrained.

---

## 1. Product Vision

Xweet Wallpapers is a curated wallpaper discovery platform focused on premium abstract textures, minimalist compositions, soft gradients, organic forms, and thoughtfully selected desktop and mobile backgrounds.

The website should feel like a combination of an independent design publication and a modern digital product.

It must be:

- Minimal but not boring.
- Playful but not childish.
- Premium but not overly luxurious.
- Light, warm, and approachable.
- Image-first, with typography supporting the artwork.
- Distinctive enough to be recognizable as part of the Xweet brand.
- Fast, accessible, responsive, and SEO-friendly.

The visual identity should come from the combination of warm paper-like backgrounds, forest-green accents, expressive typography, sharp rectangular components, and beautiful imagery.

### Design philosophy

**Quiet interface. Expressive artwork. Thoughtful details.**

Do not make the website look like a generic AI tool, SaaS dashboard, cryptocurrency product, or dark futuristic gallery.

The interface should never compete with the wallpapers it presents.

---

## 2. Design Principles

### 2.1 Light-first design

The default theme is light. Use warm cream instead of pure white as the primary page background.

Do not implement a dark-mode-first interface. A dark theme is not required for the initial release.

### 2.2 Sharp geometry

Use square corners and crisp outlines. Buttons, cards, image containers, menus, inputs, and major layout components should generally have a `0px` border radius.

Do not introduce rounded pill buttons, bubbly cards, excessive circles, or heavily rounded containers.

Small circular indicators and genuine circular icons are acceptable when they serve a clear purpose.

### 2.3 Typography creates personality

Use a strong typographic hierarchy, generous headline sizing, concise copy, and carefully spaced metadata.

Prefer typography and composition over decorative graphics.

### 2.4 Artwork is the hero

Wallpaper images should be the primary visual focus. Keep surrounding UI neutral and unobtrusive.

Do not add decorative gradients, shadows, or colorful backgrounds behind every wallpaper card.

### 2.5 Consistency over novelty

Use reusable design tokens and components. Do not invent a different visual treatment for each page.

New components must inherit the established system rather than introducing an unrelated design language.

---

## 3. Color System

Use the following design tokens as the default source of truth.

| Token | Hex | Purpose |
|---|---|---|
| `--background` | `#F6F3E9` | Main page background |
| `--surface` | `#FCFAF4` | Elevated or alternate light surfaces |
| `--foreground` | `#252923` | Main text |
| `--primary` | `#244B38` | Primary buttons, headings and links |
| `--primary-hover` | `#193A2A` | Hover state for primary actions |
| `--primary-foreground` | `#FFFFFF` | Text on primary buttons |
| `--secondary` | `#DCE5D5` | Soft sage backgrounds |
| `--secondary-foreground` | `#244B38` | Text on sage surfaces |
| `--muted` | `#EAE7DD` | Subtle backgrounds and separators |
| `--muted-foreground` | `#62685E` | Supporting text and metadata |
| `--border` | `#D9D8C9` | Standard borders |
| `--accent` | `#858B70` | Olive accents and secondary details |
| `--destructive` | `#B42318` | Errors and destructive actions |

### Color usage rules

- Use `--background` for the overall site canvas.
- Use `--surface` sparingly for cards, dropdowns, or alternate sections.
- Use `--primary` for important actions and selected navigation states.
- Use `--foreground` for long-form text and high-contrast headings.
- Use `--muted-foreground` for metadata, timestamps, dimensions, and descriptions.
- Use `--border` for thin dividers and component boundaries.
- Use `--secondary` for subtle highlighting, selected tags, and small accent areas.
- Reserve brighter colors for actual wallpaper artwork.

Do not use pure black as the dominant interface color.

Avoid neon green, electric purple, blue-purple SaaS gradients, excessive beige-on-beige contrast, and unnecessary decorative color effects.

Always verify text contrast. If a token combination does not meet accessibility requirements, adjust the specific combination rather than reducing readability.

### Tailwind CSS v4 tokens

Define the palette in the global stylesheet using CSS variables and Tailwind v4's `@theme inline` where appropriate.

Example:

```css
:root {
  --background: #F6F3E9;
  --surface: #FCFAF4;
  --foreground: #252923;
  --primary: #244B38;
  --primary-hover: #193A2A;
  --primary-foreground: #FFFFFF;
  --secondary: #DCE5D5;
  --secondary-foreground: #244B38;
  --muted: #EAE7DD;
  --muted-foreground: #62685E;
  --border: #D9D8C9;
  --accent: #858B70;
  --destructive: #B42318;

  --radius: 0px;
}
```

Map these variables into Tailwind's theme system so components use semantic utilities instead of repeated arbitrary colors.

Do not scatter hardcoded hex values throughout JSX.

---

## 4. Typography

### Primary font: Geist Sans

Use Geist as the primary font for:

- Headings.
- Body copy.
- Navigation.
- Buttons.
- Forms.
- Search.
- Wallpaper titles.
- Descriptive content.

Load the font through `next/font` where supported by the installed Next.js version.

### Secondary font: Geist Mono

Use Geist Mono selectively for:

- Resolution labels.
- Image dimensions.
- Collection identifiers.
- Small editorial labels.
- Dates and technical metadata.
- Optional decorative numbering.

Do not use monospace typography for paragraphs or the entire interface.

### Typography scale

| Element | Desktop | Mobile | Weight |
|---|---|---|---|
| Display heading | 64–80px | 40–48px | 500–600 |
| Page heading | 40–56px | 32–40px | 500–600 |
| Section heading | 28–36px | 24–30px | 500–600 |
| Card title | 18–22px | 16–20px | 500 |
| Body | 16px | 16px | 400 |
| Supporting text | 14px | 14px | 400 |
| Metadata | 11–12px | 11–12px | 400–500 |

Use `clamp()` for fluid display typography where appropriate.

### Typography rules

- Keep headings relatively tight in line height.
- Use generous line height for body text.
- Avoid excessively bold typography.
- Use uppercase sparingly for short labels.
- Avoid long blocks of centered text.
- Prefer left-aligned editorial layouts.
- Keep hero descriptions short, ideally one or two lines.
- Use `text-wrap: balance` for prominent headings where appropriate.

The website should feel typographically intentional, not oversized everywhere.

---

## 5. Layout and Spacing

Use a consistent spacing system based on multiples of four.

| Token | Value | Typical usage |
|---|---:|---|
| `space-1` | 4px | Tiny internal gaps |
| `space-2` | 8px | Icon-to-text spacing |
| `space-3` | 12px | Compact component spacing |
| `space-4` | 16px | Standard internal spacing |
| `space-6` | 24px | Card padding and gaps |
| `space-8` | 32px | Section element spacing |
| `space-12` | 48px | Section separation |
| `space-16` | 64px | Major section separation |
| `space-24` | 96px | Large desktop sections |

### Container rules

- Use a centered content container with a maximum width around `1440px`.
- Use approximately `48–64px` horizontal padding on large desktop screens.
- Use `24–32px` horizontal padding on tablets.
- Use `16–20px` horizontal padding on mobile.
- Avoid letting text-heavy sections span the entire viewport.
- Allow wallpaper galleries to use more available width than ordinary text content.

Prefer CSS Grid and Flexbox. Do not introduce unnecessary nested containers.

### Whitespace

Whitespace is a core part of the identity.

Give major sections room to breathe, but do not create so much empty space that users must scroll excessively to discover wallpapers.

The homepage should establish the brand quickly and bring users to actual wallpaper artwork early.

---

## 6. Borders, Corners and Shadows

### Border system

- Default border: `1px solid var(--border)`.
- Strong border: `1px solid var(--primary)`.
- Standard corner radius: `0px`.
- Avoid thick decorative borders.
- Use dividers to establish hierarchy without adding unnecessary boxes.

### Shadows

The design should be predominantly flat.

Do not use large, blurred card shadows, glowing borders, glassmorphism, or floating 3D surfaces.

If a component genuinely needs elevation, use a subtle shadow only where it improves usability, such as a dropdown or floating search panel.

Prefer borders and background contrast over shadows.

---

## 7. Buttons and Interactive Components

### Primary button

- Forest-green background.
- White foreground.
- Square corners.
- Clear, concise label.
- Height around `44–48px`.
- Horizontal padding around `20–24px`.
- Medium font weight.
- Small directional icon only when useful.

Example labels:

- `Explore wallpapers`
- `Download wallpaper`
- `View collection`
- `Get full resolution`

### Secondary button

- Transparent or cream background.
- Thin border.
- Forest-green text.
- Same dimensions and corner treatment as primary buttons.

### Ghost button

- Transparent background.
- No permanent border.
- Foreground text.
- Subtle sage hover background when useful.

### Interaction states

Every interactive component must define:

- Default state.
- Hover state.
- Keyboard focus state.
- Active state.
- Disabled state.
- Loading state where applicable.

Use short transitions, approximately `150–200ms`.

Use `cursor-pointer` on genuinely clickable elements.

Never communicate state through color alone. Use appropriate labels, icons, borders, or semantic attributes.

Do not create buttons that look interactive but perform no action.

---

## 8. Navigation

Create a minimal top navigation bar.

### Desktop navigation

Left:
- Xweet Wallpapers wordmark.

Center or adjacent navigation:
- Explore.
- Collections.
- Latest.

Right:
- Search.
- Optional future favorites feature.

Do not overcrowd the navigation.

### Header styling

- Background: `var(--background)`.
- Thin bottom border when appropriate.
- Comfortable vertical padding.
- Wordmark in Geist Sans with medium weight.
- No oversized logo.
- No heavy shadows.
- No gradient background.

The header may be sticky if it improves browsing, but it must not consume excessive vertical space.

### Mobile navigation

Maintain the brand and expose the most important destinations without compressing everything into one row.

Use a compact menu or responsive navigation pattern where appropriate.

Search must remain easy to access.

---

## 9. Homepage Design

The homepage should feel like a small independent design publication.

### Section 1: Header

Display the brand, primary navigation, and search.

Keep it restrained.

### Section 2: Editorial hero

Suggested eyebrow:

`A FRESH LOOK, EVERY DAY.`

Suggested headline:

`Your screen deserves better.`

Suggested supporting copy:

`Thoughtfully crafted wallpapers for your everyday screens.`

Primary CTA:

`Explore wallpapers`

Secondary CTA:

`Today's drop`

The hero should be predominantly typography and whitespace, followed quickly by actual wallpaper artwork.

Avoid unnecessary illustrations or floating decorative UI.

### Section 3: Featured wallpaper

Present one standout wallpaper or a small featured collection.

Requirements:

- Large landscape preview.
- Sharp rectangular image frame.
- Minimal title and supporting metadata.
- Clear download or view action.
- No unnecessary text overlay on top of the artwork.

Use the artwork itself to establish the visual mood.

### Section 4: Latest wallpapers

Show recently published wallpapers in a responsive grid.

Requirements:

- Section heading.
- Optional short description.
- `View all` link.
- Consistent image ratios within the same gallery.
- Minimal metadata.
- Clear image-first hierarchy.

Display around 6–12 wallpapers depending on the layout and available content.

### Section 5: Browse by style

Use a curated set of collection links, such as:

- Abstract Textures.
- Soft Gradients.
- Warm Neutrals.
- Forest & Earth.
- Dark & Moody.
- Minimal Geometry.

Each collection should use real, relevant artwork rather than generic decorative illustrations.

### Section 6: Final discovery section

Encourage users to explore more wallpapers.

Avoid adding a large promotional banner simply to fill space.

### Section 7: Footer

Include:

- Xweet Wallpapers wordmark.
- Explore.
- Collections.
- About.
- Contact.
- Privacy policy.
- Terms.
- Copyright information.

Keep the footer compact, accessible, and consistent with the page background.

---

## 10. Explore Page

Route: `/wallpapers`

Purpose: make discovering and downloading wallpapers easy.

### Layout

- Page title and short description.
- Search input.
- Filter controls.
- Sort control.
- Responsive image grid.
- Pagination or a deliberate load-more mechanism.

### Filters

Start with useful filters rather than an overly complicated filter panel.

Recommended filters:

- Category.
- Dominant color.
- Orientation.
- Resolution.
- Newest or popular, when popularity data exists.

### Search behavior

Search should eventually support wallpaper titles, tags, collections, and relevant descriptive keywords.

Show a clear empty state when no results match.

Never fabricate search results or popularity rankings.

### Sorting

Support newest first initially.

Only expose popularity or download-count sorting when real data exists.

### Mobile

Filters should be compact and usable on small screens. A drawer or popover is acceptable when it genuinely improves the layout.

Do not squeeze every filter into the header.

---

## 11. Wallpaper Cards

Create one reusable `WallpaperCard` component.

### Image

- Use the correct image aspect ratio.
- Use `object-fit: cover` for consistent gallery crops.
- Use a low-resolution preview or optimized image where appropriate.
- Reserve image dimensions to prevent layout shifts.
- Use meaningful alt text.
- Do not force square thumbnails for landscape artwork.

### Card content

Display only relevant information:

- Wallpaper title.
- Optional collection or color label.
- Optional resolution.
- Optional favorite control when implemented.

Keep metadata understated.

### Hover behavior

On desktop, a restrained hover effect may reveal a download action or detail link.

Examples:

- Slight image scale, capped around `1.02`.
- Subtle opacity transition.
- Small action overlay with adequate contrast.

Do not combine multiple effects unnecessarily.

On touchscreens, the main action must remain discoverable without hover.

### Click behavior

Clicking the image or title should open the wallpaper detail page.

A download button should initiate the intended download or lead to a clear resolution-selection flow.

Prevent nested interactive elements from triggering conflicting actions.

---

## 12. Wallpaper Detail Page

Route: `/wallpapers/[slug]`

Each wallpaper should have its own SEO-friendly page.

### Layout

Desktop:
- Large artwork preview on the left.
- Details and actions in a right-hand column.
- Related wallpapers below.

Mobile:
- Artwork first.
- Title and details underneath.
- Prominent download action.
- Related wallpapers afterward.

### Information

Display relevant metadata:

- Wallpaper title.
- Short description.
- Resolution.
- Width and height.
- Aspect ratio.
- File format.
- Dominant color or tags.
- Collection membership.

Do not display information that has not been stored or verified.

### Download options

Provide appropriate resolutions when available, for example:

- Original resolution.
- Desktop version.
- Mobile version.

Do not show resolution options for files that do not exist.

Make the primary download action visually clear without surrounding it with multiple competing buttons.

### Related wallpapers

Show a small selection of genuinely related content based on category, tags, palette, or collection.

Do not repeat the same wallpaper unnecessarily.

### Error states

If the requested wallpaper does not exist, return an appropriate not-found page.

If the image fails to load, show a restrained fallback with a retry option where possible.

---

## 13. Collections

Route: `/collections`  
Detail route: `/collections/[slug]`

Collections should be curated rather than merely being a list of database categories.

Each collection should contain:

- A descriptive title.
- A concise introduction.
- A representative wallpaper or cover.
- A relevant gallery.
- Optional palette or style labels.

Example collections:

### Warm Neutrals
Cream, beige, taupe, soft brown, paper-like textures.

### Abstract Textures
Organic forms, grain, layered shapes, sculptural curves.

### Soft Gradients
Muted gradients, subtle lighting, smooth color transitions.

### Forest & Earth
Sage, olive, moss, stone, earthy green and brown palettes.

### Minimal Geometry
Simple shapes, clean compositions, negative space.

### Dark & Moody
A collection for users who specifically prefer darker artwork. This does not change the website's light theme.

Create collection pages that are genuinely useful and distinct. Avoid thin, duplicate pages made only to target search keywords.

---

## 14. About and Supporting Pages

### About

Explain the idea behind Xweet Wallpapers, the focus on curated visual design, and the intention to make finding beautiful backgrounds simple.

Use editorial typography and restrained layout.

### Privacy and Terms

Use readable typography, a comfortable content width, and clear heading hierarchy.

These pages should follow the same design system rather than using a different template.

### Not-found page

Provide a friendly message, a link to Explore, and a simple route back to the homepage.

Avoid overly playful error illustrations or unnecessary animations.

---

## 15. Responsive Design

Design mobile layouts intentionally rather than simply shrinking desktop components.

### Suggested gallery columns

| Viewport | Columns |
|---|---:|
| Small mobile | 1–2 |
| Large mobile | 2 |
| Tablet | 2–3 |
| Laptop | 3–4 |
| Large desktop | 4–5 |

Use CSS Grid with sensible minimum widths and breakpoints.

The exact number of columns must depend on available content width and card proportions.

### Responsive rules

- Avoid horizontal page overflow.
- Ensure headings wrap naturally.
- Keep buttons touch-friendly.
- Do not make mobile metadata illegibly small.
- Use appropriate mobile image variants when available.
- Avoid oversized hero sections on small screens.
- Keep search and navigation accessible.
- Do not rely on hover interactions for core functionality.

Test at approximately `375px`, `768px`, `1024px`, `1440px`, and wider desktop widths.

---

## 16. Motion and Micro-interactions

Motion should be restrained and purposeful.

Allowed:

- Short color transitions.
- Subtle image hover scaling.
- Smooth disclosure of filters.
- Lightweight menu transitions.
- Loading placeholders that do not distract from content.

Avoid:

- Large scroll-triggered animations.
- Parallax everywhere.
- Infinite decorative animations.
- Spring-heavy motion on ordinary controls.
- Animated backgrounds behind static artwork.
- Long intro animations before users can interact.

Respect `prefers-reduced-motion`.

The interface must remain fully usable when animation is reduced or disabled.

---

## 17. Iconography

Use `lucide-react`, which is already part of the project stack.

Prefer simple outline icons with consistent sizing and stroke weight.

Use icons for clear actions:

- Search.
- Download.
- Arrow navigation.
- Menu.
- Favorite.
- Filter.
- Close.

Do not introduce emoji as the main icon system.

Avoid adding icon libraries when Lucide already covers the requirement.

Icon-only buttons must include accessible names and visible focus states.

---

## 18. Accessibility

Accessibility is part of the design system, not an optional enhancement.

Requirements:

- Use semantic HTML.
- Provide keyboard navigation for all interactive elements.
- Provide visible focus indicators.
- Ensure adequate color contrast.
- Add descriptive alt text to meaningful images.
- Use empty alt text for genuinely decorative imagery.
- Associate form controls with labels.
- Provide clear error messages.
- Do not communicate status through color alone.
- Maintain sensible heading order.
- Support reduced motion.
- Ensure touch targets are comfortably usable.
- Keep download actions accessible to assistive technologies.

Do not remove outlines without replacing them with an equally visible focus treatment.

---

## 19. Image Presentation and Performance

Wallpaper artwork is the primary product, so image quality and loading performance are critical.

### Gallery images

- Prefer optimized WebP previews where appropriate.
- Consider AVIF when it provides worthwhile savings and browser support is suitable.
- Preserve the highest-quality available original for downloads.
- Use responsive image sizes.
- Specify intrinsic dimensions or aspect ratios.
- Lazy-load below-the-fold images.
- Prioritize the main above-the-fold visual when it is genuinely important to initial rendering.

### Image storage

Use Cloudflare R2 for image files.

Keep the image delivery domain configurable.

Store image object keys and metadata in the database instead of hardcoding permanent URLs across the UI.

Recommended asset variants:

- `original` — full-resolution downloadable image.
- `preview` — optimized gallery image.
- `mobile` — optional mobile-optimized variant.

Only expose variants that actually exist.

### Image loading states

Use a restrained background placeholder that matches the light palette.

Avoid artificial blur effects if they noticeably delay perceived loading or create visual clutter.

Prevent cumulative layout shift by reserving the expected image space.

Do not load every full-resolution original directly into the homepage gallery.

---

## 20. Reusable Component Architecture

Build the site from reusable components.

Suggested structure:

```text
app/
  layout.tsx
  page.tsx
  globals.css
  wallpapers/
    page.tsx
    [slug]/
      page.tsx
  collections/
    page.tsx
    [slug]/
      page.tsx
  about/
    page.tsx

components/
  layout/
    SiteHeader.tsx
    SiteFooter.tsx
    PageContainer.tsx

  ui/
    Button.tsx
    Input.tsx
    Badge.tsx
    Divider.tsx
    IconButton.tsx

  wallpapers/
    WallpaperCard.tsx
    WallpaperGrid.tsx
    WallpaperPreview.tsx
    WallpaperDetails.tsx
    DownloadButton.tsx
    WallpaperFilters.tsx

  collections/
    CollectionCard.tsx
    CollectionGrid.tsx

  sections/
    HeroSection.tsx
    FeaturedWallpaper.tsx
    LatestWallpapers.tsx
    FeaturedCollections.tsx

lib/
  utils.ts
  wallpapers.ts

types/
  wallpaper.ts
```

Adapt this structure to the existing repository rather than creating duplicate components or folders.

Use server components by default. Add client components only when interactivity requires them.

Do not turn entire pages into client components merely to support a search field or button.

Use TypeScript types for wallpaper and collection data.

Avoid unnecessary dependencies and premature abstractions.

---

## 21. Tailwind CSS v4 Implementation

The project uses Tailwind CSS v4.

- Use the existing CSS-first configuration approach.
- Keep global design tokens in the global stylesheet.
- Use semantic utility classes mapped to the token system.
- Avoid creating an unnecessary legacy Tailwind configuration.
- Keep component styling consistent.
- Prefer reusable primitives when the same pattern appears repeatedly.
- Avoid arbitrary values when a design token already exists.

Do not migrate the project to another styling system.

Do not introduce a component library unless explicitly requested or there is a compelling, demonstrated need.

---

## 22. Content and Copywriting

The writing style should be concise, friendly, and design-aware.

Good examples:

- "Your screen deserves better."
- "A fresh look, every day."
- "Made for the spaces between things."
- "Soft forms, quiet colors."
- "Find your next background."

Avoid generic marketing claims such as:

- "Revolutionary AI-powered platform."
- "The ultimate wallpaper experience."
- "Unleash the power of creativity."
- "The best wallpapers in the world."

Do not overuse slogans.

Keep navigation labels literal and easy to understand. Save more expressive copy for editorial sections and collection introductions.

Never claim that an image is hand-crafted, exclusive, or created using a particular process unless that claim is accurate.

---

## 23. SEO and Discoverability

The site must be designed for organic discovery from the beginning.

Requirements:

- Unique title and description for meaningful pages.
- Clean, stable, human-readable slugs.
- Canonical URLs.
- Open Graph metadata.
- Sitemap generation.
- Robots configuration.
- Semantic page structure.
- Descriptive image alt text.
- Useful collection descriptions.
- Appropriate image dimensions in metadata where supported.
- Breadcrumbs on relevant detail pages.
- Structured data only where appropriate and accurate.

Use Next.js metadata APIs.

Avoid duplicate titles, thin collection pages, keyword stuffing, and programmatically generated descriptions that provide no meaningful value.

Do not sacrifice interface quality to insert unnecessary SEO text.

---

## 24. Design Anti-patterns

Do not introduce the following without an explicit design decision:

- Dark backgrounds as the default.
- Purple-blue AI gradients.
- Glassmorphism.
- Excessive blur.
- Oversized rounded corners.
- Pill-shaped primary buttons.
- Heavy shadows on every card.
- Unnecessary gradients on UI components.
- Floating blobs and decorative 3D shapes.
- Emoji-heavy interfaces.
- Random accent colors on individual pages.
- Excessive animations.
- Dense dashboard-like layouts.
- Generic SaaS pricing-page patterns.
- Large blocks of centered marketing copy.
- Artificial ratings, download counts, or social proof.
- Placeholder buttons that do nothing.
- Repeated or fabricated wallpaper content.
- Hardcoded image URLs scattered throughout the codebase.

The site should not look like a premade landing-page template.

---

## 25. Implementation Workflow for Antigravity

When working on this project:

1. Inspect the existing repository before changing anything.
2. Read this design system and treat it as the visual source of truth.
3. Identify existing reusable components, tokens, dependencies, and route conventions.
4. Preserve working functionality and the current architecture.
5. Build reusable components before duplicating UI across pages.
6. Implement responsive behavior alongside desktop layouts.
7. Use realistic wallpaper imagery and actual content structures.
8. Avoid introducing unnecessary packages.
9. Run available type checks, linting, and production builds.
10. Fix regressions caused by the changes before considering the task complete.

When modifying an existing page, preserve its functionality unless the requested change explicitly requires otherwise.

Do not redesign unrelated pages or rewrite large portions of the application without a clear reason.

If a design decision is not explicitly specified, choose the simplest solution consistent with this document.

### Definition of done

A page or component is complete only when:

- It follows the defined color and typography system.
- It uses consistent spacing, borders, and square corners.
- It works on mobile, tablet, and desktop.
- It has meaningful loading, empty, error, and disabled states where applicable.
- Its interactive elements actually work.
- It is keyboard accessible.
- It does not introduce unnecessary dependencies.
- It does not duplicate existing reusable functionality.
- It passes the applicable project checks.

---

## 26. Final Design Standard

Every design decision should reinforce the same identity:

**Warm cream backgrounds. Forest-green accents. Geist typography. Sharp geometry. Editorial layouts. Beautiful wallpapers. Minimal, useful interactions.**

The goal is not to make every page look empty. It is to remove everything that does not help people discover, appreciate, or download a wallpaper.

When in doubt, prioritize the artwork, typography, whitespace, and usability over decoration.