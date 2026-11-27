// Certificaciones, sus temas y el avance guardado en localStorage.
// Registro por tema: {respuestas:{indice:opcion}, total, mejor}
//   mejor = mayor cantidad de respuestas correctas lograda en un intento.
// Clave: "<cert>:progreso:<id>" (ej. az900:progreso:cap07, az104:progreso:identidad).
// archivo es relativo a la carpeta de la certificación.
// extras = prácticas de ese capítulo (laboratorios, guías) que se muestran dentro de su tarjeta;
//   quiz = id de su quiz, que no cuenta en el avance del capítulo.

const CAPITULOS=[
 {id:"cap02",num:2, titulo:"Cloud computing",              archivo:"cap02-cloud.html",            listo:true},
 {id:"cap03",num:3, titulo:"Arquitectura y servicios",     archivo:"cap03-arquitectura.html",     listo:true},
 {id:"cap04",num:4, titulo:"Fundamentos de herramientas",  archivo:"cap04-fundamentos-herramientas.html",     listo:true},
 {id:"cap05",num:5, titulo:"Computación",                  archivo:"cap05-computacion.html",      listo:true},
 {id:"cap06",num:6, titulo:"Redes",                        archivo:"cap06-redes.html",            listo:true,
   extras:[{tipo:"Laboratorio",titulo:"Conectividad en 3 tramos: VPN, peering y endpoints",archivo:"cap06-lab-conectividad.html",quiz:"peering"}]},
 {id:"cap07",num:7, titulo:"Almacenamiento",               archivo:"cap07-almacenamiento.html",   listo:true,
   extras:[{tipo:"Guía visual",titulo:"Tipos de cuenta de Storage",archivo:"cap07-guia-cuentas-storage.html"},
           {tipo:"Mapa",titulo:"Mapa de almacenamiento (para memorizar)",archivo:"cap07-mapa-almacenamiento.html"},
           {tipo:"Arquitectura",titulo:"Arquitectura de almacenamiento (la guía visual en un caso real)",archivo:"cap07-arquitectura-storage.html"}]},
 {id:"cap08",num:8, titulo:"Autenticación y autorización", archivo:"cap08-autenticacion-autorizacion.html",        listo:true},
 {id:"cap09",num:9, titulo:"Seguridad",                    archivo:"cap09-seguridad.html",        listo:true},
 {id:"cap10",num:10,titulo:"Monitorización y gestión",     archivo:"cap10-monitorizacion-gestion.html",   listo:true,
   extras:[{tipo:"Laboratorio",titulo:"Gobierno y seguridad sobre la red (usa también caps. 6 y 8)",archivo:"cap10-lab-gobierno.html",quiz:"gobierno"}]},
 {id:"cap11",num:11,titulo:"Precios",                      archivo:"cap11-precios.html",          listo:true}
];

// AZ-104: una página por sección del curso (2 a 16; la 1 es la introducción y la 17–18 el examen), en el orden del curso.
// id = sNN = id del quiz (data/preguntas-sNN.json) · pdf = páginas del PDF del curso AZ-104 · base = capítulos de AZ-900 que repasar antes.
// extras = prácticas que sirven a esa sección (como en CAPITULOS); el diagrama de administración cubre las secciones 4, 5 y 6.
const AZ104=[
 {id:"s02",num:2, titulo:"Fundamentos y arquitectura de Microsoft Azure",     archivo:null,                           base:[2,3], listo:false},
 {id:"s03",num:3, titulo:"Requisitos previos para administradores de Azure",  archivo:"s03-requisitos-previos.html", pdf:"14–24",  base:[4],    listo:true},
 {id:"s04",num:4, titulo:"Gobernanza en Microsoft Azure",                     archivo:"s04-gobernanza.html",         pdf:"25–40",  base:[3,10,11],listo:true,extras:[{tipo:"Diagrama",titulo:"Quién administra qué y desde dónde",archivo:"administracion.html#pieza=mg",quiz:"administracion"}]},
 {id:"s05",num:5, titulo:"Microsoft Entra ID",                                archivo:"s05-entra-id.html",           pdf:"41–70",  base:[8],    listo:true,extras:[{tipo:"Diagrama",titulo:"Quién administra qué y desde dónde",archivo:"administracion.html#caso=noentra",quiz:"administracion"}]},
 {id:"s06",num:6, titulo:"Control de acceso basado en roles (RBAC)",          archivo:"s06-rbac.html",               pdf:"71–81",  base:[10],   listo:true,extras:[{tipo:"Diagrama",titulo:"Quién administra qué y desde dónde",archivo:"administracion.html#caso=vms",quiz:"administracion"}]},
 {id:"s07",num:7, titulo:"Almacenamiento (nivel 1)",                          archivo:"s07-almacenamiento-1.html",   pdf:"82–112", base:[7],    listo:true},
 {id:"s08",num:8, titulo:"Almacenamiento (nivel 2)",                          archivo:"s08-almacenamiento-2.html",   pdf:"82–112", base:[7],    listo:true},
 {id:"s09",num:9, titulo:"Azure Virtual Machines (VM)",                       archivo:"s09-maquinas-virtuales.html", pdf:"113–130",base:[5],    listo:true},
 {id:"s10",num:10,titulo:"Infraestructura como código: ARM y Bicep",          archivo:"s10-arm-bicep.html",          pdf:"131–135",base:[4],    listo:true},
 {id:"s11",num:11,titulo:"Azure App Service",                                 archivo:"s11-app-service.html",        pdf:"136–141",base:[5],    listo:true},
 {id:"s12",num:12,titulo:"Contenedores",                                      archivo:"s12-contenedores.html",       pdf:"142–155",base:[5],    listo:true},
 {id:"s13",num:13,titulo:"Redes virtuales (nivel 1)",                         archivo:"s13-redes-1.html",            pdf:"156–189",base:[6],    listo:true,
   extras:[{tipo:"Laboratorio AZ-900",titulo:"Conectividad en 3 tramos",archivo:"../az900/cap06-lab-conectividad.html"}]},
 {id:"s14",num:14,titulo:"Redes virtuales (nivel 2)",                         archivo:"s14-redes-2.html",            pdf:"156–189",base:[6,9],  listo:true},
 {id:"s15",num:15,titulo:"Monitorización",                                    archivo:"s15-monitorizacion.html",     pdf:"190–200",base:[10],   listo:true},
 {id:"s16",num:16,titulo:"Copias de seguridad y recuperación",                archivo:"s16-backup.html",             pdf:"201–202",base:[10],   listo:true}
];

const CERTS=[
 {id:"az900",codigo:"AZ-900",nombre:"Azure Fundamentals",               nivel:"Fundamentals",carpeta:"az900",temas:CAPITULOS},
 {id:"az104",codigo:"AZ-104",nombre:"Azure Administrator Associate",    nivel:"Associate",   carpeta:"az104",temas:AZ104},
 {id:"dp900",codigo:"DP-900",nombre:"Azure Data Fundamentals",          nivel:"Fundamentals",carpeta:null,   temas:[]},
 {id:"az305",codigo:"AZ-305",nombre:"Azure Solutions Architect Expert", nivel:"Expert",      carpeta:null,   temas:[]}
];

const Progreso={
  clave:(id,cert="az900")=>cert+":progreso:"+id,
  leer(id,cert){
    try{const v=JSON.parse(localStorage.getItem(this.clave(id,cert)));if(v&&typeof v==="object")return v}catch(e){}
    return null;
  },
  guardar(id,datos,cert){
    try{localStorage.setItem(this.clave(id,cert),JSON.stringify(datos))}catch(e){}
  },
  borrar(id,cert){
    try{localStorage.removeItem(this.clave(id,cert))}catch(e){}
  },
  // Porcentaje 0-100 según el mejor intento; null si nunca se respondió
  porcentaje(id,cert){
    const p=this.leer(id,cert);
    if(!p||!p.total)return null;
    return Math.round(100*(p.mejor||0)/p.total);
  },
  // Promedio de los temas disponibles de una certificación (los no empezados cuentan 0)
  porcentajeCert(c){
    const ts=c.temas.filter(t=>t.listo);
    if(!ts.length)return 0;
    return Math.round(ts.reduce((s,t)=>s+(this.porcentaje(t.id,c.id)||0),0)/ts.length);
  }
};
