# Guía Visual Azure Storage Account: genera un .drawio editable (A2 horizontal) con íconos de Azure.
# Uso: python tools/guia-storage-drawio.py docs/guia-visual-azure-storage.drawio
# Exportar: draw.io.exe -x -f png -s 4 -o docs/guia-visual-azure-storage.png docs/guia-visual-azure-storage.drawio  (y -f pdf)
import sys
from html import escape

W, H = 1684, 1190
C = dict(blob="#1f8a4c", files="#d9730d", queue="#c2357a", table="#0a6fc2", disk="#7a4fc4",
         std="#0a6fc2", pre="#7a4fc4", gris="#5a6b7c", bad="#c2352b", ink="#14212e", rbr="#0d9488")
ICO = dict(cuenta="storage/Storage_Accounts", blob="general/Blob_Block", files="general/Storage_Azure_Files",
           queue="general/Storage_Queue", table="general/Table", disk="compute/Disks", vm="compute/Virtual_Machine")
celdas = []


def tinte(hexc, a):
    """Mezcla el color con blanco (a = proporción del color)."""
    r, g, b = (int(hexc[i:i + 2], 16) for i in (1, 3, 5))
    return "#%02x%02x%02x" % tuple(round(255 - (255 - v) * a) for v in (r, g, b))


def caja(x, y, w, h, html, color=C["ink"], fondo=None, borde=None, rayas=False, tam=12, alin="left",
         valin="top", ancho=1.4, redondo=8, texto=None, der=6):
    st = (f"rounded=1;arcSize={redondo};whiteSpace=wrap;html=1;fontFamily=Segoe UI;fontSize={tam};"
          f"align={alin};verticalAlign={valin};spacingLeft=8;spacingRight={der};spacingTop=4;"
          f"fillColor={fondo or 'none'};strokeColor={borde or 'none'};strokeWidth={ancho};fontColor={texto or C['ink']};")
    if rayas:
        st += "dashed=1;dashPattern=6 4;"
    celdas.append(f'<mxCell id="c{len(celdas)}" value="{escape(html)}" style="{st}" vertex="1" parent="1">'
                  f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')


def icono(x, y, n, tam=40):
    st = f"image;aspect=fixed;html=1;points=[];image=img/lib/azure2/{ICO[n]}.svg;"
    celdas.append(f'<mxCell id="c{len(celdas)}" value="" style="{st}" vertex="1" parent="1">'
                  f'<mxGeometry x="{x}" y="{y}" width="{tam}" height="{tam}" as="geometry"/></mxCell>')


def flecha(puntos, color, texto=""):
    (x1, y1), *medio, (x2, y2) = puntos
    pts = "".join(f'<mxPoint x="{x}" y="{y}"/>' for x, y in medio)
    st = (f"endArrow=block;endFill=1;html=1;rounded=1;dashed=1;strokeWidth=2;strokeColor={color};"
          f"fontFamily=Segoe UI;fontSize=11;fontColor={color};labelBackgroundColor=#ffffff;")
    celdas.append(f'<mxCell id="c{len(celdas)}" value="{escape(texto)}" style="{st}" edge="1" parent="1">'
                  f'<mxGeometry relative="1" as="geometry"><mxPoint x="{x1}" y="{y1}" as="sourcePoint"/>'
                  f'<mxPoint x="{x2}" y="{y2}" as="targetPoint"/><Array as="points">{pts}</Array></mxGeometry></mxCell>')


# Título
caja(30, 18, 1300, 44, "<b>Guía Visual Azure Storage Account</b>", tam=30, valin="middle")
caja(30, 64, 1620, 26, "Se lee de arriba hacia abajo: <b>① qué guardo</b> → <b>② Standard o Premium</b> → "
     "<b>③ qué más elijo</b> → <b>④ cuántas copias</b>. Mismo color = mismo servicio.", tam=15, texto=C["gris"])

# Filas: etiquetas a la izquierda
FILAS = [(165, 110, "① ¿Qué guardo?", "el servicio"), (295, 250, "② ¿Standard o Premium?", "el rendimiento"),
         (565, 340, "③ ¿Qué más elijo?", "dentro del servicio"), (950, 110, "④ ¿Cuántas copias?", "la redundancia"),
         (1080, 90, "⚠ Lo que confunde", "en el examen")]
for y, h, t, s in FILAS:
    caja(30, y, 150, h, f"<b>{t}</b><br><span style='color:{C['gris']}'>{s}</span>", tam=14, valin="middle",
         fondo="#eef3f8", borde="#d5dee7")

# Marco de la cuenta y de los discos
caja(190, 110, 1070, 815, "", borde=C["std"], ancho=2.4, redondo=2)
icono(200, 117, "cuenta", 30)
caja(234, 114, 900, 36, f"<b>Storage Account (cuenta de almacenamiento)</b> · 4 servicios adentro",
     tam=17, valin="middle", texto=C["std"])
caja(1275, 110, 380, 815, "", borde=C["disk"], ancho=2.4, rayas=True, redondo=2)
caja(1283, 114, 370, 36, "<b>Fuera de la cuenta · Disco administrado</b><br>un recurso aparte: Azure maneja el almacenamiento",
     tam=12, valin="middle", texto=C["disk"])

X = [200, 465, 730, 995]
CW = 255
DX, DW = 1287, 356

# ① Servicios
SERV = [("blob", "Blob", "Objetos: fotos, videos, documentos, backups. Se leen por <b>URL</b>.", "no estructurado · URL"),
        ("files", "Files", "Carpeta compartida que se <b>monta</b> como unidad de red (Z:).", "compartido · SMB · NFS"),
        ("queue", "Queue", "Mensajes entre partes de una aplicación.", "cola · desacoplar"),
        ("table", "Table", "Datos NoSQL clave-valor, simples y baratos.", "NoSQL · clave-valor")]
for x, (k, n, d, cl) in zip(X, SERV):
    caja(x, 165, CW, 110, f"<b style='font-size:18px;color:{C[k]}'>{n}</b><br>{d}<br>"
         f"<span style='font-family:Consolas;font-size:11px;color:{C['gris']}'>{cl}</span>",
         fondo=tinte(C[k], .08), borde=C[k], ancho=2, tam=13, der=52)
    icono(x + CW - 48, 172, k, 38)
caja(DX, 165, DW, 110, f"<b style='font-size:18px;color:{C['disk']}'>Disk</b><br>Disco del sistema operativo o de datos "
     f"de <b>UNA</b> VM.<br><span style='font-family:Consolas;font-size:11px;color:{C['gris']}'>VM · IOPS · latencia</span>",
     fondo=tinte(C["disk"], .08), borde=C["disk"], ancho=2, tam=13, der=100)
icono(DX + DW - 92, 172, "vm", 38)
icono(DX + DW - 48, 172, "disk", 38)


# ② Standard o Premium
def std(x, y, w, h, html):
    caja(x, y, w, h, html, fondo=tinte(C["std"], .08), borde=C["std"], tam=12)


def pre(x, y, w, h, html):
    caja(x, y, w, h, html, fondo=tinte(C["pre"], .08), borde=C["pre"], rayas=True, tam=12)


S = "<b style='color:%s'>Standard · Uso general v2 (GPv2)</b><br>" % C["std"]
std(X[0], 295, CW, 84, S + "HDD · el más barato · tiene tipos de blob, <b>niveles</b> y <b>GRS/GZRS</b>")
pre(X[0], 387, CW, 76, f"<b style='color:{C['pre']}'>Premium Block Blobs</b><br>SSD · muchos objetos pequeños, IoT, latencia baja")
pre(X[0], 471, CW, 74, f"<b style='color:{C['pre']}'>Premium Page Blobs</b><br>SSD · discos VHD (forma antigua: discos <b>no</b> administrados)")
std(X[1], 295, CW, 84, S + "Recursos compartidos por <b>SMB</b> · barato")
pre(X[1], 387, CW, 100, f"<b style='color:{C['pre']}'>Premium File Shares</b><br>SSD · SMB y <b>NFS</b><br>(la única con NFS)")
for x in X[2:]:
    std(x, 295, CW, 84, S + "Única opción")
    caja(x, 387, CW, 60, "<b>✕ No existe Premium</b><br>aunque pidan \"el mejor rendimiento\"", fondo="#f3f4f6", borde="#b8c2cc",
         rayas=True, texto=C["gris"])
std(DX, 295, DW, 120, f"<b style='color:{C['std']}'>Disco Estándar</b><br>"
    "<b>HDD Estándar</b> · el más barato · pruebas, backups · SLA VM 95 %<br>"
    "<b>SSD Estándar</b> · web y servidores con poco uso · SLA VM 99,5 %")
pre(DX, 423, DW, 122, f"<b style='color:{C['pre']}'>Disco Premium</b><br>"
    "<b>SSD Premium</b> · producción, bases de datos · SLA VM 99,9 %<br>"
    "<b>Ultra Disk</b> · lo más rápido · &lt; 1 ms · solo disco de datos (SAP HANA)")

# ③ Qué más elijo
caja(X[0], 565, CW, 24, "<b>Tipo de blob</b> · cómo se escribe", tam=12, texto=C["blob"])
TB = [("Block", "archivos enteros: fotos, backups · <b>único con niveles</b>", C["blob"]),
      ("Append", "solo se agrega al final: logs", C["blob"]),
      ("Page", "páginas de 512 B: <b>discos VHD</b>", C["disk"])]
for i, (n, d, col) in enumerate(TB):
    caja(X[0], 592 + i * 52, CW, 46, f"<b style='color:{col}'>{n} blob</b> · {d}", fondo=tinte(col, .08), borde=col, tam=11.5,
         valin="middle")
caja(X[0], 752, CW, 24, "<b>Nivel de acceso</b> · cada cuánto lo <b>lees</b>", tam=12, texto=C["blob"])
NIV = [("Hot", "siempre", "#d6452b"), ("Cool", "≥ 30 días", "#2a8fd6"), ("Cold", "≥ 90 días", "#3a5fc4"),
       ("Archive", "≥ 180 días · fuera de línea (horas)", "#5a6b7c")]
for i, (n, d, col) in enumerate(NIV):
    caja(X[0], 779 + i * 30, CW, 26, f"<b style='color:{col}'>{n}</b> · {d}", fondo=tinte(col, .08), borde=col, tam=11.5,
         valin="middle", rayas=(n == "Archive"))
caja(X[0], 900, CW, 22, "solo Block blobs de Standard", tam=10.5, texto=C["gris"])

caja(X[1], 565, CW, 340, "<b style='color:%s'>Protocolo</b><br>• <b>SMB</b>: Windows, unidad Z: (Standard y Premium)<br>"
     "• <b>NFS</b>: Linux (solo Premium File Shares)<br><br><b style='color:%s'>Azure File Sync</b><br>"
     "Sincroniza tu servidor de archivos local con Azure Files.<br><br><b style='color:%s'>Trampa</b><br>"
     "Un disco es de <b>UNA</b> VM. Si varias VMs u oficinas comparten la carpeta → <b>Files</b>."
     % (C["files"], C["files"], C["bad"]), fondo=tinte(C["files"], .05), borde=C["files"], tam=12)
caja(X[2], 565, CW, 340, "<b style='color:%s'>Para qué</b><br>Desacoplar: la web deja el pedido en la cola y otro proceso lo "
     "atiende después (en segundo plano).<br><br><b style='color:%s'>Trampa</b><br>No tiene Premium ni niveles: siempre Standard."
     % (C["queue"], C["bad"]), fondo=tinte(C["queue"], .05), borde=C["queue"], tam=12)
caja(X[3], 565, CW, 340, "<b style='color:%s'>Para qué</b><br>Telemetría, listas, configuración: clave-valor sin esquema, "
     "barato, de una región.<br><br><b style='color:%s'>Trampa</b><br>NoSQL <b>global</b>, multirregión → <b>Cosmos DB</b> "
     "(es una base de datos, no Storage)." % (C["table"], C["bad"]), fondo=tinte(C["table"], .05), borde=C["table"], tam=12)
caja(DX, 565, DW, 340, "<b style='color:%s'>Discos de una VM</b><br>disco del SO + discos de datos (+ disco temporal, se borra)."
     "<br><br><b style='color:%s'>⚠ Mismas palabras, otro lugar</b><br>Aquí Estándar / Premium es el <b>TIPO DE DISCO</b>, "
     "no el tipo de cuenta.<br><br><b style='color:%s'>Por dentro</b><br>Todo disco es un <b>page blob</b> (VHD). "
     "Administrado = Azure maneja la cuenta por ti.<br><br><b>La pregunta dice…</b><br>"
     "• \"tipo de disco\" → HDD · SSD · Premium · Ultra<br>• \"cuenta de almacenamiento\" + discos → Premium Page Blobs"
     % (C["disk"], C["bad"], C["disk"]), fondo=tinte(C["disk"], .05), borde=C["disk"], tam=12)
flecha([(X[0] + CW, 719), (460, 719), (460, 915), (DX + DW // 2, 915), (DX + DW // 2, 905)], C["disk"],
       "por dentro, un disco es un page blob")

# ④ Redundancia
RED = [("LRS", "3 copias en 1 centro de datos", "11 nueves · el más barato"),
       ("ZRS", "3 copias en 3 zonas de la región", "12 nueves · sobrevive a una zona"),
       ("GRS", "LRS + LRS en la región emparejada", "6 copias · 16 nueves · desastre regional"),
       ("GZRS", "ZRS + LRS en la región emparejada", "6 copias · 16 nueves · zona y región")]
for i, (n, a, b) in enumerate(RED):
    caja(190 + i * 300, 950, 290, 80, f"<b style='font-size:16px;color:{C['rbr']}'>{n}</b> · {a}<br>"
         f"<span style='color:{C['gris']}'>{b}</span>", fondo=tinte(C["rbr"], .07), borde=C["rbr"], tam=12, valin="middle")
caja(1390, 950, 265, 80, "<b>RA-</b>GRS / <b>RA-</b>GZRS: puedes <b>leer</b> la secundaria.<br>"
     "<b>Premium y discos:</b> solo LRS o ZRS.", fondo="#eef3f8", borde="#d5dee7", tam=12, valin="middle")
caja(190, 1034, 1200, 22, "La copia a la otra región es asíncrona · Brazil South → South Central US (no recíproco)", tam=11,
     texto=C["gris"])

# ⚠ Confusiones
CONF = ["<b>Standard / Premium</b> de la <b>cuenta</b> ≠ <b>Estándar / Premium</b> del <b>disco</b>: misma palabra, otro lugar.",
        "<b>Page blob</b> = disco VHD. \"Alto rendimiento\" no lleva a Page Blobs si piden una carpeta compartida.",
        "<b>Hot / Cool / Cold / Archive</b> = cada cuánto <b>lees</b>, no la velocidad. Solo en Block blobs de Standard.",
        "<b>Queue</b> y <b>Table</b> nunca son Premium. Una <b>base de datos</b> (SQL, Cosmos DB) no es una cuenta de Storage."]
for i, t in enumerate(CONF):
    caja(190 + i * 368, 1080, 358, 90, t, fondo=tinte(C["bad"], .06), borde=C["bad"], tam=12, valin="middle")

xml = (f'<mxfile host="az900-simulador" agent="tools/guia-storage-drawio.py"><diagram name="Guía Visual Azure Storage Account" '
       f'id="guia"><mxGraphModel dx="{W}" dy="{H}" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" '
       f'fold="1" page="1" pageScale="1" pageWidth="{W}" pageHeight="{H}" background="#ffffff" math="0" shadow="0"><root>'
       f'<mxCell id="0"/><mxCell id="1" parent="0"/>{"".join(celdas)}</root></mxGraphModel></diagram></mxfile>')
open(sys.argv[1], "w", encoding="utf-8").write(xml)
print(len(celdas), "celdas ->", sys.argv[1])
