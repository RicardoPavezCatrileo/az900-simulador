# Póster A2 de la arquitectura

PNG de 7025×4966 (≈ 300 dpi) y SVG autónomo de `arquitectura.html`, guardados en `docs/` (no se suben).

1. Generar la página del póster (cap. 11, modo claro, título y leyenda; fija identidad híbrida, GRS y Front Door, y pone las regiones con su color arriba a la derecha porque la fila de la leyenda de abajo no tiene espacio):
   `python tools/poster-pagina.py arquitectura.html tools/poster-arquitectura.js _poster.html`
2. PNG con Chrome headless (sin `--hide-scrollbars` salen barras de desplazamiento):
   `chrome --headless --hide-scrollbars --window-size=1372,970 --force-device-scale-factor=5.12 --screenshot=… http://localhost:8000/_poster.html`
3. SVG: `chrome --headless --dump-dom … > dom.html`, luego `python tools/poster-svg.py dom.html docs/poster-arquitectura-A2.svg`. Después quitar los atributos `fill="var(...)"` y pasar los `color(srgb r g b / a)` de los rellenos de región a `rgba()`.
4. Borrar `_poster.html`.

- Si el PNG está abierto en un visor, `cp` falla con "Permission denied"; `Copy-Item -Force` de PowerShell sí lo reemplaza.
- Último póster: 15 nov 2026 (con suscripciones Test y Desarrollo y acceso condicional vs Policy).
- Alternativa descartada por ahora, pero que gustó: archivos `.drawio` con íconos de Azure editados en VS Code (extensión Draw.io Integration).
