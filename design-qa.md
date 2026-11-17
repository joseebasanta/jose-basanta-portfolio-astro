# Portfolio — dark layout revision

final result: passed

## Visual target and evidence

- Primary target: the two dark portfolio screenshots attached by the user in this conversation (Dann Petty for the asymmetric gallery, Ana for restrained dark surfaces and purple details).
- Supporting source capture: `/tmp/portfolio-reference-study/dann-desktop.png`, an earlier capture of the same reference portfolio. Its hero photograph and individual card content differ from the newer user screenshot, so those are not treated as fidelity requirements.
- Main implementation capture: `/tmp/portfolio-dark/desktop.png`, 2048 × 1120 pixels, matching the first user attachment's desktop dimensions; CSS viewport 2048 × 1120, deviceScaleFactor 1.
- Same-size supporting comparison: `/tmp/portfolio-dark/comparison.png`; source left and implementation right, each 1440 × 1000 CSS/pixel dimensions at density 1. No browser chrome or density conversion.
- Implementation at that comparison size: `/tmp/portfolio-dark/desktop-1440.png`.
- Responsive evidence: `/tmp/portfolio-dark/mobile-320.png` and `/tmp/portfolio-dark/mobile-390.png`.
- Interaction evidence: `/tmp/portfolio-dark/playground.png` and `/tmp/portfolio-dark/dialog.png`.
- State: dark theme, All work selected, first featured project, dialogs closed for the main comparison.

## Findings and iteration history

- [P1, resolved] Initial browser capture showed that the two new image assets were not available in the active filesystem. Generated the final assets in the active runtime, optimized them, and recaptured. The current captures show the type poster and Orbit artwork correctly, and the browser check verifies every main image has a nonzero natural width.
- No remaining actionable P0/P1/P2 findings for the requested adaptation.

## Required fidelity surfaces

- Typography: locally hosted Inter Variable retains the compact reference hierarchy: prominent name, muted biography, small project captions and widget labels. Body text and profile spacing scale at the larger reference viewport. Copy is allowed to wrap naturally at narrow widths.
- Layout and rhythm: black canvas, three independent columns with a 1:2.06:1 width ratio, approximately 24px outer margins and 27px gutters at 2048px. The center starts with a 16:9 feature and two compact supporting widgets, followed by two independently stacked project columns. The right column starts with a square poster and a framed image. The previous top navigation bar is removed; navigation now lives in the profile card. At smaller desktop sizes the right column wraps, and mobile becomes a two-column gallery with a full-width introduction and feature.
- Colors: near-black page, #191919 cards, #303032 borders, off-white headings, muted gray body text, restrained lilac controls. Dark styling includes dialogs, inputs, focus states, and backdrop. Bright project artwork is deliberately retained, consistent with the references' colorful content on dark surfaces.
- Images: existing project concepts and the JB avatar are preserved. New original raster artwork supplies the dark type poster and music concept; no imagery, biographies, client logos, locations, or employers are copied from the reference designers. Standard UI icons use Phosphor. Cards use imagery instead of CSS or SVG illustrations.
- Copy: identity remains Jose Basanta, Product Designer. Projects are explicitly labeled Concept or Experiment. Contact details remain pending real information. The new Orbit concept is sample project content, not a claim of client work.

A focused crop is not necessary for this iteration: the 1440px comparison retains readable profile text, captions, controls, borders, and widget labels; the 2048px capture separately establishes the larger reference proportions. This is a content-preserving adaptation of the references, not a pixel clone of their imagery or personal information.

## Functional checks

Verified in Chromium against the running Astro app:

- All main images loaded successfully.
- Featured selector works by click and arrow keys; selected project opens the correct dialog.
- All project cards open their corresponding previews, and Escape closes them.
- Playground filter shows exactly the two experiment cards and hides concept content; All work restores it.
- Playground-to-Variable-Type nested navigation works.
- Variable font slider changes computed weight to 850.
- Project, About, and Contact dialogs use dark surfaces; About and Contact open and close correctly.
- No horizontal overflow at 320, 390, 768, 1024, 1440, or 2048px.
- No browser console or page errors in the exercised flows.
- Browser results: `/tmp/portfolio-dark/results.json`.
- Production build: Astro checks 20 files, zero errors/warnings/hints; static build passes.
- ESLint passes.

## Acceptable differences and follow-up

- [P3] Original project artwork replaces the designers' imagery and creates different color balance while preserving the gallery structure.
- [P3] Profile length reflects Jose's current placeholder content; exact card height can be refined when his real biography arrives.
- Existing secondary routes remain separate starter pages; this revision addresses the homepage gallery and its dialogs.

## Checklist

- [x] Rework structure around the dark references.
- [x] Apply dark theme to the full main experience.
- [x] Verify generated assets and real project previews.
- [x] Test carousel, navigation, typography, and responsive behavior.
- [x] Compare rendered evidence and resolve substantive findings.
