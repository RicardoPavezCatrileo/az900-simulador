// Convierte az900/ayuda-memoria.md en un Word para imprimir (docs/ayuda-memoria-az900.docx).
// Uso (desde la raíz): node tools/ayuda-memoria.js
// Requiere la librería docx: npm install --prefix tools docx
// Markdown admitido: "# " capítulo (empieza página nueva), "## " sección, "- " viñeta,
// tablas con "|" (la primera fila es el encabezado), **negrita** y párrafos sueltos.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, LevelFormat, AlignmentType, Footer, PageNumber,
} = require("docx");

const raiz = path.join(__dirname, "..");
const entrada = path.join(raiz, "az900", "ayuda-memoria.md");
const salida = process.argv[2] || path.join(raiz, "docs", "ayuda-memoria-az900.docx");

const FUENTE = "Calibri";
const ANCHO = 12240 - 2 * 1080; // carta con márgenes de 0,75"
const borde = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
const bordes = { top: borde, bottom: borde, left: borde, right: borde };

// "**negrita** normal" → TextRuns
function texto(linea, extra = {}) {
  return linea.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(t =>
    t.startsWith("**") ? new TextRun({ text: t.slice(2, -2), bold: true, ...extra })
                       : new TextRun({ text: t, ...extra }));
}

function tabla(filas) {
  const celdas = filas.map(f => f.replace(/^\||\|$/g, "").split("|").map(c => c.trim()));
  const datos = celdas.filter(f => !f.every(c => /^:?-+:?$/.test(c)));
  const n = datos[0].length;
  // ancho de cada columna según el largo promedio de su texto (con mínimo)
  // peso = mitad largo promedio, mitad el más largo (así las columnas cortas no se parten)
  const largo = (f, i) => (f[i] || "").replace(/\*\*/g, "").length;
  const peso = [...Array(n)].map((_, i) => Math.max(datos[0][i].length,
    (datos.reduce((s, f) => s + largo(f, i), 0) / datos.length + Math.max(...datos.map(f => largo(f, i)))) / 2));
  const total = peso.reduce((a, b) => a + b, 0);
  const anchos = peso.map(p => Math.floor(ANCHO * p / total));
  anchos[n - 1] += ANCHO - anchos.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: ANCHO, type: WidthType.DXA },
    columnWidths: anchos,
    rows: datos.map((f, r) => new TableRow({
      tableHeader: r === 0,
      children: f.map((c, i) => new TableCell({
        borders: bordes,
        width: { size: anchos[i], type: WidthType.DXA },
        shading: r === 0 ? { fill: "E7E6E6", type: ShadingType.CLEAR } : undefined,
        margins: { top: 40, bottom: 40, left: 90, right: 90 },
        children: [new Paragraph({ spacing: { after: 0 }, children: texto(c, r === 0 ? { bold: true, size: 20 } : { size: 20 }) })],
      })),
    })),
  });
}

const lineas = fs.readFileSync(entrada, "utf8").split(/\r?\n/);
const hijos = [];
let primero = true, trasTitulo = false;
for (let i = 0; i < lineas.length; i++) {
  const l = lineas[i];
  if (!l.trim()) continue;
  if (l.startsWith("|")) {
    const filas = [];
    while (i < lineas.length && lineas[i].startsWith("|")) filas.push(lineas[i++]);
    i--;
    hijos.push(tabla(filas));
    hijos.push(new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "", size: 8 })] }));
  } else if (l.startsWith("# ")) {
    hijos.push(new Paragraph({ style: "Heading1", pageBreakBefore: !primero, children: texto(l.slice(2)) }));
    primero = false; trasTitulo = true; continue;
  } else if (l.startsWith("## ")) {
    hijos.push(new Paragraph({ style: "Heading2", children: texto(l.slice(3)) }));
  } else if (l.startsWith("- ")) {
    hijos.push(new Paragraph({ numbering: { reference: "vinetas", level: 0 }, children: texto(l.slice(2)) }));
  } else {
    hijos.push(new Paragraph({ children: texto(l, trasTitulo ? { italics: true, color: "555555" } : {}) }));
  }
  trasTitulo = false;
}

const doc = new Document({
  creator: "AZ-900 Simulador",
  title: "AZ-900 · Ayuda memoria",
  styles: {
    default: { document: { run: { font: FUENTE, size: 22 }, paragraph: { spacing: { after: 60 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FUENTE, size: 32, bold: true, color: "1F3864" },
        paragraph: { spacing: { before: 0, after: 60 }, keepNext: true, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "1F3864", space: 2 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FUENTE, size: 24, bold: true, color: "1F3864" },
        paragraph: { spacing: { before: 160, after: 60 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: "vinetas", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
    alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 },
      margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: "AZ-900 · Ayuda memoria · ", size: 16, color: "777777" }),
                 new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "777777" })] })] }) },
    children: hijos,
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(salida, b); console.log("Listo:", salida); });
