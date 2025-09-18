# Radsport Ruderer – Static Website

Minimal static site: fullscreen slider of restored road bikes + Impressum/Datenschutz (DE).

## How to use

1. Put 5–10 JPEGs into the `images/` folder. Keep filenames `bike1.jpg … bike10.jpg` or update `index.html` accordingly.
2. Open `index.html` locally to preview.
3. Deploy to any static host (Netlify, Vercel, GitHub Pages, etc.).

### Netlify (super quick)
- Drag-and-drop this folder onto <app.netlify.com/drop>.  
- Then in **Site settings → Domain management**, add your custom domain `radsport-ruderer.de` and follow the DNS instructions at your registrar.

### Vercel
- Create a new project, pick “Other” (static).  
- Deploy. In **Settings → Domains** add `radsport-ruderer.de` and follow the DNS steps.

### GitHub Pages
- Create a repo, push this folder.  
- In **Settings → Pages**, select “Deploy from branch → main /root”.  
- Add your custom domain under **Pages → Custom domain** and set DNS at your registrar.

> For a `.de` domain, buy/register via any DENIC-accredited registrar. Point the domain’s A/AAAA/CNAME records as instructed by your hosting provider.

## Image tips
- Export 2000–2400px wide JPEGs at ~70–80% quality.
- Use descriptive `alt` text (e.g., “1987 Colnago Master in Saronni red”).
- Keep file sizes ideally under ~400 KB per image.

## No cookies / privacy
The site uses no tracking, no analytics, and no cookies. Impressum/Datenschutz is included in `impressum.html`.
