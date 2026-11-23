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
