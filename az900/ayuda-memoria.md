# Cap. 02 · Qué es el Cloud Computing (PDF págs. 9–29)

## Modelos de servicio: ¿quién administra el sistema operativo?

| Modelo | Tú gestionas | Ejemplos |
|---|---|---|
| **IaaS** | SO, parches, apps y datos. Microsoft: hardware, red y centro de datos | VMs (aunque sean controlador de dominio). El máximo control |
| **PaaS** | Tu app y tus datos. Microsoft también gestiona el SO | App Service, Azure SQL Database |
| **SaaS** | Solo lo usas | Microsoft 365, Entra ID, Gmail, Zoom |

- **Siempre del cliente**, en los 3 modelos: datos, dispositivos, identidades y cuentas.
- Compartido en PaaS: identidad y directorio, aplicaciones y controles de red.
- **Trampa:** SQL Server en una VM = IaaS; Azure SQL Database = PaaS. AKS no es SaaS. "HaaS" no existe.

## Modelos de implementación

- **Pública**: pagas por uso (OpEx), aprovisionas rápido, sin hardware propio.
- **Privada**: una sola organización; control total y seguridad; compras el hardware (CapEx). Ej.: VMware propio.
- **Híbrida**: local + pública (lo sensible en casa, lo que crece en Azure). **Trampa:** no exige tener antes una nube privada.

## Economía

- **CapEx → OpEx**: dejas de comprar servidores y pagas mes a mes lo que usas (**servicio medido**).
- Pagas cómputo, almacenamiento y los datos que **salen** de Azure; la **entrada es gratis**.
- **Alquiler múltiple**: muchos clientes en el mismo hardware, aislados entre sí.

## Beneficios del cloud

| Si la pregunta dice… | Respuesta | No confundir con |
|---|---|---|
| Desplegar rápido cuando cambia el negocio | **Agilidad** | Elasticidad |
| Se ajusta **solo** a la carga (Black Friday) | **Elasticidad** | Escalabilidad (puede crecer) |
| Sigue funcionando; depende del **SLA** que elijas | **Alta disponibilidad** | La ubicación del centro de datos |
| Rápido desde cualquier lugar | **Baja latencia** | Recuperación ante desastres |
| Funciona "como se espera" bajo carga; prever costos | **Previsibilidad** | Confiabilidad |
| Se recupera de fallas y sigue funcionando | **Confiabilidad** | Previsibilidad |
| Políticas, estándares, cumplimiento | **Gobernanza** | Seguridad |
| Cómo administras e implementas (portal, CLI, plantillas) | **Gestión (manejabilidad)** | Previsibilidad |

# Cap. 03 · Arquitectura de Azure (PDF págs. 30–47)

## Infraestructura física (de menor a mayor)

| Pieza | Qué es | Te protege de |
|---|---|---|
| Conjunto de disponibilidad (cap. 5) | VMs repartidas en racks de un centro de datos | Fallas de hardware y actualizaciones |
| **Zona de disponibilidad** | 1 o más centros de datos con energía, refrigeración y red propias. Mínimo 3 por región; no todas las regiones tienen | Caída de un centro de datos, sin salir de la región |
| **Región** | Centros de datos cercanos, unidos con baja latencia | Elegirla bien: ley, latencia, servicios, precio |
| **Par de regiones** | Otra región de la misma geografía, a cientos de km | Caída de toda la región |

- Se elige región por **ley y datos, cercanía (latencia), servicios y precio**. No por cantidad de suscripciones.
- Los datos no salen de la región sin tu permiso explícito.
- Par de regiones: actualizaciones **secuenciales** y prioridad para recuperarse. Brazil South → South Central US (no recíproco).
- **Regiones soberanas**: Azure Government (EE. UU.) y Azure China 21Vianet; para requisitos de un país, acceso restringido.
- **PoP** (punto de presencia): entrega contenido cerca del usuario → menos latencia.
- Servicios **globales**: Entra ID, Traffic Manager, Front Door. VMs, App Service y Functions son **regionales**.

## Jerarquía de gestión

**Grupo de administración → suscripción → grupo de recursos → recurso**

| Nivel | Para qué | Si la pregunta dice… |
|---|---|---|
| **Grupo de administración** | Agrupa suscripciones en árbol (un solo padre, hasta 6 niveles); Policy y RBAC se heredan | "muchas suscripciones con las mismas reglas, desde un solo lugar" |
| **Suscripción** | Límite de **facturación** y de acceso | "separar costos por departamento o prod/dev/test" |
| **Grupo de recursos** | Contenedor lógico (guarda metadatos) para recursos con el **mismo ciclo de vida** | "se crean y se borran juntos" |

- **Trampa:** el grupo de administración no gestiona el ciclo de vida de los recursos; eso es el grupo de recursos.
- "Políticas e iniciativas" = **Azure Policy** (iniciativa = conjunto de políticas). "Crear entornos conformes" = Blueprints (retirado).
- **Policy y RBAC se heredan; las etiquetas no** (solo si una Policy las copia).
- Una VM se puede mover entre grupos de recursos, suscripciones y regiones (entre regiones, replicándola).

# Cap. 04 · Herramientas de Azure (PDF págs. 48–58)

## Las herramientas para administrar Azure

| Herramienta | Qué es | Si la pregunta dice… |
|---|---|---|
| **Azure Portal** | Consola web gráfica (portal.azure.com). Está en cada centro de datos: resiste fallas y se actualiza sin cortes | "interfaz gráfica", "consola web unificada", clics |
| **Cloud Shell** | Shell en el navegador, **Bash o PowerShell**, sin instalar nada; se abre desde el Portal o la Mobile App | "PC prestado", "sin instalar nada", "desde el navegador" |
| **Azure CLI** | Línea de comandos multiplataforma; comandos que empiezan con **az** | "az vm create", Windows, Mac y Linux |
| **Azure PowerShell** | Cmdlets **Verbo-Sustantivo**; funciona en Windows, Linux y macOS | "New-AzVM", "Get-AzResourceGroup" |
| **Mobile App** | Ver el estado, recibir alertas y usar Cloud Shell desde el teléfono | "de viaje", "en el celular" |
| **Plantillas ARM** | Archivo **JSON** declarativo: describes qué quieres y Azure lo crea | "la misma infraestructura en dev, test y prod" |

- **Automatizar con scripts** = Azure CLI o Azure PowerShell. El Portal es manual (clics).
- **Trampa CLI vs PowerShell:** "az …" = CLI; "New-Az…", "Get-Az…" = PowerShell. Las dos funcionan en los 3 sistemas.
- Cloud Shell puede guardar scripts y archivos en una cuenta de almacenamiento asociada.

## Plantillas ARM = infraestructura como código (IaC)

- La **IaC nativa de Azure**: JSON declarativo (QUÉ quieres, no CÓMO), repetible y se guarda en control de versiones. **Bicep** es su versión más legible (no está en el PDF).
- **Trampa:** "orquestar recursos + asignaciones de roles + políticas" describe **Blueprints** (retirado), no ARM.
- **Azure Resource Manager** es la capa de gestión por donde pasan todas las herramientas (Portal, CLI, PowerShell, plantillas).

## Azure Advisor

- Consultor personalizado: analiza la configuración y el uso de tus recursos y **recomienda** mejoras.
- **5 categorías:** Costo · Seguridad · Confiabilidad · Excelencia operativa · Rendimiento. "Facturación por suscripción" no es una.
- VM con muy poca CPU durante semanas → redimensionar → categoría **Costo**.
- **Trampa:** Advisor no solo habla de costos. ¿Recomienda sobre la red o la seguridad de mis VMs? → **Sí** (p. ej., cerrar puertos de administración abiertos).
- Advisor **recomienda**, no aplica ni obliga: imponer reglas es Azure Policy (cap. 10).

# Cap. 05 · Computación (PDF págs. 59–100)

## Formas de pagar una VM (la VM es IaaS)

| Opción | Cuándo | Si la pregunta dice… |
|---|---|---|
| **Pago por uso** | Sin compromiso, por segundo; el precio por hora más alto | "corta duración", "impredecible", "sin pago adelantado" |
| **Instancias reservadas** | Compromiso de 1 o 3 años con la misma VM: gran descuento | "24/7 durante 3 años", "base de datos constante" |
| **Plan de ahorro** | Te comprometes a un gasto por hora (1 o 3 años), no a una VM; no se cancela | "gasto fijo por hora, pero cambiar de tamaño o región" |
| **Instancias spot** | El mayor descuento, pero Azure puede quitártela en cualquier momento | "lotes que toleran interrupciones" |
| **Dedicated Host** | Servidor físico solo para ti; el más caro | "regulación", "aislamiento físico", "control del hardware" |
| **Reserva de capacidad** | Asegura capacidad en una zona, sin permanencia. **No es un descuento** | "asegurar capacidad por unas semanas" |

## Escalado y disponibilidad de VMs

- **Vertical** (hacia arriba): más RAM y vCPU a la misma VM; tiene tope. **Horizontal** (hacia fuera): más VMs iguales detrás de un balanceador; preferido.
- **Elástico** = escala **solo**, según la carga. Agilidad = recursos nuevos en minutos.
- **VM Scale Set** = conjunto de **VMs idénticas** que escala solo. Sin costo extra (pagas las VMs). Hasta 100 VMs, configurable a 1000.
- **Conjunto de disponibilidad** = **fallas de hardware y actualizaciones** dentro de un centro de datos (dominios de error y de actualización).
- **Zonas de disponibilidad** = sobrevivir a la **caída de un centro de datos completo** (alta disponibilidad = al menos 2 zonas).
- **Trampa:** ZRS es redundancia de Storage, no de VMs. Aislar una VM de otras = **VNet**; aislamiento físico = **Dedicated Host**.

## Otros servicios de cómputo

| Si la pregunta dice… | Respuesta | No confundir con |
|---|---|---|
| Solo subir el código de la web, con balanceo y autoescalado incluidos | **App Service** (PaaS) | VMs |
| Un contenedor suelto, lo más simple, sin VMs ni orquestador | **Container Instances (ACI)** | AKS |
| Guardar imágenes de contenedor en privado | **Container Registry (ACR)** | Docker Hub (público) |
| Orquestar muchos contenedores, Kubernetes, clúster, microservicios | **AKS** | ACI |
| Código que corre solo cuando llega un evento; sin tráfico no pagas | **Azure Functions** | App Service |
| Escritorio o apps de Windows desde cualquier dispositivo (Mac, Android) | **Azure Virtual Desktop** | Entra ID, VPN |

- **AKS:** nodo = **VM** donde corren los pods (eso pagas); pod = uno o más contenedores. Microsoft gestiona gratis el **plano de control** (no está en el PDF).
- **Serverless** = los servidores existen pero no los gestionas; escala solo y pagas por ejecución. Son serverless: **Functions, Logic Apps** (flujos sin código) y **Event Grid** (eventos).
- **Trampa Functions:** no está "siempre en ejecución": se activa con un evento y se detiene.
- Virtual Desktop: varios usuarios pueden compartir la misma VM.

# Cap. 06 · Redes (PDF págs. 101–121)

## Red virtual (VNet) y subredes

- **VNet** = red privada y aislada en Azure; se divide en **subredes**. Las subredes no se superponen y caben dentro del espacio de la VNet.
- Ventajas de las subredes: **usar mejor las IP**, **asegurarlas por separado** (NSG) y **agrupar servicios** (web, app, datos). No "ahorran costos" ni "hacen más rápidas las VMs".
- Cálculo: /16 = 2^16 = **65.536** IP. Una /24 = 256, pero Azure reserva 5 por subred → **251 asignables** (el PDF se equivoca con 256).

## NSG (grupo de seguridad de red): filtra por puerto e IP

- Se asocia a una **subred** o a una **NIC** (una VM). Reglas de entrada y de salida.
- **Número de prioridad más bajo = se evalúa primero** (100 antes que 200). La primera regla que coincide decide; el resto no se mira.
- Si hay NSG en la subred y en la NIC, **los dos deben permitir** el tráfico. No se pone NSG en la GatewaySubnet (no está en el PDF).
- Que la VM se vea desde Internet por HTTPS / RDP / SSH → regla de entrada **443 / 3389 / 22** (y una IP pública o un balanceador delante). **Trampa:** Traffic Manager o Front Door balancean, no abren puertos.

## Conectar redes

| Si la pregunta dice… | Respuesta | No confundir con |
|---|---|---|
| VNet ↔ VNet, misma u otra región, por la red de Microsoft | **VNet peering** (no transitivo; sin CIDR superpuestos) | VPN Gateway |
| Oficina ↔ Azure por Internet, túnel cifrado | **VPN Gateway sitio a sitio (S2S)** | ExpressRoute |
| Un trabajador remoto desde su laptop | **VPN punto a sitio (P2S)** | S2S |
| Línea privada y dedicada, **sin pasar por Internet** | **ExpressRoute** | VPN Gateway |

- Peering A–B y B–C **no** conecta A con C: hay que emparejar A con C.
- Local ↔ Azure necesita 2 cosas: **una VNet + un VPN Gateway** en esa VNet.
- Piezas de una VPN S2S (túnel IPsec): **dispositivo VPN local** + **VPN Gateway** (puerta de enlace de red virtual) + **GatewaySubnet** + el **túnel cifrado**. **Trampa** (la fallaste 2 veces): "grupo de VMs en el backend" es de Load Balancer, no de VPN.

## Repartir el tráfico

| Servicio | Alcance y capa | Si la pregunta dice… |
|---|---|---|
| **Load Balancer** | Regional, **capa 4** (TCP/UDP) | "repartir equitativamente entre VMs" |
| **Application Gateway** | Regional, **capa 7** (HTTP): rutas URL, WAF, terminación SSL | "/images a unos servidores, /video a otros" |
| **Traffic Manager** | Global, **solo DNS** (el tráfico no pasa por él) | "repartir usuarios entre regiones por DNS" |
| **Front Door** | Global, **capa 7**, WAF y CDN (sí es proxy) | "global + HTTP + WAF" |
| **CDN** | Copias en caché en servidores cerca del usuario | "entregar contenido más rápido" |

- Los balanceadores saben a qué servidor enviar con **sondeos de estado** (p. ej., HTTP a /health).
- **Trampa:** la terminación SSL es de **Application Gateway**, no de Load Balancer (el PDF se equivoca).

# Cap. 07 · Almacenamiento (PDF págs. 122–167)

## Qué guarda una cuenta de almacenamiento

| Servicio | Para qué | Si la pregunta dice… |
|---|---|---|
| **Blob** | Objetos no estructurados que se leen por URL (HTTP) | "imágenes en la web", "videos", "backups" |
| **Files** | Carpeta compartida que se monta (SMB; NFS solo Premium) | "unidad de red", "VMs comparten", App Service |
| **Queue** | Mensajes entre componentes, asíncrono | "uno deja tareas y otro las procesa" |
| **Table** | NoSQL clave/valor, barato | "telemetría", "clave/valor" |

- Estructura: **cuenta → contenedor → blob**. Blob de bloque = objetos; append = logs; page = discos de VM.
- Una base de datos **no** es Storage: NoSQL global con escritura en varias regiones = **Cosmos DB**.

## Redundancia (define la durabilidad, no el rendimiento)

| Opción | Copias y dónde | Aguanta |
|---|---|---|
| **LRS** | 3 en 1 centro de datos | Falla de un disco. La más barata |
| **ZRS** | 3 en 3 zonas de la región | Caída de un centro de datos |
| **GRS** | 6: LRS + LRS en la región emparejada | Caída de la región |
| **GZRS** | 6: ZRS + LRS en la región emparejada | Zona y región |

- **RA-** (RA-GRS, RA-GZRS) = puedo **leer** la secundaria sin hacer failover.
- La copia a la secundaria es **asíncrona**: un failover puede perder lo último escrito.
- **Trampa:** la secundaria de GZRS es **LRS**. "Aguantar la caída de un centro de datos sin otra región" → **ZRS**.

## Tipo de cuenta (rendimiento)

- **Standard GPv2**: por defecto, todos los servicios y redundancias, la más barata → "varios tipos + bajo costo".
- **Premium** (SSD), sus 3 límites: **1 servicio por cuenta**, **solo LRS/ZRS**, **más cara** ("pocas regiones": distractor).
- **Block Blobs** = blobs pequeños rápidos (ML) · **File Shares** = Files y NFS (Linux) · **Page Blobs** = discos de VM.

## Niveles de acceso (solo blobs de bloque)

- **Hot** (uso frecuente) · **Cool** (mín. 30 días) · **Cold** (mín. 90) · **Archive** (mín. 180, sin conexión).
- Borrar antes del mínimo = pagas los días que faltan. Archive se **rehidrata** (tarda horas).
- "Lectura inmediata + 90 días + lo más barato" → **Cold**.

## Discos administrados (recurso aparte, solo para VMs)

- HDD < SSD Standard < SSD Premium (32 TB) < **Ultra** (< 1 ms, 64 TB). App Service monta **Files**, no discos.

## Mover y migrar datos

- Línea de comandos, programar copias → **AzCopy**
- Interfaz gráfica instalada, arrastrar y soltar → **Storage Explorer**
- Servidor local como caché de Azure Files → **Azure File Sync** (Arc gestiona servidores, no archivos)
- Muchos TB con conexión lenta, o datos que no pueden ir por Internet → **Data Box**
- Descubrir servidores, dependencias y costos antes de migrar → **Azure Migrate**

# Cap. 08 · Autenticación y autorización (PDF págs. 168–197)

## Conceptos base

- **Autenticación** = ¿quién eres? (demostrar que eres quien dices ser). **Autorización** = ¿qué puedes hacer? (viene después).
- **Microsoft Entra ID** (antes Azure Active Directory) = identidad en la **nube**. **No** es el AD local (AD DS, en servidores propios).
- **Tenant** = instancia de Entra ID de una organización. Un usuario es **miembro de 1** tenant e **invitado en hasta 499** más (500 en total).
- **SSO** = una sola cuenta y un solo inicio de sesión para varias apps.
- **MFA** = factores de **categorías distintas**: algo que sabes, que tienes, que eres (huella). Contraseña + PIN **no** es MFA (los dos "sabes").
- **Sin contraseña**: Windows Hello, Microsoft Authenticator y llaves de seguridad FIDO2.
- **Zero Trust** = "nunca confíes, verifica siempre"; no confía por ubicación. Ventajas: acceso desde cualquier lugar con identidad verificada + frena a los atacantes. Es una estrategia, no un producto.

## Acceso condicional (Entra ID P1)

- Función de Entra ID: reúne **señales** (usuario o grupo, IP/ubicación, dispositivo, aplicación, riesgo) → toma una **decisión** (conceder, conceder pidiendo MFA, **bloquear** = la más restrictiva).
- "¿Puede **iniciar sesión**?" → acceso condicional. "¿Cómo deben ser los **recursos**?" → Azure Policy.
- Exigir MFA a toda la organización → una política de acceso condicional (centralizada).
- **Trampa:** roles que se activan por tiempo y con aprobación = **PIM** (Entra ID P2), no acceso condicional.

## Servicios de identidad: si la pregunta dice…

| Si la pregunta dice… | Respuesta | No confundir con |
|---|---|---|
| Mismas cuentas del AD local en Azure y Microsoft 365 (identidad híbrida) | **Entra Connect** (se instala en local) | Domain Services |
| Supervisar la identidad local con un agente | **Entra Connect Health** | Entra Connect |
| Consultor externo con **su propia cuenta** | **B2B / External ID** (invitado) | Crearle una cuenta nueva |
| Roles poderosos solo cuando se necesitan (just-in-time) | **PIM** | Acceso condicional |
| App moderna con OAuth 2.0 / SAML | **Entra ID + SSO** | AD local + Entra Connect |
| GPO, LDAP, Kerberos/NTLM, todo en la nube, mínimo esfuerzo | **Entra Domain Services** (dominio administrado) | Entra ID solo |
| App NTLM + dominio **actual** + **eliminar lo local** | **Controlador de dominio en una VM de Azure** | Domain Services (dominio nuevo) |
| App NTLM + dominio actual, sin eliminar lo local (elige 2) | **DC en VM de Azure** + **AD local con Entra Connect** | Domain Services |

- **Entra Domain Services** sincroniza en **una sola dirección**: de Entra ID hacia Domain Services. Es un dominio aparte, no extiende el AD local.
- Gestionar usuarios y grupos: **Centro de administración de Microsoft Entra** (entra.microsoft.com).

# Cap. 09 · Seguridad (PDF págs. 198–216)

## Defensa en profundidad (de afuera hacia adentro)

**Física → Identidad y acceso → Perímetro → Red → Proceso → Aplicación → Datos** (los datos, en el centro)

| Si la pregunta dice… | Capa |
|---|---|
| Guardias, cámaras, acceso al edificio (la más externa) | **Física** |
| MFA, acceso condicional, quién entra | **Identidad y acceso** |
| Protección DDoS, firewall en el borde | **Perímetro** |
| NSG que limita el tráfico entre subredes | **Red** |
| Parches del SO de las VMs, puertos cerrados | **Proceso** (hosts) |
| El activo más valioso, la "cámara del tesoro" | **Datos** |

- Idea: si una capa falla, las otras siguen protegiendo.

## Endpoints: llegar a un servicio PaaS (Storage, SQL) sin Internet

| | **Endpoint privado** | **Endpoint de servicio** |
|---|---|---|
| Qué es | Una **NIC con IP privada** del servicio dentro de tu VNet | Acceso optimizado desde **una subred** |
| Alcance | **Un recurso** concreto (esa cuenta, esa base de datos) | El **servicio completo** (todo Storage) |
| Acceso público | **Se puede deshabilitar** | El endpoint público **sigue existiendo** |
| Desde la oficina (VPN / ExpressRoute) | **Sí** llega | **No** |

- La oficina por VPN debe llegar al Storage en privado → **endpoint privado en la VNet a la que llega la VPN** (y deshabilitar el acceso público).
- **Trampa:** Azure **Arc** gestiona servidores fuera de Azure; nunca es conectividad ni endpoints.

## Servicios de seguridad

| Si la pregunta dice… | Respuesta |
|---|---|
| Guardar contraseñas, cadenas de conexión, claves de cifrado y certificados | **Key Vault** (cada app accede solo a lo suyo) |
| Evaluar la postura de seguridad, recomendaciones, alertas; híbrido y multinube | **Microsoft Defender for Cloud** |
| Ver rápido qué tan segura está tu suscripción | **Puntuación de seguridad** (Secure Score) de Defender for Cloud |
| SIEM: reunir registros de toda la empresa (Azure y AWS) y detectar amenazas con IA | **Microsoft Sentinel** |

- Ciclo de Defender for Cloud: **definir políticas → proteger → responder a alertas** (y volver a ajustar).
