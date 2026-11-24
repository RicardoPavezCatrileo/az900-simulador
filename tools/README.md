# Póster A2 de la arquitectura

PNG de 7025×4966 (≈ 300 dpi) y SVG autónomo de `arquitectura.html`, guardados en `docs/` (no se suben).

1. Generar la página del póster (cap. 11, modo claro, título y leyenda; fija identidad híbrida, GRS y las dos redes unidas por peering (`topo="hub"`; la flecha del peering lleva punta en los dos extremos), muestra Front Door y Traffic Manager, y pone las regiones con su color arriba a la derecha porque la fila de la leyenda de abajo no tiene espacio):
   `python tools/poster-pagina.py arquitectura.html tools/poster-arquitectura.js _poster.html`
2. PNG con Chrome headless (sin `--hide-scrollbars` salen barras de desplazamiento):
   `chrome --headless --hide-scrollbars --window-size=1372,970 --force-device-scale-factor=5.12 --screenshot=… http://localhost:8000/_poster.html`
3. SVG: `chrome --headless --dump-dom … > dom.html`, luego `python tools/poster-svg.py dom.html docs/poster-arquitectura-A2.svg`. Después quitar los atributos `fill="var(...)"` y pasar los `color(srgb r g b / a)` de los rellenos de región a `rgba()`.
4. Borrar `_poster.html`.

- Si el PNG está abierto en un visor, `cp` falla con "Permission denied"; `Copy-Item -Force` de PowerShell sí lo reemplaza.
- Último póster: 24 nov 2026 (con las dos redes unidas por VNet peering, rangos de red (Red 1 10.0.0.0/16, GatewaySubnet 10.0.255.0/27, oficina 192.168.0.0/16) y el recuadro "Rutas de la Red 2", Azure Arc y Front Door + Traffic Manager juntos: en la página son excluyentes, pero `poster-arquitectura.js` angosta Front Door y su PoP y pone Traffic Manager a la derecha como alternativa, con "1 · consulta DNS" y "2 · HTTPS directo").
- Alternativa descartada por ahora, pero que gustó: archivos `.drawio` con íconos de Azure editados en VS Code (extensión Draw.io Integration).
