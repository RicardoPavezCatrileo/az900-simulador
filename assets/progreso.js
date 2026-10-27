// Certificaciones, sus temas y el avance guardado en localStorage.
// Registro por tema: {respuestas:{indice:opcion}, total, mejor}
//   mejor = mayor cantidad de respuestas correctas lograda en un intento.
// Clave: "<cert>:progreso:<id>" (ej. az900:progreso:cap07, az104:progreso:identidad).
// archivo es relativo a la carpeta de la certificación.

const CAPITULOS=[
 {id:"cap02",num:2, titulo:"Cloud computing",              archivo:"cap02-cloud.html",            listo:true},
 {id:"cap03",num:3, titulo:"Arquitectura y servicios",     archivo:"cap03-arquitectura.html",     listo:true},
 {id:"cap04",num:4, titulo:"Fundamentos de herramientas",  archivo:"cap04-fundamentos-herramientas.html",     listo:true},
 {id:"cap05",num:5, titulo:"Computación",                  archivo:"cap05-computacion.html",      listo:true},
 {id:"cap06",num:6, titulo:"Redes",                        archivo:"cap06-redes.html",            listo:true},
 {id:"cap07",num:7, titulo:"Almacenamiento",               archivo:"cap07-almacenamiento.html",   listo:true},
 {id:"cap08",num:8, titulo:"Autenticación y autorización", archivo:"cap08-autenticacion-autorizacion.html",        listo:true},
 {id:"cap09",num:9, titulo:"Seguridad",                    archivo:"cap09-seguridad.html",        listo:true},
 {id:"cap10",num:10,titulo:"Monitorización y gestión",     archivo:"cap10-monitorizacion-gestion.html",   listo:true},
 {id:"cap11",num:11,titulo:"Precios",                      archivo:"cap11-precios.html",          listo:true}
];

// AZ-104: un tema por dominio oficial del examen. pdf = páginas del PDF del curso AZ-104; base = capítulos de AZ-900 que repasar antes.
const AZ104=[
 {id:"identidad",     num:1,titulo:"Identidades y gobierno",          archivo:"identidad-gobierno.html", pdf:"25–81",   base:[3,8,10,11],listo:false},
 {id:"almacenamiento",num:2,titulo:"Almacenamiento",                  archivo:"almacenamiento.html",     pdf:"82–112",  base:[7],        listo:false},
 {id:"computo",       num:3,titulo:"Cómputo",                         archivo:"computo.html",            pdf:"113–155", base:[4,5],      listo:false},
 {id:"redes",         num:4,titulo:"Redes virtuales",                 archivo:"redes.html",              pdf:"156–189", base:[6,9],      listo:false},
 {id:"monitoreo",     num:5,titulo:"Monitoreo y copias de seguridad", archivo:"monitoreo-backup.html",   pdf:"190–202", base:[10],       listo:false}
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
  // Promedio de los temas de una certificación (los no empezados cuentan 0)
  porcentajeCert(c){
    if(!c.temas.length)return 0;
    return Math.round(c.temas.reduce((s,t)=>s+(this.porcentaje(t.id,c.id)||0),0)/c.temas.length);
  }
};
