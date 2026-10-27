# AZ-900 Simulador — contexto del proyecto

## Objetivo
Sitio web personal para estudiar las certificaciones de Azure, con **AZ-900 (Microsoft Azure Fundamentals)** como base y luego AZ-104 (y más adelante DP-900 y AZ-305), con simuladores interactivos y quizzes por capítulo, y ver rápidamente qué temas tengo cubiertos.

## Decisiones tomadas
- **Tecnología:** solo HTML + CSS + JavaScript (sin Python, sin Next.js, sin build). Mantener el foco en estudiar Azure, no en desarrollo web.
- **Progreso:** se guarda en el navegador con `localStorage` (envolver lecturas/escrituras en try/catch).
- **Preguntas:** en archivos JSON separados por capítulo (`data/preguntas-capXX.json`), no dentro del HTML.
- **Desarrollo local:** VS Code + extensión Live Server.
- **Publicación futura:** Azure Static Web Apps (plan gratuito) conectado a GitHub, como práctica real de Azure.
- **Opcional más adelante:** pruebas automatizadas con Playwright + Python (que cada quiz cargue y el puntaje se guarde).
- **Idioma del sitio:** español.

## Estructura (varias certificaciones, AZ-900 es la base)
```
az900-simulador/
├── CLAUDE.md
├── index.html                  ← portada: elegir certificación (AZ-900, AZ-104, DP-900, AZ-305) con su avance
├── mapa.html                   ← compartido (enlaza a az900/…)
├── arquitectura.html           ← compartido (enlaza a az900/…)
├── assets/
│   ├── estilos.css             ← diseño compartido (tokens claro/oscuro, controles, tablas, quiz, barras, portadas)
│   ├── progreso.js             ← CAPITULOS (AZ-900), AZ104, CERTS + objeto Progreso (localStorage)
│   ├── portada.js              ← portadaCert("az900"|"az104"): tarjetas de temas con avance y "Repaso AZ-900"
│   └── quiz.js                 ← iniciarQuiz("capXX") o iniciarQuiz("<tema>","az104")
├── az900/
│   ├── index.html              ← portada de AZ-900 (10 capítulos)
│   ├── cap02-cloud.html … cap11-precios.html
│   └── data/preguntas-capXX.json
├── az104/
│   ├── index.html              ← portada de AZ-104 (5 dominios oficiales)
│   └── data/preguntas-<tema>.json   (cuando existan)
└── docs/                       ← PDFs de los cursos (NO se suben)
```
- Las páginas dentro de `az900/` y `az104/` usan `../assets/…`, `../mapa.html` y `../arquitectura.html`. El quiz busca `data/…` relativo a la página, así que cada certificación tiene su propia carpeta `data/`.
- Avance: clave `<cert>:progreso:<id>` (las de AZ-900 no cambiaron: `az900:progreso:capXX`). `Progreso.leer/guardar/borrar/porcentaje(id, cert="az900")`, `Progreso.porcentajeCert(cert)`.
- Al crear una certificación nueva: agregar su lista de temas en `progreso.js`, ponerle `carpeta` en `CERTS`, crear `<carpeta>/index.html` con `portadaCert("<id>")`.
- Idea a futuro: pasar los nodos del mapa a un catálogo único de servicios con un texto por nivel (qué es / cómo se configura / cuándo elegirlo) y un filtro por certificación en el mapa y la arquitectura.

## AZ-104 (PDF "Microsoft-Azure-Administrator-Associate-v2.pdf", 214 páginas, mismo autor que el de AZ-900)
Cerca del 60% repite AZ-900. Cada tema de `AZ104` en `progreso.js` lleva `pdf` (páginas) y `base` (capítulos de AZ-900 a repasar); las páginas de AZ-104 solo agregan lo nuevo.
- Dominio 1 · Identidades y gobierno (págs. 25–81): gobernanza (25–40), Entra ID (41–70: licencias Free/P1/P2 48–54, usuarios 55–56, grupos y pertenencia dinámica 57–60, atributos de seguridad 61–62, SCIM 63–66, AD DS 67–70), RBAC por dentro (71–81). Archivo `identidad-gobierno.html`.
  - HECHO `az104/identidad-gobierno.html`: (1) licencia mínima de Entra ID según las funciones marcadas (Free/P1/P2/ID Governance); (2) grupo asignado vs dinámico con editor de regla (`user.department -eq "Ventas"`, segunda condición -and/-or), licencia del tenant (dinámico con Free = error), tipo seguridad/M365 y botón que cambia el departamento de un usuario para ver el recálculo; (3) RBAC por dentro: roles con Actions/NotActions (simplificados) × operaciones con comodines, permisos efectivos = unión de roles (Colaborador + Administrador de acceso de usuario ≈ Propietario); (4) tarjetas y (5) tabla AD DS vs Entra ID vs Entra Domain Services. 15 preguntas en `az104/data/preguntas-identidad.json` (`iniciarQuiz("identidad","az104")`).
- Dominio 2 · Almacenamiento (82–112): casi todo en cap07; nuevo: Archive (91–92). Archivo `almacenamiento.html`.
- Dominio 3 · Cómputo (113–155): VMs, Bastion (128–130), ARM y Bicep (131–135), App Service, Docker y contenedores, Container Apps (152). Archivo `computo.html`.
  - HECHO `az104/computo.html`: (1) conexión a la VM: IP pública + RDP/SSH vs Bastion vs VPN P2S; con Bastion valida nombre de subred (AzureBastionSubnet), ubicación (misma VNet / emparejada / sin conexión) y roles de lectura (VM, NIC, Bastion); (2) Scale Set: autoescalado por CPU (mín., máx., umbrales) vs manual sobre 12 horas de carga, con VM-hora, horas saturadas y ahorro (`calcE` recalcula sin recrear los deslizadores); (3) ARM vs Bicep del mismo recurso (cuenta de almacenamiento o VNet) con parámetros editables, `bicep build`, `az deployment group create` y modo Incremental/Completo (no está en el PDF); (4) contenedores: flujo Dockerfile→ACR y elección ACI / Container Apps / AKS / Web App para contenedores; (5) tarjetas, incluidos los comandos de Bash (págs. 20–22). 16 preguntas en `az104/data/preguntas-computo.json`.
- Dominio 4 · Redes (156–189): VNet, peering, NSG, endpoints, LB/AGW, Azure DNS (183–189). Archivo `redes.html`.
  - HECHO `az104/redes.html`: (1) NSG de subred + NSG de NIC (entrante: los dos deben permitir) con ASG-Web/ASG-DB, orígenes con etiquetas (Internet, VirtualNetwork, Oficina por VPN) y vm-nueva que hereda reglas al entrar al ASG; (2) peering con varios espacios de direcciones (VNets A, B, C de las págs. 162–163, espacios y peerings activables, matriz de alcance con no transitividad); (3) Application Gateway: rutas /images, /video y por defecto, redirección HTTP→HTTPS y sondeos a /health (502 si no hay sanos); (4) Azure DNS: zona pública (delegación NS en el registrador, A y CNAME) vs privada (vínculo de VNet, registro automático). 15 preguntas en `az104/data/preguntas-redes.json`. Errores del PDF AZ-104 corregidos: /24 = 251 IPs asignables (no 256) y la terminación SSL no es del Load Balancer.
- Dominio 5 · Monitoreo y copias de seguridad (190–202): Monitor, Log Analytics, alertas, Backup (201–202). Archivo `monitoreo-backup.html`.
  - HECHO `az104/monitoreo-backup.html`: (1) regla de alerta (señal disco/CPU/latencia con 30 min de valores, ventana 1/5/10 min, gravedad 0–4, grupo de acción) que marca el minuto en que se dispara; (2) KQL en Log Analytics con 4 consultas sobre datos de ejemplo (Perf, Heartbeat, AzureActivity); (3) Backup y Site Recovery (NO está en el PDF, que solo trae la pág. 202): política diaria o cada 4 h, retención diaria/mensual, redundancia del almacén LRS/GRS/GRS+restauración entre regiones, eliminación temporal, ASR, ante 5 incidentes (archivo borrado, ransomware, auditoría, backups borrados, caída de región) con método, punto, RPO y RTO. 15 preguntas en `az104/data/preguntas-monitoreo.json`.
- Para probar estados con Chrome headless, usar un `--user-data-dir` distinto por cada copia `_prueba`: si se reutiliza, Chrome sirve la copia anterior desde la caché.
- Herramientas (14–24) y cloud (8–13) son repaso de AZ-900; los comandos de Bash (21–22) son lo único nuevo.
- Examen (203–209): igual formato que AZ-900, pero las Associate caducan cada año (renovación gratis en Learn).

## Cómo se arma un capítulo
- La página carga `assets/estilos.css`, luego `assets/progreso.js` y `assets/quiz.js`, y llama a `iniciarQuiz("capXX")`. Debe tener `<div id="score">` y `<div id="quiz">`.
- Los estilos propios del simulador van en un `<style>` dentro de la página; lo reutilizable va a `estilos.css`.
- Formato de pregunta en JSON: `{"pregunta","opciones":[...],"correcta":<índice>,"explicacion"}`. Para selección múltiple ("Selecciona TODAS"), `"correcta":[<índice>,...]`: se marcan opciones y se responde con "Comprobar"; solo es correcta si coincide exactamente (las correctas no marcadas se muestran con borde verde punteado).
- Al publicar un capítulo o tema nuevo, marcar `listo:true` en su lista (`CAPITULOS` o `AZ104` en `progreso.js`) para que la portada lo enlace.
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
Completado con el PDF (págs. 122–167): sección 5 "Mover datos y migrar" (AzCopy / Storage Explorer / File Sync / Data Box / Azure Migrate según necesidad, tamaño, ancho de banda y datos sensibles; Data Box si por red tarda > 1 semana), tarjetas de Premium (solo LRS/ZRS), estructura cuenta → contenedor → blob, migración y Cosmos DB. Quiz: 29 preguntas (incluye la de Storage Explorer con la redacción del examen y una de selección múltiple sobre las limitaciones de Premium).
Errores de esa guía que NO se deben copiar: dice que la secundaria de GZRS es ZRS (es LRS); pone Azure Disks dentro de la Storage Account (los discos administrados son un recurso aparte); dice que los niveles de acceso aplican a append blobs (solo block blobs).

## Lo que ya existe: cap02-cloud.html (PDF págs. 9–29)
- Simulador de responsabilidad compartida: Local/IaaS/PaaS/SaaS sobre 10 capas (cliente / compartida / Microsoft) + tabla comparativa.
- Simulador de capacidad: centro de datos propio (servidores fijos, slider) vs cloud (capacidad = demanda +10%), gráfico SVG mensual con demanda atendida, sin atender y capacidad ociosa.
- Tarjetas de conceptos (despliegue, 5 características, 6 ventajas, pilares, precios, IaaS/PaaS/SaaS) y 17 preguntas en `data/preguntas-cap02.json` (la 16 es de selección múltiple: atributos de la nube privada, control total + compra de hardware; la 17 es previsibilidad vs confiabilidad).

## Lo que ya existe: cap03-arquitectura.html (PDF págs. 30–47)
- Simulador de despliegue (ejemplo Londres/Mumbai del curso): 1 centro de datos / 2 centros de datos / 2 regiones × evento (falla de centro de datos, caída de región) × ubicación del usuario → disponibilidad y latencia, con los 3 desafíos del curso marcados como resueltos o no.
- Simulador de jerarquía: árbol grupo de administración → suscripción → grupo de recursos → recurso; asignar política o rol muestra la herencia hacia abajo; eliminar un grupo de recursos borra su contenido.
- Tarjetas (regiones, emparejadas, soberanas, zonas, PoP, servicios globales vs regionales) y 22 preguntas en `data/preguntas-cap03.json` (la 22: una suscripción por departamento para pagar por separado; la 20 es grupos de administración para el acceso a múltiples suscripciones; la 21, afirmación verdadera sobre grupos de administración con Blueprints como trampa; la 18 y la 19 son de selección múltiple: entre qué se puede mover una VM → regiones, grupos de recursos y suscripciones, no viene del PDF; y dos afirmaciones correctas sobre zonas de disponibilidad).
- El curso nombra "Azure Active Directory"; en el sitio se usa "Microsoft Entra ID (antes Azure Active Directory)".

## Lo que ya existe: cap04-fundamentos-herramientas.html (PDF págs. 48–58)
- "Una tarea, siete herramientas": crear una VM en Portal (pasos), CLI (`az`), PowerShell (`New-AzVM`), Cloud Shell, plantilla ARM (JSON + `az deployment group create`), Mobile App y Advisor, con ficha de tipo/dónde/instalación/automatizable.
- Panel de Azure Advisor: checkboxes de problemas → puntaje por las 5 categorías (Costo, Seguridad, Confiabilidad, Excelencia operativa, Rendimiento) y recomendaciones. Puntajes ilustrativos.
- Tarjetas por herramienta y 15 preguntas en `data/preguntas-cap04.json`.

## Lo que ya existe: cap05-computacion.html (PDF págs. 59–100)
- Opciones de compra: duración × interrumpible × requisito especial (zona, host dedicado, aislada) × flexibilidad → pago por uso / plan de ahorro / reservada / spot / host dedicado / aislada / reserva de capacidad, con analogía del hotel del curso y tabla comparativa. Descuentos del curso (~65/72/90%) marcados como aproximados.
- Escalado: vertical (tamaños hasta 416 vCPU) vs horizontal en 1 zona vs horizontal en 3 zonas, slider de usuarios (supuesto: 100 usuarios por vCPU, 4 vCPU por VM en horizontal; límite 100/1000 VMs del Scale Set) y caída de la Zona 1.
- Explorador de servicios: VM, Scale Sets, App Service, ACI, AKS, Functions, Virtual Desktop (modelo, quién gestiona el SO, escalado, qué pagas).
- AKS por dentro (sección 4): plano de control (Microsoft), nodos (VMs) en 3 zonas y pods; slider de usuarios (100 por pod, 4 pods por nodo), HPA 2–30 pods, escalador del clúster 3–9 nodos y caída de la Zona 1 (pods recreados en las zonas sanas). HPA y escalador no están en el PDF (págs. 93–95).
- 24 preguntas en `data/preguntas-cap05.json` (la 23 y 24 son de AKS: nodo = VM y plano de control administrado por Microsoft; la 22 es la de usuarios de Mac/Android con apps Windows → Virtual Desktop, redacción del examen; la 21 es de selección múltiple: serverless = Functions, Logic Apps y Event Grid; va más allá del PDF).
- Para probar un estado distinto al inicial: copiar la página a `_prueba.html` con `sed` cambiando las variables `let …` iniciales, capturar y borrar la copia.

## Lo que ya existe: cap06-redes.html (PDF págs. 101–121)
- Espacio de direcciones: slider de prefijo /16–/29 sobre 10.1.0.0 (total, 5 reservadas por Azure, rango asignable); validador de subred nueva (fuera de la VNet / superpuesta / ok); peering A–B–C con CIDR superpuesto y no transitividad.
- NSG: origen × puerto contra reglas por prioridad (incluye las por defecto 65000/65001/65500) y regla opcional 150 que le gana a la 300; tabla con "coincide → decide / no se evalúa".
- Conexión híbrida: oficina / laptop / otra VNet × por Internet o privado → VPN S2S, P2S, ExpressRoute o peering.
- Balanceo: Load Balancer, Application Gateway, Traffic Manager, Front Door, CDN (TM y FD no están en el PDF; marcado).
- 18 preguntas en `data/preguntas-cap06.json`.
- Errores del PDF corregidos en el sitio: una /24 tiene 251 IPs asignables en Azure (no 256); la terminación SSL es de Application Gateway, no de Load Balancer.

## Lo que ya existe: capítulos 8 a 11
- **cap08-autenticacion-autorizacion.html** (págs. 168–197): ¿es MFA? (métodos por categoría sabes/tienes/eres; contraseña+PIN no es MFA), acceso condicional (usuario × ubicación × dispositivo × riesgo contra 6 directivas de ejemplo; bloquear gana), elegir servicio de identidad (Entra Connect, Connect Health, Domain Services, B2B, SSO, admin center) y tabla AD DS vs Entra ID. 18 preguntas. Nombres actuales: Microsoft Entra ID / Entra Domain Services (el PDF dice Azure AD DS).
- **cap09-seguridad.html** (págs. 198–216): defensa en profundidad con las 7 capas de Microsoft Learn (el PDF usa otra lista: políticas, física, perímetro, redes, hosts, aplicaciones, datos) + juego de clasificar 10 controles; endpoints público / de servicio / privado × origen (VM, oficina por VPN, Internet) con opción de deshabilitar el acceso público; elegir servicio (Key Vault, Defender for Cloud, Sentinel, endpoint privado, NSG). 16 preguntas. Sentinel ahora es "Microsoft Sentinel".
- **cap10-monitorizacion-gestion.html** (págs. 217–247): RBAC + locks (entidad × rol × ámbito × lock × recurso × acción, con los 3 pasos de evaluación; el lock le gana incluso al Propietario), Azure Policy (3 políticas, recursos existentes conformes o no, crear VM con Deny/Audit), elegir herramienta (Monitor, Log Analytics/KQL, Application Insights, alertas + grupo de acción, Service Health, Arc, CAF). 21 preguntas (la 20: servicios de Azure en servidores locales → Azure Arc; la 21: propósito de Application Insights frente a Service Health, Sentinel y Log Analytics). Azure Blueprints marcado como retirado (julio 2026).
- **cap11-precios.html** (págs. 248–277): matriz de tráfico (entrada gratis, salida e inter-región se cobran), presupuesto con alertas vs límite de gasto (slider monto y gasto diario, marcas 50/80/100%), elegir herramienta de costos, y sección "El día del examen" (40–60 preguntas, 120 min, 700/1000, tipos de preguntas, Fundamentals no caduca). 18 preguntas (incluye la de cuántas pruebas gratuitas por cuenta: una; no viene del PDF).
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
4. HECHO: `mapa.html` (enlazado desde la portada y desde la barra superior `.nav` de cada capítulo). Datos en el propio script: `N` (72 nodos: id, nombre, área 0–5, capítulo, descripción), `E` (87 aristas: origen, destino, relación), `ESC` (8 escenarios: nodos, aristas que deben existir en `E`, pasos) y `VS` (18 comparaciones de confusiones típicas). Las etiquetas de las aristas solo se muestran en el modo explorar. Al agregar contenido, validar con node que toda arista y escenario use ids existentes y que las aristas de `ESC` estén en `E`. Diseño original: mapa conceptual SVG único enlazado desde la portada y cada capítulo. Nodos por área (global, organización, cómputo, red, almacenamiento, identidad, seguridad, gestión, precios), flechas con significado ("se conecta a", "vive en", "filtra", "reparte entre"…), clic en un nodo → resalta conexiones + explicación + enlace al capítulo, y escenarios que iluminan un camino (web app de 3 niveles, oficina conectada, contenedores, migración, respaldos, inicio de sesión con MFA).
5. HECHO: `arquitectura.html` (diagrama estilo draw.io, enlazado desde la portada, el mapa y la `.nav` de cada capítulo). Arquitectura de ejemplo: web de 3 niveles en Brazil South (3 zonas) detrás de Azure Front Door (cap. 6, marcado como "no está en el PDF"; vive en el borde de Microsoft · PoP, pág. 37) + oficina por VPN S2S/ExpressRoute + identidad híbrida + Storage GRS. Datos en el script: `EL` (marcos, zonas, nodos, pills y notas con coordenadas fijas en un viewBox de 1240×860; cada uno con `cap`, `q` = qué es, `p` = por qué está aquí, `pg` = páginas del PDF), `AR` (flechas con puntos explícitos; `l11` = etiqueta de precio que aparece desde el cap. 11) y `FLUJOS` (6 recorridos con ids que deben existir en `EL`/`AR`; "Black Friday: escalar" dibuja con `pintarEscala()` etiquetas de escalado horizontal en el Scale Set web y vertical en las VMs app y en SQL, y con Traffic Manager cambia su paso 2 por `pasoTM`) y `RED` (selector LRS/ZRS/GRS/RA-GRS/GZRS/RA-GZRS, visible desde el cap. 7: dibuja las copias dentro del nodo Storage y oculta la copia secundaria si no es geo; se guarda en `az900:arquitectura:red`). Selector "Entrada global" (desde el cap. 6): Front Door (proxy capa 7, todo el tráfico pasa por él) o Traffic Manager (solo DNS: flecha punteada de consulta + HTTPS directo al App Gateway); `excluido()` oculta las piezas de la opción no elegida, `idsFlujo`/`pasosFlujo` adaptan el recorrido web; se guarda en `az900:arquitectura:entrada`. "Construir hasta el capítulo N" muestra lo de `cap ≤ N` y resalta lo de `cap = N`; el último capítulo elegido se guarda en `az900:arquitectura:cap`. Los textos que no caben se comprimen solos (`ajustar`). Alternativa descartada por ahora, pero que gustó: archivos `.drawio` con íconos de Azure editados en VS Code (extensión Draw.io Integration).
3. ~~Repo git propio~~ (hecho): rama `main`, remoto `origin` = https://github.com/rpavez2026-debug/az900-simulador. Hacer commit y push al terminar cada avance.
