## 1. Project Identity

DO not make any action that is not explicitly asked for by the user.

* **Project Name:** FontPair AI
* **Product:** An AI-powered typography analysis and pairing tool.
* **Audience:** Professional Designers, Web Developers, and Typography Enthusiasts.
* **Emotional Goal:** To evoke the feeling of a master typographer's studio—a blend of **classic, scholarly confidence** and **cutting-edge, intelligent precision**. The user should feel empowered, enlightened, and confident in their design choices.

---

## 2. Core Narrative: The "Scroll-Story"

The user's scroll is a journey from chaos to clarity. We will restructure the page's flow to tell this story:

* **Act I: The Problem (The Chaos).**
    * **Section:** Hero
    * **Feeling:** Overwhelming, complex.
    * **Narrative:** Typography is a sea of infinite, disconnected choices ("Aa", "Bb", "Cc").
* **Act II: The Solution (The "Aha!" Moment).**
    * **Section:** Features
    * **Feeling:** Clarity, relief, power.
    * **Narrative:** An intelligent tool (FontPair AI) emerges to analyze, critique, and compare, bringing order to the chaos.
* **Act III: The Process (The Craft).**
    * **Section:** How It Works
    * **Feeling:** Simple, intuitive, effortless.
    * **Narrative:** The craft is simplified into three clear steps: Upload, Analyze, Perfect.
* **Act IV: The Power (The "Engine").**
    * **Section:** Dual AI Mode
    * **Feeling:** Flexible, in-control, professional.
    * **Narrative:** The user is given the choice of their preferred tool: the full power of the Cloud or the privacy of Local AI.
* **Act V: The Tribe (The "Who").**
    * **Section:** Target Audience
    * **Feeling:** Understood, validated.
    * **Narrative:** This tool was built *for you* (Designers, Developers, Enthusiasts).
* **Act VI: The Foundation (The "Proof").**
    * **Section:** Tech Stack
    * **Feeling:** Confident, reassured.
    * **Narrative:** This tool is built on a modern, reliable, and powerful foundation.
* **Act VII: The Invitation (The "Next Step").**
    * **Section:** Final CTA & Footer
    * **Feeling:** Motivated, inspired.
    * **Narrative:** Your journey to typography mastery begins now.

---

## 3. Design System (The "Look")

This system is already defined in `fontpair-landing.html` and **must** be used for all new components.

### Colors (from `:root`)

```css
:root {
    /* Paper Backgrounds - NO pure white */
    --paper-base: #EBE6D9;
    --paper-light: #F2EFE8;
    --paper-dark: #D4CAB6;

    /* Teal Accents */
    --teal-dark: #2D4743;
    --teal-medium: #4A6661;
    --teal-light: #C8D5D2;

    /* Text Colors */
    --text-dark: #2B2624;
    --text-light: #F2EFE8;
    --text-secondary: #6B6560;

    /* Accent/CTA */
    --accent: #E67E22;
    --accent-dark: #D47C2E;
}

## 7. Landing Page Foundations – Strategy & Structure

This document provides the foundational design and structural strategy for the Gemini CLI to build the landing page for "Font Pair AI." It is based on established typographic, color, and layout principles to ensure a professional, beautiful, and effective result.

All creative work **must** adhere to these principles.

### 7.1. Typographic Hierarchy (The "Voice")

The typography *is* the product. It must be implemented with precision to establish a clear visual hierarchy.

* **Font Selection:** Use the fonts defined in the CSS:
    * **Headings:** `var(--font-heading)` ('Space Grotesk'). This font is modern and has character, perfect for capturing attention.
    * **Body & UI:** `var(--font-body)` ('IBM Plex Sans'). This font is highly legible and provides a clean, professional, and readable experience.
* **Modular Scale:** A clear and consistent typographic scale is mandatory. The H1 ('Space Grotesk') is the largest, most impactful element. Subheadings (H2, H3) must clearly segment content, and body text ('IBM Plex Sans') must be comfortable to read.
* **Leading (Line Height):** This is critical for readability. The body text line height **must** be set to a generous 1.5–1.6 to prevent text from feeling crowded.

### 7.2. Color & Atmosphere (The "Mood")

The color palette from `fontpair-landing.html` builds trust and evokes creativity.

* **Background:** Use `var(--paper-base)` (#EBE6D9) for the main background. This "aged paper" color feels more tactile and sophisticated than pure white.
* **Primary Text & Structure:** Use `var(--teal-dark)` (#2D4743) for all primary text and main structural elements (like the footer). This color conveys stability, professionalism, and trust.
* **Accent & CTA:** Use `var(--accent)` (#E67E22) strategically. This color is **reserved** for primary calls-to-action (buttons) and key highlights. Its high contrast against the teal and paper guides the user's eye.

### 7.3. Grid, Layout & Whitespace (The "Structure")

A strong, consistent layout creates a sense of order and professionalism.

* **Grid System:** All content **must** be built on a strong grid. Use the existing `.container` class to set a `max-width` (1280px) and center the content, creating a consistent horizontal rhythm.
* **Whitespace (Negative Space):** This is the most important tool for a clean design. Use generous padding and margin between sections and elements, following the 8px-based spacing variables (`--space-1`, `--space-2`, etc.) for consistency. This gives elements room to breathe and improves organization.
* **Layout Flow:** The layout must guide the user's eye logically from the Hero section down through Features, How It Works, and the Final CTA.

### 7.4. Brand Integration (The "Identity")

The brand identity must be featured prominently and consistently.

* **Hero Logo:** The Hero section must be the "anchor" of the page. It will feature the full Font+Pair AI logo (as an SVG) as the primary visual element.
* **Favicon:** The small, abstracted icon (from `image_a36701.png`) will be used as the site's favicon.
* **Consistency:** The fonts and colors used in the logo are perfectly reflected in the landing page's CSS, reinforcing the brand identity.
