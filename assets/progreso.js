// Lista de capítulos y avance guardado en localStorage.
// Registro por capítulo: {respuestas:{indice:opcion}, total, mejor}
//   mejor = mayor cantidad de respuestas correctas lograda en un intento.

const CAPITULOS=[
 {id:"cap02",num:2, titulo:"Cloud computing",              archivo:"cap02-cloud.html",            listo:true},
 {id:"cap03",num:3, titulo:"Arquitectura y servicios",     archivo:"cap03-arquitectura.html",     listo:true},
 {id:"cap04",num:4, titulo:"Fundamentos de herramientas",  archivo:"cap04-herramientas.html",     listo:true},
 {id:"cap05",num:5, titulo:"Computación",                  archivo:"cap05-computacion.html",      listo:true},
 {id:"cap06",num:6, titulo:"Redes",                        archivo:"cap06-redes.html",            listo:true},
 {id:"cap07",num:7, titulo:"Almacenamiento",               archivo:"cap07-almacenamiento.html",   listo:true},
 {id:"cap08",num:8, titulo:"Autenticación y autorización", archivo:"cap08-identidad.html",        listo:true},
 {id:"cap09",num:9, titulo:"Seguridad",                    archivo:"cap09-seguridad.html",        listo:true},
 {id:"cap10",num:10,titulo:"Monitorización y gestión",     archivo:"cap10-monitorizacion.html",   listo:false},
 {id:"cap11",num:11,titulo:"Precios",                      archivo:"cap11-precios.html",          listo:false}
];

const Progreso={
  clave:id=>"az900:progreso:"+id,
  leer(id){
    try{const v=JSON.parse(localStorage.getItem(this.clave(id)));if(v&&typeof v==="object")return v}catch(e){}
    return null;
  },
  guardar(id,datos){
    try{localStorage.setItem(this.clave(id),JSON.stringify(datos))}catch(e){}
  },
  borrar(id){
    try{localStorage.removeItem(this.clave(id))}catch(e){}
  },
  // Porcentaje 0-100 según el mejor intento; null si nunca se respondió
  porcentaje(id){
    const p=this.leer(id);
    if(!p||!p.total)return null;
    return Math.round(100*(p.mejor||0)/p.total);
  }
};
