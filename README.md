# Partido Liberal Clásico Cubano — sitio v2

Sitio estático premium del **Partido Liberal Clásico Cubano (PLC)** para [plc.deto.llc](https://plc.deto.llc).

## Desarrollo

```bash
npm run build   # regenera HTML desde pages/ + partials/
npm run serve   # python3 -m http.server 8080
# o:
python3 -m http.server 8080
```

Los HTML de raíz se generan con `node build.js` a partir de:

- `partials/` — head, header, footer compartidos
- `pages/` — contenido por página (`@@meta` + cuerpo)

## Estructura

- 11 páginas HTML (`index`, ideología, estatutos, construcción, congreso, comisiones, propuestas, afiliarse, miembros, noticias, contacto)
- `css/styles.css` — design system (navy / gold / paper, Fraunces + Outfit)
- `js/main.js` — menú, FAQ, formulario de afiliación (POST `/api/afiliacion`), tabs, noticias.json
- `assets/` — logo, hero, fotos, estatutos PDF, favicon SVG
- `data/noticias.json` — feed opcional de noticias

## Contenido

Fiel a la documentación oficial del PLC (fundación Madrid 19 mayo 2026, presidenta Amelia Calzadilla, 7 principios, 6 ejecutivo + 5 colaboradores). Sin noticias inventadas.

Sitio producido por [De To'](https://deto.llc).

## Afiliación

El formulario de afiliación es nativo (sin Google Forms). Tras aceptar los principios, el usuario completa el formulario en `afiliarse.html` y el cliente envía JSON a `POST /api/afiliacion`. Ver contrato en [`API.md`](./API.md).

