# website

MY website: the personal academic site of Dr. Oluwasola (Sola) E. Omoju.

A plain static site: no build step and no dependencies. Open `index.html` in a browser to view it.

## Structure

```
index.html            all page content
assets/css/style.css  styles (light and dark themes)
assets/js/main.js     menu, theme toggle, publication filter/search
assets/img/           portrait
assets/Omoju-CV.pdf   CV linked from the site
.nojekyll             lets GitHub Pages serve the folder as-is
```

## Updating

- **New publication:** in `index.html`, copy an `<li class="pub">` line under the right year.
  Set `data-type` to `article`, `chapter`, `policy` or `proceedings`. Use `<a class="title" href="DOI link">`
  when there is a DOI, or `<span class="title">` to link the title to a Google Scholar search automatically.
  Update the "Publications" count in the metrics strip.
- **Citation metrics:** edit the numbers in the metrics strip and the "October 2026" note.
- **CV:** replace `assets/Omoju-CV.pdf`.

## Publishing

On GitHub Pages: push to GitHub, then go to Settings → Pages → Deploy from branch → `main` / root.
Netlify, Vercel and Cloudflare Pages also work if you drag in the folder or connect the repository.
