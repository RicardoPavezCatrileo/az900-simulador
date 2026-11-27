# Guía Visual Azure Storage Account: genera un .drawio editable (A2 horizontal) con íconos de Azure.
# Diseño del usuario (docs/Guía visual de Azure Storage Account.png) con 4 correcciones:
# niveles solo en Block blobs, secundaria de GZRS = LRS, NFS solo Premium, y Disk fuera de la cuenta.
# Uso: python tools/guia-storage-drawio.py docs/guia-visual-azure-storage.drawio
import sys
from html import escape

W, H = 1684, 1190
AZ, NAR, ROJO, NAVY = "#0a5fb4", "#d9620f", "#d92b2b", "#0b2a5b"
PRI, SEC = "#0d9488", "#4f6fae"
ICO = dict(cuenta="storage/Storage_Accounts", block="general/Blob_Block", page="general/Blob_Page",
           files="general/Storage_Azure_Files", queue="general/Storage_Queue", table="general/Table",
           disk="compute/Disks", vm="compute/Virtual_Machine")
celdas = []


def tinte(c, a):
    r, g, b = (int(c[i:i + 2], 16) for i in (1, 3, 5))
    return "#%02x%02x%02x" % tuple(round(255 - (255 - v) * a) for v in (r, g, b))


def caja(x, y, w, h, html="", tam=12, color="#14212e", fondo="none", borde="none", alin="left", valin="top",
         ancho=1.2, redondo=6, rayas=False, pad=6, forma="rounded=1"):
    st = (f"{forma};arcSize={redondo};whiteSpace=wrap;html=1;fontFamily=Segoe UI;fontSize={tam};align={alin};"
          f"verticalAlign={valin};spacingLeft={pad};spacingRight={pad};spacingTop=2;spacingBottom=2;"
          f"fillColor={fondo};strokeColor={borde};strokeWidth={ancho};fontColor={color};")
    if rayas:
        st += "dashed=1;dashPattern=6 4;"
    celdas.append(f'<mxCell id="c{len(celdas)}" value="{escape(html)}" style="{st}" vertex="1" parent="1">'
                  f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')


def icono(x, y, n, t=40):
    st = f"image;aspect=fixed;html=1;points=[];image=img/lib/azure2/{ICO[n]}.svg;"
    celdas.append(f'<mxCell id="c{len(celdas)}" value="" style="{st}" vertex="1" parent="1">'
                  f'<mxGeometry x="{x}" y="{y}" width="{t}" height="{t}" as="geometry"/></mxCell>')


def flecha(x1, y1, x2, y2, color, ancho=2.4):
    st = f"endArrow=block;endFill=1;endSize=4;html=1;strokeWidth={ancho};strokeColor={color};"
    celdas.append(f'<mxCell id="c{len(celdas)}" value="" style="{st}" edge="1" parent="1"><mxGeometry relative="1" '
                  f'as="geometry"><mxPoint x="{x1}" y="{y1}" as="sourcePoint"/><mxPoint x="{x2}" y="{y2}" '
                  f'as="targetPoint"/></mxGeometry></mxCell>')


def cil(x, y, color):
    caja(x, y, 14, 20, forma="shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=4", fondo=color, borde=tinte(color, .6))


def li(*items, col=None):
    return "<br>".join(f"<span style='color:{col or AZ}'>•</span> {t}" for t in items)


def seccion(x, y, w, h, n, titulo, desc, borde, fondo, wt=420):
    caja(x, y, w, h, fondo=fondo, borde=borde, ancho=1.6, redondo=2)
    caja(x + 8, y + 6, 30, 30, f"<b>{n}</b>", tam=17, color="#ffffff", fondo=ROJO, alin="center", valin="middle",
         forma="ellipse", pad=0)
    caja(x + 44, y + 5, wt, 30, f"<b>{titulo}</b>", tam=18, color=AZ if n != "5" else "#14212e", valin="middle")
    if desc:
        caja(x + 44 + wt, y + 8, w - wt - 54, 26, desc, tam=11.5, color="#3b4a5a", valin="middle")


def tabla(x, y, anchos, alto_cab, alto_fila, cab, filas, fondo_cab="#dbe8f7", col1=None, tam=11.5):
    xs = [x]
    for a in anchos:
        xs.append(xs[-1] + a)
    for i, t in enumerate(cab):
        caja(xs[i], y, anchos[i], alto_cab, f"<b>{t}</b>", tam=tam, fondo=fondo_cab, borde="#b9c8d8", alin="center",
             valin="middle", redondo=0, pad=3, color=NAVY)
    for r, fila in enumerate(filas):
        yy = y + alto_cab + r * alto_fila
        for i, t in enumerate(fila):
            f = (col1[r] if col1 else "#eef4fb") if i == 0 else ("#ffffff" if r % 2 == 0 else "#f6f9fc")
            caja(xs[i], yy, anchos[i], alto_fila, t, tam=tam, fondo=f, borde="#c9d6e3", alin="center",
                 valin="middle", redondo=0, pad=3)


# ── Encabezado ──
caja(0, 0, W, 84, fondo=NAVY, redondo=0)
icono(22, 12, "cuenta", 60)
caja(96, 6, 1180, 44, "<b>Guía visual de <span style='color:#4fc3f7'>Azure Storage Account</span> · "
     "<span style='color:#ffd54f'>Versión 1.0</span></b>", tam=30, color="#ffffff", valin="middle")
caja(96, 50, 1180, 26, "Los servicios de almacenamiento, los tipos de cuenta, los tipos de disco y la redundancia en una sola guía",
     tam=15, color="#e3f2fd", valin="middle")
caja(1296, 8, 378, 68, f"<b style='color:{AZ}'>Puntos clave para el AZ-900</b><br>"
     "<b style='color:#1f8a4c'>①</b> Tipo de cuenta (rendimiento)<br><b style='color:#1f8a4c'>②</b> Servicio o tipo de disco "
     "(qué guardas) · <b style='color:#1f8a4c'>③</b> Redundancia", tam=12, fondo="#ffffff", borde="#ffffff", redondo=8,
     valin="middle")

# ── 1 · Servicios ──
seccion(10, 92, 1664, 440, "1", "Servicios de almacenamiento", "Una cuenta de almacenamiento agrupa 4 servicios, "
        "accesibles por API REST (https://&lt;cuenta&gt;.&lt;servicio&gt;.core.windows.net). Los discos de VM son un recurso aparte.",
        "#9cc6ee", "#f7fbff", wt=300)
caja(18, 132, 1300, 394, "", borde=AZ, ancho=2.2, redondo=1)
icono(24, 136, "cuenta", 18)
caja(44, 134, 600, 22, f"<b>Storage Account</b> · 4 servicios adentro", tam=12.5, color=AZ, valin="middle")
caja(1326, 132, 340, 394, "", borde="#7a4fc4", ancho=2.2, redondo=1, rayas=True)
caja(1334, 134, 330, 22, "<b>Fuera de la cuenta</b> · disco administrado (recurso aparte)", tam=12.5, color="#7a4fc4",
     valin="middle")

COLS = [  # x, w, ícono, nombre, subtítulo, viñetas, ejemplos
    (26, 285, "table", "Azure Table Storage", "Datos NoSQL de acceso<br>rápido y flexible",
     ["Datos NoSQL (clave/valor), sin esquema.", "Escalable y de bajo costo.", "Simple y de una región."],
     ["Datos de usuario.", "Datos de telemetría.", "Información de dispositivos."]),
    (317, 285, "queue", "Azure Queue Storage", "Mensajería para<br>comunicación asíncrona",
     ["Almacena mensajes.", "Comunica partes de una aplicación.", "Desacopla componentes."],
     ["Procesamiento en segundo plano.", "Pedidos que otro proceso atiende después.", "Flujos de trabajo distribuidos."]),
    (608, 420, "block", "Azure Blob Storage", "Grandes cantidades de datos<br>(texto o binarios)", None, None),
    (1034, 280, "files", "Azure Files", "Recursos compartidos<br>de archivos (SMB y NFS*)",
     ["Carpetas compartidas en la nube.", "SMB en Standard y Premium;<br>&nbsp;&nbsp;<b>NFS solo en Premium</b>.",
      "Azure File Sync con tu servidor local."],
     ["Compartir archivos entre VMs.", "Unidad de red Z: de la oficina.", "Migrar servidores de archivos."]),
    (1334, 324, "disk", "Azure Disk Storage", "Almacenamiento en bloque<br>para máquinas virtuales",
     ["Discos administrados de UNA VM.", "Optimizados para E/S (IOPS).", "Por dentro son page blobs, pero<br>&nbsp;&nbsp;Azure maneja la cuenta."],
     ["Disco del sistema operativo.", "Discos de datos de aplicaciones.", "Bases de datos en VM (SSD Premium/Ultra)."]),
]
for x, w, ic, n, sub, vin, ej in COLS:
    icono(x + w / 2 - 22, 160, ic, 44)
    caja(x, 206, w, 22, f"<b>{n}</b>", tam=16.5, color=AZ, alin="center", valin="middle")
    caja(x, 228, w, 36, f"<b>{sub}</b>", tam=12.5, color=NAR, alin="center", valin="middle")
    if ej:
        caja(x + 4, 268, w - 8, 116, li(*vin), tam=12.5, fondo="#e8f2fc", borde="#c4dcf3", valin="middle")
        caja(x + 4, 390, w - 8, 128, "<b>Ejemplos:</b><br>" + li(*ej, col=NAR), tam=12.5, fondo="#fff6d6",
             borde="#f0dc9a", valin="middle")
# Blob: tipos y niveles
x0 = 612
caja(x0, 268, 412, 72, li("Objetos y archivos, leídos por URL.", "Escalable y económico.",
                          "Ideal para datos no estructurados."), tam=12.5, fondo="#e8f2fc", borde="#c4dcf3", valin="middle")
caja(x0, 344, 412, 18, "<b>Tipos de blob</b>", tam=12, color="#ffffff", fondo="#5b5fc7", alin="center", valin="middle",
     redondo=0)
TB = [("block", "Block Blob", "Archivos: imágenes,<br>videos, documentos.<br><b>Único con niveles.</b>", "#e6f4ea"),
      (None, "Append Blob", "Solo se agrega al final:<br>logs y datos de<br>auditoría.", "#f1ebfb"),
      ("page", "Page Blob", "Lectura/escritura<br>aleatoria (512 B):<br><b>discos VHD</b>.", "#eaf6e8")]
for i, (ic, n, d, f) in enumerate(TB):
    xx = x0 + i * 139
    caja(xx, 364, 134, 92, "", fondo=f, borde="#c9d6e3")
    if ic:
        icono(xx + 6, 368, ic, 22)
    caja(xx + (30 if ic else 4), 366, 100, 24, f"<b>{n}</b>", tam=12.5, color=AZ, valin="middle", pad=2)
    caja(xx + 2, 392, 130, 62, d, tam=11, alin="center", valin="middle", pad=2)
caja(x0, 460, 412, 18, "<b>Niveles de acceso (solo Block Blobs)</b>", tam=12, color="#ffffff", fondo="#5b5fc7",
     alin="center", valin="middle", redondo=0)
NIV = [("Hot", "(Frecuente)", "#e8432f"), ("Cool", "(Ocasional)", "#1e88e5"), ("Cold", "(Poco frecuente)", "#1a3f9c"),
       ("Archive", "(Archivo)", "#7e57c2")]
for i, (n, d, c) in enumerate(NIV):
    caja(x0 + i * 104, 481, 100, 37, f"<b>{n}</b><br>{d}", tam=11.5, color="#ffffff", fondo=c, alin="center",
         valin="middle", redondo=10, pad=2)

# ── 2 · Tipos de cuenta ──
seccion(10, 540, 500, 262, "2", "Tipos de cuenta (rendimiento)", "", "#f2a0a0", "#fff8f8", wt=440)
caja(18, 572, 484, 20, "Define la velocidad, la latencia y qué servicio admite la cuenta.", tam=12, color="#3b4a5a",
     alin="center", valin="middle")
caja(18, 596, 226, 198, "", fondo="#eef4fb", borde="#b9d3ee")
icono(26, 602, "cuenta", 34)
caja(64, 598, 178, 40, "<b>Standard</b><br>(Uso general v2 · GPv2)", tam=13, color=AZ, valin="middle")
caja(22, 642, 218, 150, li("Opción por defecto · HDD.", "Los 4 servicios en una cuenta.", "Niveles Hot/Cool/Cold/Archive.",
                           "Todas las redundancias (GRS, GZRS…).", "El menor costo.", "Files solo por SMB."), tam=12)
caja(250, 596, 252, 198, "", fondo="#f3eefc", borde="#cbb8ef")
icono(258, 602, "cuenta", 34)
caja(296, 598, 204, 40, "<b>Premium</b><br>(SSD · alto rendimiento)", tam=13, color="#6a3fc0", valin="middle")
caja(254, 642, 244, 66, li("1 cuenta = 1 servicio (lleva su nombre).", "Baja latencia · solo LRS o ZRS.",
                           "Sin niveles · ✕ Queue ✕ Table.", col="#6a3fc0"), tam=11.5)
PRE = [("block", "Premium<br>Block Blobs", "objetos, IoT"), ("files", "Premium<br>File Shares", "SMB y NFS"),
       ("page", "Premium<br>Page Blobs", "discos VHD")]
for i, (ic, n, d) in enumerate(PRE):
    xx = 256 + i * 81
    icono(xx + 28, 712, ic, 22)
    caja(xx, 735, 78, 56, f"<b>{n}</b><br><span style='color:#5a6b7c'>{d}</span>", tam=10.5, color="#6a3fc0",
         alin="center", valin="top", pad=1)

# ── 3 · Tipos de datos y acceso ──
seccion(518, 540, 470, 262, "3", "Tipos de datos y acceso", "", "#9fd8b5", "#f6fcf8", wt=420)
caja(526, 572, 454, 20, "Qué servicio usar y cómo se accede a los datos.", tam=12, color="#3b4a5a", alin="center",
     valin="middle")
tabla(526, 596, [104, 92, 152, 106], 24, 34, ["Servicio", "Tipo de datos", "Ejemplos", "Cómo se accede"], [
    ["<b>Table</b>", "NoSQL<br>(clave/valor)", "Datos de usuario,<br>telemetría", "API REST"],
    ["<b>Queue</b>", "Mensajes", "Procesos en<br>segundo plano", "API REST"],
    ["<b>Blob</b>", "Objetos y<br>archivos", "Imágenes, videos,<br>documentos, logs", "URL · API REST"],
    ["<b>Files</b>", "Archivos<br>compartidos", "Carpetas SMB/NFS", "SMB / NFS<br>(montar unidad)"],
    ["<b>Disk</b> <span style='color:#7a4fc4'>(fuera)</span>", "Bloques<br>para VM", "Disco del SO<br>y de datos",
     "Conectado<br>a la VM"]], tam=11)

# ── 4 · Tipos de disco ──
seccion(996, 540, 678, 262, "4", "Tipos de disco en Azure Disk Storage (para VM)", "", "#c3b2ec", "#faf8ff", wt=600)
caja(1004, 572, 662, 20, "Estándar / Premium aquí es el <b>tipo de disco</b>, no el tipo de cuenta. Cada uno sirve para otra carga.",
     tam=12, color="#3b4a5a", alin="center", valin="middle")
tabla(1004, 596, [100, 104, 80, 76, 80, 222], 30, 41,
      ["Tipo de disco", "Tecnología", "Rendimiento", "Latencia", "Tamaño máx.<br>por disco", "Uso recomendado"], [
          ["<b>HDD Estándar</b>", "Disco duro<br>magnético", "Bajo", "Mayor", "32 TiB",
           "Pruebas, backups, poco uso.<br>El más barato · SLA VM sola 95 %"],
          ["<b>SSD Estándar</b>", "SSD", "Moderado", "Baja", "32 TiB", "Web y servidores con poco uso.<br>SLA VM sola 99,5 %"],
          ["<b>SSD Premium</b>", "SSD", "Alto", "Muy baja", "32 TiB", "Producción, bases de datos.<br>SLA VM sola 99,9 %"],
          ["<b>Ultra Disk</b>", "SSD de alto<br>rendimiento<br>(ajustable)", "Muy alto", "&lt; 1 ms", "64 TiB",
           "Cargas extremas (SAP HANA).<br><b>Solo disco de datos</b>, no del SO"]],
      col1=["#e9edf2", "#dcecfb", "#e5dcfa", "#d7f0e6"], tam=11)

# ── 5 · Redundancia ──
seccion(10, 810, 890, 370, "5", "Opciones de redundancia (durabilidad)", "Cuántas copias se guardan y dónde.",
        "#f0b0a0", "#fffaf8", wt=400)
RED = [("LRS", "(Localmente redundante)", ["3 copias en un mismo<br>centro de datos.", "11 nueves.", "La más económica."], False),
       ("ZRS", "(Con redundancia de zona)", ["3 copias en 3 zonas<br>de la misma región.", "12 nueves.", "Sobrevive a una zona."], False),
       ("GRS", "(Geo-redundante)", ["LRS en la primaria.", "LRS en la región<br>emparejada (6 copias).", "16 nueves · desastre<br>regional."], False),
       ("RA-GRS", "(GRS con lectura<br>en la secundaria)", ["Igual que GRS.", "Puedes <b>leer</b> la<br>secundaria (-secondary).", "Lectura global."], True),
       ("GZRS", "(Geo-redundante<br>con zonas)", ["ZRS en la primaria.", "<b>LRS</b> en la emparejada<br>(no ZRS).", "16 nueves · zona y<br>región."], False),
       ("RA-GZRS", "(GZRS con lectura<br>en la secundaria)", ["Igual que GZRS.", "Puedes <b>leer</b> la<br>secundaria.", "Máxima durabilidad<br>+ lectura."], True)]
for i, (n, sub, vin, ra) in enumerate(RED):
    x = 18 + i * 146
    if ra:
        caja(x - 2, 846, 146, 290, borde=ROJO, ancho=2.2, redondo=3)
    caja(x, 848, 142, 22, f"<b>{n}</b>", tam=15, color=AZ, alin="center", valin="middle")
    caja(x, 870, 142, 30, sub, tam=10.5, color="#3b4a5a", alin="center", valin="middle", pad=1)
    y = 912
    geo = n in ("GRS", "RA-GRS", "GZRS", "RA-GZRS")
    zonas = "Z" in n
    if not geo:
        if zonas:
            for z in range(3):
                caja(x + 12 + z * 42, y - 4, 34, 32, borde=PRI, rayas=True, redondo=4)
                cil(x + 22 + z * 42, y + 2, PRI)
        else:
            caja(x + 24, y - 4, 94, 32, borde=PRI, redondo=4)
            for c in range(3):
                cil(x + 36 + c * 24, y + 2, PRI)
    else:
        if zonas:
            for z in range(3):
                caja(x + 2 + z * 20, y - 4, 18, 32, borde=PRI, rayas=True, redondo=3)
                cil(x + 4 + z * 20, y + 2, PRI)
        else:
            caja(x + 2, y - 4, 58, 32, borde=PRI, redondo=4)
            for c in range(3):
                cil(x + 5 + c * 18, y + 2, PRI)
        flecha(x + 62, y + 12, x + 80, y + 12, ROJO)
        caja(x + 82, y - 4, 58, 32, borde=SEC, redondo=4)
        for c in range(3):
            cil(x + 85 + c * 18, y + 2, SEC)
    caja(x, 946, 142, 16, "primaria → emparejada" if geo else ("3 zonas · 1 región" if zonas else "1 centro de datos"),
         tam=9.5, color="#5a6b7c", alin="center", valin="middle", pad=0)
    caja(x + 2, 966, 138, 166, li(*vin, col=PRI), tam=11.2, valin="top", pad=3)
caja(18, 1140, 874, 34, "<b style='color:#7e57c2'>ⓘ RA = Read Access:</b> RA-GRS y RA-GZRS permiten leer desde la región "
     "secundaria aunque la primaria esté disponible. La copia a la secundaria es <b>asíncrona</b> "
     "(Brazil South → South Central US). <b>Premium y discos:</b> solo LRS o ZRS.", tam=11, fondo="#f3eefc",
     borde="#d6c6f2", valin="middle")

# Niveles de acceso
caja(908, 810, 370, 370, fondo="#fffbea", borde="#ecd27a", ancho=1.6, redondo=2)
caja(916, 814, 354, 24, "<b>Niveles de acceso en Azure Blob Storage</b>", tam=15, color=AZ, valin="middle")
caja(916, 838, 354, 30, "Optimizan el costo según cada cuánto <b>lees</b> el dato (no la velocidad).", tam=11.5,
     color="#3b4a5a", valin="middle")
tabla(916, 872, [64, 74, 120, 96], 36, 46, ["Nivel", "Acceso<br>inmediato", "Frecuencia<br>de consulta",
                                             "Retención<br>mínima"], [
    ["<b>Hot</b>", "<span style='color:#1f8a4c'>✔ Sí</span>", "Frecuente", "Sin mínimo"],
    ["<b>Cool</b>", "<span style='color:#1f8a4c'>✔ Sí</span>", "Poco frecuente", "30 días"],
    ["<b>Cold</b>", "<span style='color:#1f8a4c'>✔ Sí</span>", "Muy poco frecuente", "90 días"],
    ["<b>Archive</b>", f"<span style='color:{ROJO}'>✘ No</span>", "Casi nunca;<br>rehidratar (horas)", "180 días"]],
      fondo_cab="#f7e7a8", col1=["#fde4df", "#dcecfb", "#dde3f6", "#ece4f8"], tam=11)
caja(916, 1100, 354, 72, li("<b>Solo Block blobs</b> (no Append ni Page).", "<b>Solo cuentas Standard</b> (Premium no tiene niveles).",
                            "Archive está fuera de línea: hay que rehidratarlo a Hot, Cool o Cold (hasta 15 h)."),
     tam=11, fondo="#ffffff", borde="#ecd27a", valin="middle")

# Puntos clave y errores comunes
caja(1286, 810, 388, 370, fondo="#fff1f1", borde="#f0a0a0", ancho=1.6, redondo=2)
caja(1294, 816, 30, 30, "<b>✕</b>", tam=17, color="#ffffff", fondo=ROJO, alin="center", valin="middle", forma="ellipse", pad=0)
caja(1330, 814, 340, 34, "<b>Puntos clave y errores comunes en el AZ-900</b>", tam=14.5, color=ROJO, valin="middle")
ERR = ["No confundas Standard/Premium de la <b>cuenta</b> con Estándar/Premium del <b>disco</b>.",
       "Los <b>discos administrados</b> no viven en la cuenta: son un recurso aparte (por dentro, page blobs).",
       "Pregunta por <b>tipo de disco</b> → HDD, SSD, Premium, Ultra. Por <b>cuenta</b> + discos → Premium Page Blobs.",
       "Niveles Hot/Cool/Cold/Archive: <b>solo Block blobs</b> de Standard.",
       "<b>NFS</b> solo en Premium File Shares; Standard es solo SMB.",
       "<b>GZRS</b>: la secundaria es LRS, no ZRS.",
       "<b>Queue</b> y <b>Table</b> no tienen Premium.",
       "<b>Ultra Disk</b> = lo más rápido (&lt; 1 ms), solo disco de datos.",
       "La redundancia define la <b>durabilidad</b>, no el rendimiento."]
caja(1294, 852, 374, 322, "<br>".join(f"<span style='color:{ROJO}'><b>✖</b></span> {t}" for t in ERR), tam=11.6,
     valin="top", pad=4)

xml = (f'<mxfile host="az900-simulador" agent="tools/guia-storage-drawio.py"><diagram name="Guía Visual Azure Storage Account" '
       f'id="guia"><mxGraphModel dx="{W}" dy="{H}" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" '
       f'fold="1" page="1" pageScale="1" pageWidth="{W}" pageHeight="{H}" background="#ffffff" math="0" shadow="0"><root>'
       f'<mxCell id="0"/><mxCell id="1" parent="0"/>{"".join(celdas)}</root></mxGraphModel></diagram></mxfile>')
open(sys.argv[1], "w", encoding="utf-8").write(xml)
print(len(celdas), "celdas ->", sys.argv[1])
