# HTML Snippets

This file contains reusable HTML templates for common components in your blog.

## Accordion Section Template

Use this template to create a new collapsible section in your blog:

```html
<section class="accordion-section" data-section="your-section-id">
    <h2 class="accordion-header">
        <button class="accordion-toggle" aria-expanded="false">
            <span class="accordion-icon">+</span>
            <span class="accordion-title">Your Section Title</span>
        </button>
    </h2>
    <div class="accordion-content collapsed">
        <!-- Your content goes here -->
        <p>Your content text goes here.</p>

        <h3>Subsection Title</h3>
        <p>More content for the subsection.</p>

        <!-- Add more paragraphs, lists, images, etc. -->
    </div>
</section>
```

**Important Notes:**
- Replace `your-section-id` with a unique kebab-case ID (e.g., `about-me`, `my-projects`)
- Replace `Your Section Title` with your section heading
- Set `aria-expanded="true"` and icon to `−` if you want the section open by default
- Set `aria-expanded="false"` and icon to `+` if you want the section collapsed by default
- Add `collapsed` class to `accordion-content` if starting collapsed
- Remove `collapsed` class from `accordion-content` if starting expanded

---

## Lightbox Image Wrapper Template

Use this template to add an image with lightbox functionality:

```html
<div class="lightbox-image-wrapper">
    <img src="assets/images/your-image.jpg" alt="Description of image" class="lightbox-trigger" loading="lazy">
    <p class="image-caption">Click to enlarge</p>
</div>
```

**Important Notes:**
- Replace `your-image.jpg` with your actual image filename
- Replace `Description of image` with a descriptive alt text
- Customize the caption text as needed
- The `loading="lazy"` attribute improves page load performance
- Images will automatically open in a lightbox when clicked

---

## Complete Example: Section with Lightbox Image

Here's an example combining both templates:

```html
<section class="accordion-section" data-section="my-photos">
    <h2 class="accordion-header">
        <button class="accordion-toggle" aria-expanded="false">
            <span class="accordion-icon">+</span>
            <span class="accordion-title">My Photos</span>
        </button>
    </h2>
    <div class="accordion-content collapsed">
        <div class="lightbox-image-wrapper">
            <img src="assets/images/photo1.jpg" alt="Beach sunset" class="lightbox-trigger" loading="lazy">
            <p class="image-caption">Click to enlarge</p>
        </div>

        <p>This is a beautiful sunset I captured at the beach last summer.</p>

        <h3>Photography Tips</h3>
        <p>Here are some tips for taking great sunset photos:</p>
        <ul>
            <li>Arrive early to scout locations</li>
            <li>Use a tripod for stability</li>
            <li>Shoot in RAW format for better editing</li>
        </ul>
    </div>
</section>
```

---

## Quick Reference

### Accordion States

**Expanded (open by default):**
```html
aria-expanded="true"
<span class="accordion-icon">−</span>
<div class="accordion-content">
```

**Collapsed (closed by default):**
```html
aria-expanded="false"
<span class="accordion-icon">+</span>
<div class="accordion-content collapsed">
```

### Common Image Sizes

Place images in the `assets/images/` directory. Recommended formats:
- JPEG for photos
- PNG for graphics with transparency
- WebP for modern browsers (best compression)

For web optimization, keep images under 1MB when possible.
