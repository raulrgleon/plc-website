# BUILD_NOTES — PLC website v2

## Qué mejora vs v1 (`/workspace/plc-website/`)

### Visual / UX
- Tipografía editorial: **Fraunces** (display) + **Outfit** (UI) en lugar de solo Inter.
- Hero cinematográfico con overlay radial dorado, grain sutil y card de presidencia con glassmorphism.
- Header sticky **translúcido** con blur, estado `is-scrolled` y CTA dorada.
- Nav móvil refinada: dropdowns expandibles, cierre al navegar, botones táctiles.
- Cards / pilares / CTA band / empty states con más whitespace, bordes y sombras premium.
- Focus rings visibles (`:focus-visible`) y skip-link; `prefers-reduced-motion` respetado.
- Favicon SVG de marca (`assets/favicon.svg`) + og/twitter meta absolutas a `plc.deto.llc`.

### Arquitectura
- Partials DRY (`partials/` + `build.js`) — nav/footer sincronizados en las 11 páginas.
- `package.json` con `npm run build` / `npm run serve`.
- Footer con crédito profesional a **De To'** → https://deto.llc.

### Contenido (sin inventar)
- Mismo corpus que v1: ideología (Hayek/Friedman/Mises), 7 principios, estatutos Art. 1–16 + PDF, 6 comisiones, propuestas Estado/Economía/Sociedad, 6 ejecutivo + 5 colaboradores con bios/fotos, afiliación con formulario nativo → `POST /api/afiliacion`, noticias vacías + `data/noticias.json`.

### Páginas
1. index.html — hero, pitch, 3 pilares, CTAs, ejecutivo, FAQ, noticias empty  
2. ideologia.html — #vision #mision #principios  
3. estatutos.html — accordion + PDF  
4. construccion.html  
5. congreso.html  
6. comisiones.html — 6  
7. primeras-propuestas.html  
8. afiliarse.html — gate principios → formulario nativo (API)  
9. miembros.html — tabs Ejecutivo / Colaboradores  
10. contacto.html — Facebook / X / Instagram  
11. noticias.html — empty + JSON hook  

Servible con `python3 -m http.server` desde la raíz del proyecto.
