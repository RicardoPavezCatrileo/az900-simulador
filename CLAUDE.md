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
Completado con el PDF (págs. 122–167): sección 5 "Mover datos y migrar" (AzCopy / Storage Explorer / File Sync / Data Box / Azure Migrate según necesidad, tamaño, ancho de banda y datos sensibles; Data Box si por red tarda > 1 semana), tarjetas de Premium (solo LRS/ZRS), estructura cuenta → contenedor → blob, migración y Cosmos DB. Quiz: 28 preguntas (incluye la de Storage Explorer con la redacción del examen).
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

## Lo que ya existe: cap05-computacion.html (PDF págs. 59–100)
- Opciones de compra: duración × interrumpible × requisito especial (zona, host dedicado, aislada) × flexibilidad → pago por uso / plan de ahorro / reservada / spot / host dedicado / aislada / reserva de capacidad, con analogía del hotel del curso y tabla comparativa. Descuentos del curso (~65/72/90%) marcados como aproximados.
- Escalado: vertical (tamaños hasta 416 vCPU) vs horizontal en 1 zona vs horizontal en 3 zonas, slider de usuarios (supuesto: 100 usuarios por vCPU, 4 vCPU por VM en horizontal; límite 100/1000 VMs del Scale Set) y caída de la Zona 1.
- Explorador de servicios: VM, Scale Sets, App Service, ACI, AKS, Functions, Virtual Desktop (modelo, quién gestiona el SO, escalado, qué pagas).
- 20 preguntas en `data/preguntas-cap05.json`.
- Para probar un estado distinto al inicial: copiar la página a `_prueba.html` con `sed` cambiando las variables `let …` iniciales, capturar y borrar la copia.

## Lo que ya existe: cap06-redes.html (PDF págs. 101–121)
- Espacio de direcciones: slider de prefijo /16–/29 sobre 10.1.0.0 (total, 5 reservadas por Azure, rango asignable); validador de subred nueva (fuera de la VNet / superpuesta / ok); peering A–B–C con CIDR superpuesto y no transitividad.
- NSG: origen × puerto contra reglas por prioridad (incluye las por defecto 65000/65001/65500) y regla opcional 150 que le gana a la 300; tabla con "coincide → decide / no se evalúa".
- Conexión híbrida: oficina / laptop / otra VNet × por Internet o privado → VPN S2S, P2S, ExpressRoute o peering.
- Balanceo: Load Balancer, Application Gateway, Traffic Manager, Front Door, CDN (TM y FD no están en el PDF; marcado).
- 18 preguntas en `data/preguntas-cap06.json`.
- Errores del PDF corregidos en el sitio: una /24 tiene 251 IPs asignables en Azure (no 256); la terminación SSL es de Application Gateway, no de Load Balancer.

## Lo que ya existe: capítulos 8 a 11
- **cap08-identidad.html** (págs. 168–197): ¿es MFA? (métodos por categoría sabes/tienes/eres; contraseña+PIN no es MFA), acceso condicional (usuario × ubicación × dispositivo × riesgo contra 6 directivas de ejemplo; bloquear gana), elegir servicio de identidad (Entra Connect, Connect Health, Domain Services, B2B, SSO, admin center) y tabla AD DS vs Entra ID. 18 preguntas. Nombres actuales: Microsoft Entra ID / Entra Domain Services (el PDF dice Azure AD DS).
- **cap09-seguridad.html** (págs. 198–216): defensa en profundidad con las 7 capas de Microsoft Learn (el PDF usa otra lista: políticas, física, perímetro, redes, hosts, aplicaciones, datos) + juego de clasificar 10 controles; endpoints público / de servicio / privado × origen (VM, oficina por VPN, Internet) con opción de deshabilitar el acceso público; elegir servicio (Key Vault, Defender for Cloud, Sentinel, endpoint privado, NSG). 16 preguntas. Sentinel ahora es "Microsoft Sentinel".
- **cap10-monitorizacion.html** (págs. 217–247): RBAC + locks (entidad × rol × ámbito × lock × recurso × acción, con los 3 pasos de evaluación; el lock le gana incluso al Propietario), Azure Policy (3 políticas, recursos existentes conformes o no, crear VM con Deny/Audit), elegir herramienta (Monitor, Log Analytics/KQL, Application Insights, alertas + grupo de acción, Service Health, Arc, CAF). 19 preguntas. Azure Blueprints marcado como retirado (julio 2026).
- **cap11-precios.html** (págs. 248–277): matriz de tráfico (entrada gratis, salida e inter-región se cobran), presupuesto con alertas vs límite de gasto (slider monto y gasto diario, marcas 50/80/100%), elegir herramienta de costos, y sección "El día del examen" (40–60 preguntas, 120 min, 700/1000, tipos de preguntas, Fundamentals no caduca). 17 preguntas.
- Errores del PDF corregidos en cap11: la reserva de capacidad no es un descuento (eso son reservadas y planes de ahorro); el tráfico entre regiones sí se cobra.
- `.ctl label.chk` en `estilos.css` evita que las casillas dentro de un `.ctl` se vean en mayúsculas.

## Convenciones de los simuladores
- `seg()` pone `data-k` en cada botón; en un `.seg.fail` la opción con clave `none` se pinta azul (no roja).
- Para probar: `python -m http.server` en la carpeta y captura con Chrome headless (`--screenshot`). Chrome headless no baja de ~500 px de ancho; usar un `--user-data-dir` limpio para no ver CSS en caché.

## Páginas de cada capítulo en el PDF
cap02 9–29 · cap03 30–47 · cap04 48–58 · cap05 59–100 (VMs, Scale Sets, App Service 86, Virtual Desktop 96) · cap06 101–121 (VPN Gateway 112–114, ExpressRoute 120) · cap07 122–167 (incluye migración ~150–167) · cap08 168–197 (arquitectura híbrida con Entra ID 173) · cap09 198–216 · cap10 217–247 · cap11 248–270 · preparación para el examen 271–282.

## Leer el PDF
Las diapositivas son casi todo imágenes: `pdftotext` (disponible en Git Bash) saca poco texto. Para leerlas, renderizar páginas a PNG con PyMuPDF en un venv temporal y abrir las imágenes.

## Conceptos ya repasados (para preguntas)
- **Storage:** LRS (3 copias, 1 datacenter, 11 nueves), ZRS (3 zonas, 12 nueves), GRS = LRS primaria + LRS secundaria (6 copias, 16 nueves), GZRS = ZRS primaria + LRS secundaria. Variantes RA- permiten leer la secundaria (endpoint -secondary). Replicación geo asíncrona. Brazil South se empareja con South Central US, pero no es recíproco (South Central US se empareja con North Central US).
- **Balanceo:** Application Gateway = regional, capa 7, WAF. Traffic Manager = global, solo DNS (no es capa 7, no hace proxy; no requiere GRS). Front Door = global, capa 7, WAF, CDN.
- **Identidad:** Entra ID, Entra Connect Sync / Cloud Sync, Entra Domain Services, Entra ID Protection, Conditional Access, MFA, SSO, passwordless, Entra External ID (B2B/B2C), RBAC, PIM, Defender for Cloud, Zero Trust, defensa en profundidad, autenticación vs autorización.

## Próximos pasos
1. ~~Crear `index.html`, `assets/` y adaptar cap07~~ (hecho).
2. PDF ya copiado en `docs/`. Los 10 capítulos (2 a 11) están hechos.
4. HECHO: `mapa.html` (enlazado desde la portada y desde la barra superior `.nav` de cada capítulo). Datos en el propio script: `N` (65 nodos: id, nombre, área 0–5, capítulo, descripción), `E` (75 aristas: origen, destino, relación), `ESC` (7 escenarios: nodos, aristas que deben existir en `E`, pasos) y `VS` (12 comparaciones de confusiones típicas). Las etiquetas de las aristas solo se muestran en el modo explorar. Al agregar contenido, validar con node que toda arista y escenario use ids existentes y que las aristas de `ESC` estén en `E`. Diseño original: mapa conceptual SVG único enlazado desde la portada y cada capítulo. Nodos por área (global, organización, cómputo, red, almacenamiento, identidad, seguridad, gestión, precios), flechas con significado ("se conecta a", "vive en", "filtra", "reparte entre"…), clic en un nodo → resalta conexiones + explicación + enlace al capítulo, y escenarios que iluminan un camino (web app de 3 niveles, oficina conectada, contenedores, migración, respaldos, inicio de sesión con MFA).
5. HECHO: `arquitectura.html` (diagrama estilo draw.io, enlazado desde la portada, el mapa y la `.nav` de cada capítulo). Arquitectura de ejemplo: web de 3 niveles en Brazil South (3 zonas) + oficina por VPN S2S/ExpressRoute + identidad híbrida + Storage GRS. Datos en el script: `EL` (marcos, zonas, nodos, pills y notas con coordenadas fijas en un viewBox de 1240×790; cada uno con `cap`, `q` = qué es, `p` = por qué está aquí, `pg` = páginas del PDF), `AR` (flechas con puntos explícitos; `l11` = etiqueta de precio que aparece desde el cap. 11) y `FLUJOS` (5 recorridos con ids que deben existir en `EL`/`AR`). "Construir hasta el capítulo N" muestra lo de `cap ≤ N` y resalta lo de `cap = N`; el último capítulo elegido se guarda en `az900:arquitectura:cap`. Los textos que no caben se comprimen solos (`ajustar`). Alternativa descartada por ahora, pero que gustó: archivos `.drawio` con íconos de Azure editados en VS Code (extensión Draw.io Integration).
3. ~~Repo git propio~~ (hecho): rama `main`, remoto `origin` = https://github.com/rpavez2026-debug/az900-simulador. Hacer commit y push al terminar cada avance.
