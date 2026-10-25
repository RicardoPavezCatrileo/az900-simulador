# AZ-900 Simulador — contexto del proyecto

## Objetivo
Sitio web personal para estudiar el examen **AZ-900 (Microsoft Azure Fundamentals)** con simuladores interactivos y quizzes por capítulo, y ver rápidamente qué temas tengo cubiertos.

## Decisiones tomadas
- **Tecnología:** solo HTML + CSS + JavaScript (sin Python, sin Next.js, sin build). Mantener el foco en estudiar Azure, no en desarrollo web.
- **Progreso:** se guarda en el navegador con `localStorage` (envolver lecturas/escrituras en try/catch).
- **Preguntas:** en archivos JSON separados por capítulo (`data/preguntas-capXX.json`), no dentro del HTML.
- **Desarrollo local:** VS Code + extensión Live Server.
- **Publicación futura:** Azure Static Web Apps (plan gratuito) conectado a GitHub, como práctica real de Azure.
- **Opcional más adelante:** pruebas automatizadas con Playwright + Python (que cada quiz cargue y el puntaje se guarde).
- **Idioma del sitio:** español.

## Estructura objetivo
```
az900-simulador/
├── CLAUDE.md
├── index.html                  ← portada: 10 capítulos con % de avance
├── cap02-cloud.html
├── cap03-arquitectura.html
├── cap04-herramientas.html
├── cap05-computacion.html
├── cap06-redes.html
├── cap07-almacenamiento.html   ← YA EXISTE (simulador de redundancia)
├── cap08-identidad.html
├── cap09-seguridad.html
├── cap10-monitorizacion.html
├── cap11-precios.html
├── assets/
│   ├── estilos.css             ← diseño compartido (tokens claro/oscuro, controles, tablas, quiz, barras)
│   ├── progreso.js             ← lista CAPITULOS + objeto Progreso (localStorage)
│   └── quiz.js                 ← iniciarQuiz("capXX"): carga el JSON, pinta el quiz y guarda el avance
└── data/
    └── preguntas-capXX.json
```

## Cómo se arma un capítulo
- La página carga `assets/estilos.css`, luego `assets/progreso.js` y `assets/quiz.js`, y llama a `iniciarQuiz("capXX")`. Debe tener `<div id="score">` y `<div id="quiz">`.
- Los estilos propios del simulador van en un `<style>` dentro de la página; lo reutilizable va a `estilos.css`.
- Formato de pregunta en JSON: `{"pregunta","opciones":[...],"correcta":<índice>,"explicacion"}`.
- Al publicar un capítulo nuevo, marcar `listo:true` en `CAPITULOS` (`progreso.js`) para que la portada lo enlace.
- Avance guardado en la clave `az900:progreso:capXX` como `{respuestas, total, mejor}`; el % de la portada es `mejor/total`. Si cambia la cantidad de preguntas del JSON, las respuestas guardadas se descartan (se conserva `mejor`).
- `fetch` del JSON no funciona abriendo el archivo con doble clic (`file://`): usar Live Server.

## Capítulos del curso (PDF "Microsoft-Azure-Fundamentals-AZ-900-v7.pdf", 282 páginas)
2. Cloud computing
3. Arquitectura y servicios
4. Fundamentos de herramientas
5. Computación
6. Redes
7. Almacenamiento
8. Autenticación y autorización
9. Seguridad
10. Monitorización y gestión
11. Precios

Las preguntas de cada capítulo deben basarse en el contenido de ese PDF (copiarlo a la carpeta `docs/`, sin subirlo a GitHub: agregar `docs/` al `.gitignore`).

## Lo que ya existe: cap07-almacenamiento.html
Simulador de redundancia de Azure Storage:
- Botones para elegir LRS, ZRS, GRS, RA-GRS, GZRS, RA-GZRS.
- Botones para simular falla: disco/rack, caída de Zona 1, caída de región Brazil South.
- Mapa: Brazil South (primaria, 3 zonas) y South Central US (secundaria emparejada).
- Estado resultante (lectura/escritura OK, solo lectura en secundaria, sin acceso hasta failover, sin acceso/pérdida).
- Tabla comparativa y 5 preguntas tipo examen.
Ya adaptado a la estructura compartida (CSS común en `assets/`, preguntas en `data/preguntas-cap07.json`, puntaje conectado).
Enriquecido con `docs/Guía visual de Azure Storage Account.png` (imagen local, no se sube): secciones de servicios (Blob/Files/Queue/Table/Disks + tipos de blob), niveles de acceso de Blob (Hot/Cool/Cold/Archive con retención mínima 0/30/90/180 días y cargo por eliminación anticipada), tipos de disco (HDD/SSD estándar/SSD premium/Ultra) y 16 preguntas.
Errores de esa guía que NO se deben copiar: dice que la secundaria de GZRS es ZRS (es LRS); pone Azure Disks dentro de la Storage Account (los discos administrados son un recurso aparte); dice que los niveles de acceso aplican a append blobs (solo block blobs).

## Lo que ya existe: cap02-cloud.html (PDF págs. 9–29)
- Simulador de responsabilidad compartida: Local/IaaS/PaaS/SaaS sobre 10 capas (cliente / compartida / Microsoft) + tabla comparativa.
- Simulador de capacidad: centro de datos propio (servidores fijos, slider) vs cloud (capacidad = demanda +10%), gráfico SVG mensual con demanda atendida, sin atender y capacidad ociosa.
- Tarjetas de conceptos (despliegue, 5 características, 6 ventajas, pilares, precios, IaaS/PaaS/SaaS) y 15 preguntas en `data/preguntas-cap02.json`.

## Lo que ya existe: cap03-arquitectura.html (PDF págs. 30–47)
- Simulador de despliegue (ejemplo Londres/Mumbai del curso): 1 centro de datos / 2 centros de datos / 2 regiones × evento (falla de centro de datos, caída de región) × ubicación del usuario → disponibilidad y latencia, con los 3 desafíos del curso marcados como resueltos o no.
- Simulador de jerarquía: árbol grupo de administración → suscripción → grupo de recursos → recurso; asignar política o rol muestra la herencia hacia abajo; eliminar un grupo de recursos borra su contenido.
- Tarjetas (regiones, emparejadas, soberanas, zonas, PoP, servicios globales vs regionales) y 16 preguntas en `data/preguntas-cap03.json`.
- El curso nombra "Azure Active Directory"; en el sitio se usa "Microsoft Entra ID (antes Azure Active Directory)".

## Lo que ya existe: cap04-herramientas.html (PDF págs. 48–58)
- "Una tarea, siete herramientas": crear una VM en Portal (pasos), CLI (`az`), PowerShell (`New-AzVM`), Cloud Shell, plantilla ARM (JSON + `az deployment group create`), Mobile App y Advisor, con ficha de tipo/dónde/instalación/automatizable.
- Panel de Azure Advisor: checkboxes de problemas → puntaje por las 5 categorías (Costo, Seguridad, Confiabilidad, Excelencia operativa, Rendimiento) y recomendaciones. Puntajes ilustrativos.
- Tarjetas por herramienta y 15 preguntas en `data/preguntas-cap04.json`.

## Convenciones de los simuladores
- `seg()` pone `data-k` en cada botón; en un `.seg.fail` la opción con clave `none` se pinta azul (no roja).
- Para probar: `python -m http.server` en la carpeta y captura con Chrome headless (`--screenshot`). Chrome headless no baja de ~500 px de ancho; usar un `--user-data-dir` limpio para no ver CSS en caché.

## Leer el PDF
Las diapositivas son casi todo imágenes: `pdftotext` (disponible en Git Bash) saca poco texto. Para leerlas, renderizar páginas a PNG con PyMuPDF en un venv temporal y abrir las imágenes.

## Conceptos ya repasados (para preguntas)
- **Storage:** LRS (3 copias, 1 datacenter, 11 nueves), ZRS (3 zonas, 12 nueves), GRS = LRS primaria + LRS secundaria (6 copias, 16 nueves), GZRS = ZRS primaria + LRS secundaria. Variantes RA- permiten leer la secundaria (endpoint -secondary). Replicación geo asíncrona. Brazil South se empareja con South Central US, pero no es recíproco (South Central US se empareja con North Central US).
- **Balanceo:** Application Gateway = regional, capa 7, WAF. Traffic Manager = global, solo DNS (no es capa 7, no hace proxy; no requiere GRS). Front Door = global, capa 7, WAF, CDN.
- **Identidad:** Entra ID, Entra Connect Sync / Cloud Sync, Entra Domain Services, Entra ID Protection, Conditional Access, MFA, SSO, passwordless, Entra External ID (B2B/B2C), RBAC, PIM, Defender for Cloud, Zero Trust, defensa en profundidad, autenticación vs autorización.

## Próximos pasos
1. ~~Crear `index.html`, `assets/` y adaptar cap07~~ (hecho).
2. PDF ya copiado en `docs/`. Capítulos 2, 3 y 4 hechos; seguir con el capítulo 5 (Computación, desde la pág. 59: VMs, opciones de compra, Scale Sets, escalado vertical/horizontal, alta disponibilidad…).
3. ~~Repo git propio~~ (hecho): rama `main`, remoto `origin` = https://github.com/rpavez2026-debug/az900-simulador. Hacer commit y push al terminar cada avance.
