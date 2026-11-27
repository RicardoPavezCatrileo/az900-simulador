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

# Póster A2 de la administración

`az104/administracion.html` ("Quién administra qué y desde dónde") usa el mismo proceso, con su script y su línea de arranque:

1. `python tools/poster-pagina.py az104/administracion.html tools/poster-administracion.js az104/_poster.html "dibujar();aplicar();panelInicio();"` (la página va en `az104/` para que carguen `../assets/`).
2. PNG y SVG igual que arriba, con `http://localhost:8000/az104/_poster.html`, guardados como `docs/poster-administracion-A2.png` y `.svg`.
3. Borrar `az104/_poster.html`.

- Último póster: 24 nov 2026 (portales, tenant de Entra ID, jerarquía de recursos con IAM, bloqueo y Policy, la oficina con Entra Connect, la línea roja Entra │ RBAC y las 5 personas con su rol mínimo).

# Versión editable en draw.io (`.drawio`)

`tools/drawio-svg.js` se inyecta después del script del póster: envuelve `poster()` y convierte el póster ya dibujado en celdas de draw.io (cada pieza es un grupo con su caja, franja de color, textos y su ícono oficial de Azure de `img/lib/azure2/…`; las flechas quedan como conectores libres). Fuentes: Segoe UI y Consolas (draw.io Desktop no carga las de Google al exportar); si un texto queda más ancho que en el póster, se le achica la letra. Requiere draw.io Desktop (`winget install JGraph.Draw`).

1. `python tools/poster-pagina.py arquitectura.html tools/poster-arquitectura.js,tools/drawio-svg.js _poster.html`
2. `chrome --headless --virtual-time-budget=8000 --window-size=1372,970 --dump-dom http://localhost:8000/_poster.html > dom.html`
3. `python tools/poster-svg.py dom.html docs/arquitectura.drawio dioout`
4. Exportar con draw.io Desktop (`%LOCALAPPDATA%\Programs\draw.io\draw.io.exe`): `-x -f png -s 5 -o docs/arquitectura-drawio-A2.png docs/arquitectura.drawio` y `-x -f pdf -o docs/arquitectura-drawio.pdf docs/arquitectura.drawio`.
5. Borrar `_poster.html`.

- Para la administración, lo mismo con `az104/administracion.html`, `tools/poster-administracion.js,tools/drawio-svg.js`, `az104/_poster.html` y su línea de arranque.
- Los íconos se eligen en `ICONOS` (id de la pieza → archivo); se ponen grandes a la derecha si caben los textos, si no chicos abajo a la derecha, y si tampoco caben no se ponen (por eso las VMs no llevan).
- Último `.drawio`: 25 nov 2026 (arquitectura).

# Guía Visual Azure Storage Account (`.drawio`)

`tools/guia-storage-drawio.py` escribe el `.drawio` directamente (no sale de una página), con el diseño que el usuario dibujó (`docs/Guía visual de Azure Storage Account.png`): 1 servicios (Table, Queue, Blob con tipos y niveles, Files dentro de la cuenta; Disk afuera, como disco administrado), 2 tipos de cuenta, 3 tipos de datos y acceso, 4 tipos de disco, 5 redundancia (LRS a RA-GZRS con cilindros), niveles de acceso y errores comunes. Se corrigieron 4 errores de ese dibujo: niveles solo en Block blobs, secundaria de GZRS = LRS, NFS solo en Premium y Disk fuera de la cuenta. A2 horizontal (1684×1190), íconos de `img/lib/azure2/…`, Segoe UI y Consolas.

1. `python tools/guia-storage-drawio.py docs/guia-visual-azure-storage.drawio`
2. `draw.io.exe -x -f png -s 4 -o docs/guia-visual-azure-storage-A2.png docs/guia-visual-azure-storage.drawio` y `-x -f pdf -o docs/guia-visual-azure-storage.pdf …`

- Si se retoca a mano en draw.io, volver a correr el script lo sobrescribe: pasar los cambios al script.
- Versión 1.0: 27 nov 2026.

# Póster de la arquitectura de almacenamiento (`.drawio`)

`az900/cap07-arquitectura-storage.html` usa el mismo proceso que la administración, con `tools/poster-storage.js` (modo claro, redundancia RA-GZRS con todas las copias, y la "Regla del examen" en lugar de la instrucción "toca LRS…"). Sus íconos van en `window.ICONOS_PAGINA` del script del póster (solo cajas, no marcos); `drawio-svg.js` los usa en vez de `ICONOS` cuando existen, y convierte también los `<circle>` (los números de las secciones).

1. `python tools/poster-pagina.py az900/cap07-arquitectura-storage.html tools/poster-storage.js,tools/drawio-svg.js az900/_poster.html 'ponerModo("estudiar");'`
2. `chrome --headless --virtual-time-budget=8000 --window-size=1372,970 --dump-dom http://localhost:8000/az900/_poster.html > dom.html`
3. `python tools/poster-svg.py dom.html docs/arquitectura-storage.drawio dioout`
4. `draw.io.exe -x -f png -b 30 -s 5 -o docs/arquitectura-storage-A2.png docs/arquitectura-storage.drawio` y `-x -f pdf -b 30 -o docs/arquitectura-storage.pdf …` (`-b 30` = margen blanco; sin él, draw.io recorta al contenido).
5. Borrar `az900/_poster.html`.

- Primera versión: 27 nov 2026.
