// ===================================
// Accordion Functionality
// ===================================

/**
 * Expands a specific accordion section and collapses all others
 * @param {string} sectionId - The data-section value of the section to expand
 */
function expandSection(sectionId) {
    const sections = document.querySelectorAll('.accordion-section');

    sections.forEach(section => {
        const content = section.querySelector('.accordion-content');
        const button = section.querySelector('.accordion-toggle');
        const icon = section.querySelector('.accordion-icon');

        if (section.dataset.section === sectionId) {
            // Expand this section
            content.classList.remove('collapsed');
            button.setAttribute('aria-expanded', 'true');
            icon.textContent = '−';
        } else {
            // Collapse other sections
            content.classList.add('collapsed');
            button.setAttribute('aria-expanded', 'false');
            icon.textContent = '+';
        }
    });
}

/**
 * Toggle a specific accordion section
 * @param {HTMLElement} section - The section element to toggle
 */
function toggleSection(section) {
    const content = section.querySelector('.accordion-content');
    const button = section.querySelector('.accordion-toggle');
    const icon = section.querySelector('.accordion-icon');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
        // Collapse this section
        content.classList.add('collapsed');
        button.setAttribute('aria-expanded', 'false');
        icon.textContent = '+';
    } else {
        // Expand this section and collapse all others
        expandSection(section.dataset.section);
    }
}

/**
 * Setup accordion click handlers
 */
function setupAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-toggle');

    accordionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const section = button.closest('.accordion-section');
            toggleSection(section);
        });
    });
}

// ===================================
// Table of Contents Generator
// ===================================

/**
 * Generates table of contents from headings in the main content
 */
function generateTableOfContents() {
    const content = document.querySelector('.content article');
    const toc = document.getElementById('table-of-contents');

    if (!content || !toc) return;

    // Find all accordion sections
    const sections = content.querySelectorAll('.accordion-section');

    if (sections.length === 0) return;

    // Clear existing TOC
    toc.innerHTML = '';

    // Create TOC structure
    const tocList = document.createElement('ul');

    sections.forEach((section) => {
        const sectionId = section.dataset.section;
        const title = section.querySelector('.accordion-title');

        if (!title) return;

        // Create list item for main section
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = `#${sectionId}`;
        link.textContent = title.textContent;
        link.className = 'toc-h2';
        link.dataset.section = sectionId;

        // Add click handler - expand section and scroll
        link.addEventListener('click', (e) => {
            e.preventDefault();
            expandSection(sectionId);
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            // Update URL without jumping
            history.pushState(null, null, `#${sectionId}`);
        });

        listItem.appendChild(link);
        tocList.appendChild(listItem);

        // Find h3 headings within this section
        const subheadings = section.querySelectorAll('h3');
        if (subheadings.length > 0) {
            const subList = document.createElement('ul');

            subheadings.forEach((h3, index) => {
                if (!h3.id) {
                    h3.id = `${sectionId}-h3-${index}`;
                }

                const subItem = document.createElement('li');
                const subLink = document.createElement('a');

                subLink.href = `#${h3.id}`;
                subLink.textContent = h3.textContent;
                subLink.className = 'toc-h3';
                subLink.dataset.section = sectionId;

                // Add click handler - expand section and scroll to subheading
                subLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    expandSection(sectionId);
                    setTimeout(() => {
                        h3.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                    // Update URL without jumping
                    history.pushState(null, null, `#${h3.id}`);
                });

                subItem.appendChild(subLink);
                subList.appendChild(subItem);
            });

            listItem.appendChild(subList);
        }
    });

    toc.appendChild(tocList);
}

// ===================================
// Active Section Highlighting
// ===================================

/**
 * Updates the active link in TOC based on which sub-sections are visible in viewport
 */
function updateActiveSection() {
    const tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length === 0) return;

    // Get viewport boundaries
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;

    // Clear all active states first
    tocLinks.forEach(link => link.classList.remove('active'));

    // Find all h3 headings and determine sub-section boundaries
    const allHeadings = Array.from(document.querySelectorAll('.accordion-content h3'));
    const visibleHeadingIds = new Set();

    allHeadings.forEach((heading, index) => {
        // Sub-section starts at this h3
        const sectionTop = window.scrollY + heading.getBoundingClientRect().top;

        // Sub-section ends at the next h3, or at the end of the accordion content
        let sectionBottom;
        if (index + 1 < allHeadings.length && heading.closest('.accordion-content') === allHeadings[index + 1].closest('.accordion-content')) {
            sectionBottom = window.scrollY + allHeadings[index + 1].getBoundingClientRect().top;
        } else {
            const accordionContent = heading.closest('.accordion-content');
            const rect = accordionContent.getBoundingClientRect();
            sectionBottom = window.scrollY + rect.bottom;
        }

        // Check if any part of the sub-section is visible in the viewport
        if (sectionBottom >= viewportTop && sectionTop <= viewportBottom) {
            visibleHeadingIds.add(heading.id);
        }
    });

    // Highlight TOC links for visible sub-sections
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            if (visibleHeadingIds.has(targetId)) {
                link.classList.add('active');
            }
        }
    });
}

// ===================================
// Throttle Function for Performance
// ===================================

/**
 * Throttles function execution for better performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Mobile Navigation Toggle
// ===================================

/**
 * Adds mobile navigation toggle functionality
 */
function setupMobileNav() {
    const sidebar = document.querySelector('.sidebar');
    const toc = document.getElementById('table-of-contents');
    const header = document.querySelector('.sidebar-header');

    if (!sidebar || !toc || !header) return;

    // Only add toggle for mobile screens
    if (window.innerWidth <= 768) {
        // Check if toggle button already exists
        if (!header.querySelector('.mobile-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-toggle';
            toggleBtn.textContent = '☰ Menu';
            toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');

            // Add some inline styles for the button
            toggleBtn.style.cssText = `
                display: block;
                width: 100%;
                padding: 0.5rem 1rem;
                margin-top: 1rem;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
            `;

            toggleBtn.addEventListener('click', () => {
                toc.classList.toggle('mobile-open');
                toggleBtn.textContent = toc.classList.contains('mobile-open') ? '✕ Close' : '☰ Menu';
            });

            header.appendChild(toggleBtn);
        }
    }
}

// ===================================
// Lightbox Functionality
// ===================================

/**
 * Opens the lightbox with the specified image
 * @param {string} imageSrc - The source URL of the image
 * @param {string} imageAlt - The alt text for the image
 * @param {string} caption - The caption text to display
 */
function openLightbox(imageSrc, imageAlt, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;

    if (caption) {
        lightboxCaption.textContent = caption;
        lightboxCaption.style.display = 'block';
    } else {
        lightboxCaption.style.display = 'none';
    }

    // Small delay to ensure transition works
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    // Re-enable body scroll
    document.body.style.overflow = '';
}

/**
 * Setup lightbox click handlers
 */
function setupLightbox() {
    // Setup triggers for all lightbox images
    const triggers = document.querySelectorAll('.lightbox-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();

            // Find the caption in the same wrapper
            const wrapper = trigger.closest('.lightbox-image-wrapper');
            const caption = wrapper ? wrapper.querySelector('.image-caption')?.textContent : '';

            openLightbox(trigger.src, trigger.alt, caption);
        });
    });

    // Setup lightbox overlay click to close
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            // Close if clicking the overlay itself (not the image or caption)
            if (e.target === lightbox ||
                e.target.classList.contains('lightbox-close') ||
                e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
}

// ===================================
// Scroll to Top Button
// ===================================

/**
 * Shows or hides the scroll to top button based on scroll position
 */
function updateScrollToTopButton() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    // Show button after scrolling down 300px
    if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
}

/**
 * Scrolls the page to the top smoothly
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Setup scroll to top button
 */
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    scrollBtn.addEventListener('click', scrollToTop);
}

// ===================================
// Initialization
// ===================================

// Generate TOC and setup features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupAccordion();
    generateTableOfContents();
    updateActiveSection();
    setupMobileNav();
    setupScrollToTop();
    setupLightbox();

    // Update active section and scroll button on scroll (throttled for performance)
    window.addEventListener('scroll', throttle(() => {
        updateActiveSection();
        updateScrollToTopButton();
    }, 100));

    // Re-setup mobile nav on resize
    window.addEventListener('resize', throttle(() => {
        setupMobileNav();
    }, 250));

    // Handle initial hash in URL
    if (window.location.hash) {
        setTimeout(() => {
            const hash = window.location.hash.substring(1);
            // Check if it's a section ID
            const section = document.querySelector(`[data-section="${hash}"]`);
            if (section) {
                expandSection(hash);
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                // It might be a sub-heading
                const target = document.getElementById(hash);
                if (target) {
                    const parentSection = target.closest('.accordion-section');
                    if (parentSection) {
                        expandSection(parentSection.dataset.section);
                        setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                }
            }
        }, 100);
    }
});
