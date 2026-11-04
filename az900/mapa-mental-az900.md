---
title: AZ-900
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# AZ-900 · Microsoft Azure Fundamentals

## 2. Cloud computing (págs. 9–29)
### Modelos de despliegue
- Pública
- Privada (==control total + compras el hardware==)
- Híbrida (==no exige tener antes una nube privada==)
### Modelos de servicio
- IaaS (==tú: SO, apps, datos · ej.: VMs, DC en VM==)
- PaaS (==tú: app y datos · ej.: App Service, SQL Database==)
- SaaS (==tú: solo datos y usuarios · ej.: Microsoft 365, Exchange==)
- Responsabilidad compartida: datos, cuentas e identidades son **siempre** del cliente
### Ventajas
- Alta disponibilidad (==depende del SLA, no de la ubicación==)
- Escalabilidad (vertical = más grande · horizontal = más instancias)
- Elasticidad (==escala sola según la demanda==)
- Agilidad (==desplegar rápido cuando cambian los requisitos==)
- Confiabilidad · Previsibilidad (costos y rendimiento)
- Seguridad y gobernanza (entornos estandarizados)
- Gestión (==cómo interactúas, gestionas e implementas==)
- Baja latencia / alcance global (==rápido desde cualquier lugar==)
### Precios
- CapEx (compra inicial) vs **OpEx** (pago por uso)
- Basado en consumo

## 3. Arquitectura y servicios (págs. 30–47)
### Infraestructura física
- Región → centros de datos
- Zonas de disponibilidad (==mínimo 3 por región==)
- Pares de regiones (==misma geografía · Brazil South → South Central US==)
- Regiones soberanas (Gov, China)
### Jerarquía
- Grupo de administración (==1 padre, varios hijos==)
- Suscripción (==facturación y límite de acceso · 1 sola confía en 1 tenant==)
- Grupo de recursos (==borrarlo borra todo su contenido==)
- Recurso
- Políticas y roles se **heredan hacia abajo**

## 4. Herramientas (págs. 48–58)
- Portal · CLI (`az`) · PowerShell (`New-AzVM`) · Cloud Shell
- Plantillas ARM / Bicep (==IaC · Blueprints es otra cosa y se retira==)
- Azure Arc (==gestionar servidores locales y de otras nubes desde Azure==)
- Azure Advisor (==5 categorías: costo, seguridad, confiabilidad, excelencia operativa, rendimiento==)

## 5. Computación (págs. 59–100)
### Servicios
- Máquinas virtuales (IaaS)
- VM Scale Sets (==VMs idénticas que escalan==)
- App Service (PaaS web)
- Container Instances (ACI · un contenedor rápido)
- AKS (==orquestar microservicios / Kubernetes==)
- Functions (==serverless, por evento, escala solo==)
- Virtual Desktop (==apps Windows desde Mac/Android==)
### ¿Qué falla? → disponibilidad
- Rack / actualización → **conjunto de disponibilidad**
- Centro de datos completo → **zonas de disponibilidad** (==ZRS es de Storage, no de VMs==)
- Región → **región emparejada**
### Opciones de compra
- Pago por uso · Plan de ahorro · Reservada (1–3 años)
- Spot (==interrumpible, hasta ~90% menos==)
- Host dedicado · Reserva de capacidad (==no es descuento==)

## 6. Redes (págs. 101–121)
### VNet
- Subredes (==5 IPs reservadas: /24 = 251 asignables==)
- NSG (==prioridad: número menor gana · subred y NIC deben permitir==)
### Los 3 tramos
- Tramo 1 · fuera de Azure → VNet
  - VPN Gateway S2S (==oficina, túnel IPsec por Internet==)
    - Dispositivo VPN + gateway de red virtual + **GatewaySubnet**
  - VPN P2S (==un portátil==)
  - ExpressRoute (==línea privada, sin Internet==)
- Tramo 2 · VNet ↔ VNet
  - Peering (==no transitivo · global entre regiones==)
- Tramo 3 · VNet → PaaS
  - Endpoint de servicio (==solo una subred, el servicio sigue público==)
  - Endpoint privado (==IP privada en tu VNet, se puede cerrar el acceso público==)
### Balanceo
- Load Balancer (==capa 4, reparte entre VMs==)
- Application Gateway (==capa 7, rutas /images, WAF, regional==)
- Traffic Manager (==global, solo DNS==)
- Front Door (==global, capa 7, WAF, CDN==)
- Azure DNS

## 7. Almacenamiento (págs. 122–167)
### Servicios de la cuenta
- Blob (==imágenes y archivos para la web, backups==)
- Files (==unidad de red SMB para varios PCs==)
- Queue (mensajes) · Table (NoSQL clave-valor)
- Disk Storage (==discos de VM, recurso aparte · Ultra = 64 TB, menos de 1 ms==)
### Tipos de cuenta
- Standard GPv2 (==varios tipos + costos optimizados==)
- Premium Block Blobs (==blobs pequeños, rápidos==)
- Premium Page Blobs (==discos de VM==)
- Premium File Shares
- Premium = solo LRS / ZRS
### Redundancia
- LRS (3 copias, 1 centro de datos)
- ZRS (3 zonas)
- GRS (LRS + LRS en la región par)
- GZRS (ZRS + LRS en la región par)
- RA- (==leer la secundaria==)
### Niveles de acceso
- Hot · Cool (30 d) · Cold (90 d) · Archive (180 d, ==rehidratar horas==)
### Mover datos
- AzCopy (CLI) · Storage Explorer (GUI) · File Sync
- Data Box (==demasiados datos para la red==) · Azure Migrate

## 8. Identidad (págs. 168–197)
### Conceptos
- Autenticación (==quién eres==) vs Autorización (==qué puedes hacer==)
- MFA (sabes / tienes / eres · ==contraseña + PIN no es MFA==)
- SSO · Passwordless
- Acceso condicional (==señales → decisión · MFA gradual y centralizada==)
### Servicios
- Microsoft Entra ID (antes Azure AD)
- Entra Connect (==se instala en local, sincroniza==)
- Entra Domain Services (==GPO + LDAP sin DCs propios==)
- External ID: B2B (invitados) · B2C (clientes)
- PIM (==acceso just-in-time · P2==)
### App que migra: 4 casos
- App moderna (OAuth) → Entra ID + SSO
- AD clásico, dominio nuevo, todo en la nube → Entra Domain Services
- AD clásico, dominio actual, sin nada local → DC en VM
- AD clásico, dominio actual, se queda lo local → DC en VM + AD local con Connect

## 9. Seguridad (págs. 198–216)
- Zero Trust (==verificar siempre, mínimo privilegio, asumir brecha==)
- Defensa en profundidad (==capas==)
- Defender for Cloud (==Secure Score = postura de seguridad · también AWS y local==)
- Microsoft Sentinel (SIEM / SOAR)
- Key Vault (secretos, claves, certificados)
- Azure Firewall · DDoS Protection

## 10. Gestión y gobernanza (págs. 217–247)
### Gobernanza
- RBAC (==principal + rol + ámbito · autorización==)
- Azure Policy (==imponer y auditar reglas · varias suscripciones==)
- Bloqueos (CanNotDelete / ReadOnly · ==le ganan al Propietario==)
- Etiquetas (==no se heredan, salvo con Policy==)
- Microsoft Purview · Service Trust Portal (==documentación de cumplimiento de Microsoft==)
### Monitorización
- Azure Monitor (métricas + logs)
  - Log Analytics + KQL (==tendencias de muchas VMs en el tiempo==)
  - Application Insights (==la app==)
  - Alertas + grupo de acción (==CPU > 90 % durante 5 min==)
- Service Health (==interrupciones de Azure que te afectan==)
- Resource Health (==tu recurso==)

## 11. Precios (págs. 248–277)
- Factores: tipo, región, consumo, salida de datos (==entrada gratis==)
- Calculadora TCO (==antes: local vs Azure==)
- Calculadora de precios (==antes de crear==)
- Cost Management + presupuestos y alertas
- SLA (==mayor con zonas · servicio en versión preliminar sin SLA==)
- VM eliminada (==los discos huérfanos se siguen cobrando==)
