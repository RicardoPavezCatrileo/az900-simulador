# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# AZ-900 Simulador — contexto del proyecto

Sitio web personal (en español) para estudiar certificaciones de Azure: **AZ-900** como base, luego AZ-104 (hecho) y más adelante DP-900 y AZ-305. Simuladores interactivos y quizzes por tema, con el avance visible en las portadas.

## Comandos
No hay build, lint ni tests: son páginas estáticas.
- Servir el sitio (necesario para el `fetch` de los JSON; con `file://` no funciona): `python -m http.server 8000` en la raíz y abrir `http://localhost:8000/az900/cap07-almacenamiento.html` (o Live Server en VS Code, puerto 5502 según `.vscode/settings.json`, que no está versionado).
- Validar un JSON de preguntas tras editarlo: `node -e "const q=require('./az900/data/preguntas-cap07.json');q.forEach((p,i)=>{const c=[].concat(p.correcta);if(!p.pregunta||!p.explicacion||c.some(x=>x<0||x>=p.opciones.length))console.log('mal',i+1)});console.log(q.length,'preguntas')"`
- Validar todos los JSON (Git Bash): `for f in az900/data/*.json az104/data/*.json; do node -e "const q=require('./$f');let m=q.filter(p=>{const c=[].concat(p.correcta);return !p.pregunta||!p.explicacion||c.some(x=>x<0||x>=p.opciones.length)}).length;console.log('$f',q.length,m?'MAL '+m:'')"; done`
- Captura para revisar una página: `chrome --headless --user-data-dir=<carpeta-limpia> --window-size=1280,2000 --screenshot=out.png http://localhost:8000/<ruta>`. Usar un `--user-data-dir` distinto por prueba (si se reutiliza, Chrome sirve CSS o copias anteriores desde la caché). Chrome headless no baja de ~500 px de ancho.
- Probar un estado distinto al inicial: copiar la página a `_prueba.html` cambiando las variables `let …` iniciales, capturar y borrar la copia.
- Póster A2 de la arquitectura: ver `tools/README.md`.

## Decisiones tomadas
- Solo HTML + CSS + JavaScript, sin build ni frameworks. El foco es estudiar Azure, no desarrollo web.
- Progreso en `localStorage` (lecturas/escrituras siempre en try/catch).
- Preguntas en JSON separados por tema (`data/preguntas-<id>.json`), nunca dentro del HTML.
- Publicación futura: Azure Static Web Apps (plan gratuito) conectado a GitHub. Opcional: pruebas con Playwright + Python.

## Arquitectura
- Cada página es autocontenida: el simulador (datos + lógica + `<style>` propio) vive en su HTML; solo comparten `assets/`. Lo reutilizable va a `assets/estilos.css` (tokens claro/oscuro, controles, tablas, quiz, barras, portadas).
- `assets/progreso.js` es la fuente de verdad de qué temas existen: `CAPITULOS` (AZ-900), `AZ104` (cada tema con `pdf` = páginas y `base` = capítulos de AZ-900 a repasar), `CERTS` (con `carpeta`) y el flag `listo`. También define el objeto `Progreso`: `leer/guardar/borrar/porcentaje(id, cert="az900")` y `porcentajeCert(cert)`.
- `assets/portada.js`: `portadaCert("az900"|"az104")` arma las tarjetas de temas con su avance a partir de esas listas.
- `assets/quiz.js`: `iniciarQuiz("capXX")` o `iniciarQuiz("<tema>","az104")` carga `data/preguntas-<id>.json` **relativo a la página** (cada certificación tiene su carpeta `data/`) y guarda el avance.
- `assets/udemy.js`: tabla de puntajes de simulacros externos (arreglo `UDEMY` = [examen, 1.ª vuelta, 2.ª vuelta], `null` = pendiente) en cada `<section class="udemy">`. Cuando el usuario informe un puntaje nuevo, actualizar `UDEMY`.
- Avance: clave `<cert>:progreso:<id>` (p. ej. `az900:progreso:cap07`) con `{respuestas, total, mejor}`; el % es `mejor/total`. Si cambia la cantidad de preguntas del JSON se descartan las respuestas y se conserva `mejor`.
- Las páginas dentro de `az900/` y `az104/` usan `../assets/…`, `../mapa.html` y `../arquitectura.html`.
- `docs/` (PDFs e imágenes de los cursos) está en `.gitignore`: nunca se sube.

### Agregar contenido
- **Pregunta:** editar solo el JSON. Formato `{"pregunta","opciones":[...],"correcta":<índice>,"explicacion"}`; selección múltiple ("Selecciona TODAS") con `"correcta":[<índices>]` (correcta solo si coincide exactamente). El simulacro de AZ-900 la toma sola.
- **Capítulo o tema:** la página carga `estilos.css`, `progreso.js` y `quiz.js`, tiene `<div id="score">` y `<div id="quiz">` y llama a `iniciarQuiz(...)`. Al publicarlo, marcar `listo:true` en `CAPITULOS` o `AZ104`.
- **Certificación nueva:** lista de temas en `progreso.js`, `carpeta` en `CERTS` y `<carpeta>/index.html` con `portadaCert("<id>")`.

### Flujo al fallar una pregunta de un simulacro externo
1. Agregarla al JSON del capítulo que corresponde, con su redacción, la explicación breve y la trampa (si viene con solo dos opciones, sumar distractores plausibles).
2. Si deja una regla nueva, sumar su fila al arreglo `D` de `az900/dudas.html` ("si la pregunta dice…" → respuesta → trampa).
3. Si el tema no está en el PDF, decirlo en la explicación ("No está en el PDF; sí en Microsoft Learn").

## Convenciones
- **Saltos de línea mezclados** (unos archivos CRLF, otros LF; `core.autocrlf=false`, sin `.gitattributes`): conservar el de cada archivo. `sed -i` de Git Bash pasa CRLF a LF y el diff se vuelve el archivo entero. Editar con la herramienta Edit o con Python (`newline=''`), ver el de un archivo con `git ls-files --eol <ruta>` y revisar `git diff --stat` antes del commit.
- `seg()` pone `data-k` en cada botón; en un `.seg.fail` la opción con clave `none` se pinta azul (no roja).
- El quiz muestra opciones en lista con letra a), b)… (`.opts.lista`); el `.opts` simple lo usa el juego de clasificar controles del cap09.
- `.ctl label.chk` evita que las casillas dentro de un `.ctl` salgan en mayúsculas.
- Nombres actuales: "Microsoft Entra ID (antes Azure Active Directory)", Entra Domain Services (el PDF dice Azure AD DS), Microsoft Sentinel. Azure Blueprints se marca como retirado (julio 2026).
- Lo que no venga del PDF del curso se marca "No está en el PDF" (y, si aplica, "sí en Microsoft Learn").
- Al terminar cada avance: commit y push a `origin` (rama `main`).

## Fuentes: los PDFs del curso (en `docs/`)
Las diapositivas son casi todo imágenes: `pdftotext` saca poco. Renderizar páginas a PNG con PyMuPDF en un venv temporal y abrir las imágenes. Las preguntas de cada tema deben basarse en su PDF.

**AZ-900** ("Microsoft-Azure-Fundamentals-AZ-900-v7.pdf", 282 págs.):
cap02 Cloud 9–29 · cap03 Arquitectura 30–47 · cap04 Herramientas 48–58 · cap05 Computación 59–100 (App Service 86, Virtual Desktop 96) · cap06 Redes 101–121 (VPN Gateway 112–114, ExpressRoute 120) · cap07 Almacenamiento 122–167 (migración ~150–167) · cap08 Autenticación 168–197 (híbrida 173) · cap09 Seguridad 198–216 · cap10 Monitorización y gestión 217–247 · cap11 Precios 248–270 · examen 271–282.

**AZ-104** ("Microsoft-Azure-Administrator-Associate-v2.pdf", 214 págs., mismo autor; ~60% repite AZ-900, así que las páginas de AZ-104 solo agregan lo nuevo):
Identidades y gobierno 25–81 (Entra ID 41–70, licencias 48–54, RBAC 71–81) · Almacenamiento 82–112 (solo Archive 91–92 es nuevo) · Cómputo 113–155 (Bastion 128–130, ARM/Bicep 131–135, Container Apps 152) · Redes 156–189 (DNS 183–189) · Monitoreo y backup 190–202 (Backup solo 201–202) · Herramientas 14–24 (lo nuevo: Bash 20–22) · Examen 203–209 (las Associate caducan cada año; renovación gratis en Learn).

### Errores conocidos que NO se deben copiar
- PDFs: una /24 tiene **251** IPs asignables en Azure (no 256); la terminación SSL es de Application Gateway, no de Load Balancer; la reserva de capacidad no es un descuento (eso son reservadas y planes de ahorro); el tráfico entre regiones sí se cobra.
- Guía visual de Storage (`docs/`): la secundaria de GZRS es **LRS** (no ZRS); los discos administrados son un recurso aparte, no parte de la Storage Account; los niveles de acceso aplican solo a block blobs.
- Guías de gobernanza (fuera del repo): Blueprints no está vigente; faltan bloqueos, que las etiquetas no se heredan, prioridad/reglas por defecto del NSG y "los dos NSG deben permitir"; roles de Entra ID ≠ roles de Azure RBAC; GRS tiene primaria LRS; no se admite NSG en la GatewaySubnet.

## Páginas (qué hay y dónde tocar)
Cada página tiene su quiz con el JSON del mismo id. El detalle de cada pregunta está en su JSON; aquí solo lo que cuesta descubrir leyendo el código.

### Raíz (compartidas)
- `index.html`: elegir certificación con su avance, tabla Udemy y "Herramientas de repaso" (mapa, arquitectura, peering, gobierno, dudas).
- `mapa.html`: mapa conceptual SVG. Datos en el script: `N` (nodos: id, nombre, área 0–5, capítulo, descripción), `E` (aristas con relación), `ESC` (escenarios: nodos, aristas y pasos) y `VS` (comparaciones de confusiones típicas, numeradas por área: 2.4 = Red, cuarta). Al agregar contenido, validar con node que toda arista y escenario use ids existentes y que las aristas de `ESC` estén en `E`.
- `arquitectura.html`: diagrama de una web de 3 niveles en Brazil South (3 zonas) con Front Door/Traffic Manager, oficina por VPN/ExpressRoute, identidad híbrida y Storage. Datos: `EL` (elementos con coordenadas fijas en viewBox 1240×860; `cap`, `q` qué es, `p` por qué está, `pg` páginas), `AR` (flechas; `f` = color de flujo, `l11` = etiqueta de precio desde el cap. 11), `FLUJOS` (recorridos; ids deben existir en `EL`/`AR`). "Construir hasta el capítulo N" muestra `cap ≤ N`. `excluido()` oculta piezas de opciones no elegidas (incluye `SOLO_IAC`: repo y pipeline solo durante el recorrido IaC). Selectores guardados en `localStorage` (`az900:arquitectura:cap|red|ident|entrada`): redundancia, identidad (`ID_FLUJO`, `panelIdent()`) y entrada global (`idsFlujo`/`pasosFlujo`). `ajustar` comprime textos que no caben.
- `MAPA_MENTAL.html`: markmap exportado de `az900/mapa-mental-az900.md` (no enlazado).

### AZ-900 (`az900/`)
- `cap02`–`cap11`: un simulador o más por capítulo (responsabilidad compartida y capacidad; despliegue y jerarquía; una tarea en 7 herramientas y Advisor; compra de VMs, escalado, servicios y AKS; espacio de direcciones, NSG, conexión híbrida y balanceo; redundancia de Storage, niveles, discos y migración; MFA, acceso condicional y servicios de identidad; defensa en profundidad y endpoints; RBAC + locks, Policy y herramientas de monitoreo; tráfico, presupuestos, herramientas de costos y "el día del examen").
- `peering.html` (laboratorio de conectividad en 3 tramos: fuera de Azure → VNet, VNet ↔ VNet, VNet → PaaS): `ruta(x,y)`, `alStorage(x)`, `info(k)`, `RETOS` (`tr`, `ini`, `ok()`, `sol`) y `PISTAS`. Quiz `iniciarQuiz("peering")`; no cuenta en el avance ni entra al simulacro.
- `gobierno.html` (laboratorio Contoso de gobierno y seguridad): SVG 1200×722 con `FR`/`ND`/`PL` y tres modos (`modo`): `lente` (`LENTES`/`TXT_L`), `gest` (`evalGest()`: Entra ID → RBAC → Policy → bloqueo; `PERS`, `asig`, `ACC`) y `red` (`evalRed()`, `FLUJOS`). Quiz `iniciarQuiz("gobierno")`; no cuenta en el avance ni entra al simulacro.
- `cuentas-storage.html` (laboratorio del cap07: servicio → tipo de cuenta): SVG 1240×690 en matriz (filas `FILAS` = servicio; columnas Standard GPv2 / Premium / discos administrados). `INFO` (fichas), `REL` (qué resaltar), `CUENTA`/`NODO` (pieza ↔ cuenta), `ESC` (escenarios del modo práctica) y `FACTS` (selector tipo portal Standard/Premium). Sin quiz ni avance.
- `simulacroAZ900.html`: carga los JSON de cap02–cap11 (no los laboratorios) y arma 20/40/50/60 preguntas según los dominios oficiales (Conceptos 25–30% = cap02; Arquitectura 35–40% = cap03, 05–09; Gestión 30–35% = cap04, 10, 11); `reparto()` da el sobrante a Arquitectura. Puntaje 1000 × aciertos / total, aprueba con 700. `localStorage`: `az900:simulacro:actual` y `az900:simulacro:historial` (últimos 30).
- `dudas.html`: tablas "si la pregunta dice… → respuesta → trampa" por capa (arreglo `D`, buscador sin tildes), método en 3 pasos, escalera "¿qué falla?" y mapa SVG de los 4 casos de identidad.

### AZ-104 (`az104/`)
Una página por dominio oficial, con quiz `iniciarQuiz("<id>","az104")`. El id no siempre es el nombre del archivo: `identidad-gobierno.html` → `identidad`, `monitoreo-backup.html` → `monitoreo` (JSON `preguntas-identidad.json` / `preguntas-monitoreo.json`); `almacenamiento`, `computo` y `redes` coinciden. Mucho de lo que simulan (SAS, ciclo de vida, protección de datos, Bicep, Backup/Site Recovery) no está en el PDF y va marcado.

## Conceptos clave ya fijados (para redactar preguntas)
- **Storage:** LRS (3 copias, 1 centro de datos, 11 nueves), ZRS (3 zonas, 12 nueves), GRS = LRS + LRS secundaria (6 copias, 16 nueves), GZRS = ZRS + LRS secundaria; RA- permite leer la secundaria (endpoint `-secondary`); replicación geo asíncrona. Brazil South → South Central US, no recíproco (South Central US → North Central US).
- **Balanceo:** Application Gateway = regional, capa 7, WAF. Traffic Manager = global, solo DNS (no hace proxy). Front Door = global, capa 7, WAF, CDN.

## Repositorio
Rama `main`, remoto `origin` = https://github.com/RicardoPavezCatrileo/az900-simulador (la URL lleva `RicardoPavezCatrileo@` para que Windows use esa sesión y no la de rpavez2026-debug). El remoto `antiguo` (rpavez2026-debug) es solo de respaldo.

Ideas a futuro: catálogo único de servicios con un texto por nivel (qué es / cómo se configura / cuándo elegirlo) y filtro por certificación en el mapa y la arquitectura.
