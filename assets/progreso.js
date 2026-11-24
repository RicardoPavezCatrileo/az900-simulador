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
   extras:[{tipo:"Guía visual",titulo:"Tipos de cuenta de Storage",archivo:"cap07-guia-cuentas-storage.html"}]},
 {id:"cap08",num:8, titulo:"Autenticación y autorización", archivo:"cap08-autenticacion-autorizacion.html",        listo:true},
 {id:"cap09",num:9, titulo:"Seguridad",                    archivo:"cap09-seguridad.html",        listo:true},
 {id:"cap10",num:10,titulo:"Monitorización y gestión",     archivo:"cap10-monitorizacion-gestion.html",   listo:true,
   extras:[{tipo:"Laboratorio",titulo:"Gobierno y seguridad sobre la red (usa también caps. 6 y 8)",archivo:"cap10-lab-gobierno.html",quiz:"gobierno"}]},
 {id:"cap11",num:11,titulo:"Precios",                      archivo:"cap11-precios.html",          listo:true}
];

// AZ-104: un tema por dominio oficial del examen. pdf = páginas del PDF del curso AZ-104; base = capítulos de AZ-900 que repasar antes.
const AZ104=[
 {id:"identidad",     num:1,titulo:"Identidades y gobierno",          archivo:"identidad-gobierno.html", pdf:"25–81",   base:[3,8,10,11],resumen:"s4",listo:true},
 {id:"almacenamiento",num:2,titulo:"Almacenamiento",                  archivo:"almacenamiento.html",     pdf:"82–112",  base:[7],        resumen:"s5",listo:true},
 {id:"computo",       num:3,titulo:"Cómputo",                         archivo:"computo.html",            pdf:"113–155", base:[4,5],      resumen:"s5",listo:true},
 {id:"redes",         num:4,titulo:"Redes virtuales",                 archivo:"redes.html",              pdf:"156–189", base:[6,9],      resumen:"s5",listo:true},
 {id:"monitoreo",     num:5,titulo:"Monitoreo y copias de seguridad", archivo:"monitoreo-backup.html",   pdf:"190–202", base:[10],       resumen:"s4",listo:true}
];

// Secciones del curso AZ-104 (2 a 16; la 1 es la introducción y la 17–18 el examen), en el orden del curso.
// La portada de AZ-104 muestra estas tarjetas; el avance sigue siendo el quiz de cada dominio (AZ104).
// tema = id del dominio en AZ104 · partes = [n.º de sección de la página (ancla #sN), nombre corto] · sin tema = pendiente.
const SECCIONES_AZ104=[
 {num:2, titulo:"Fundamentos y arquitectura de Microsoft Azure", base:[2,3]},
 {num:3, titulo:"Requisitos previos para administradores de Azure", pdf:"14–24", base:[4]},
 {num:4, titulo:"Gobernanza en Microsoft Azure", pdf:"25–40", base:[3,10,11]},
 {num:5, titulo:"Microsoft Entra ID", pdf:"41–70", tema:"identidad", partes:[[1,"Licencias"],[2,"Grupos dinámicos"],[5,"AD DS vs Entra ID vs Entra DS"]]},
 {num:6, titulo:"Control de acceso basado en roles (RBAC)", pdf:"71–81", tema:"identidad", partes:[[3,"RBAC por dentro: Actions − NotActions"]]},
 {num:7, titulo:"Almacenamiento (nivel 1)", pdf:"82–112", tema:"almacenamiento", partes:[[1,"¿Qué tipo de cuenta creo?"]]},
 {num:8, titulo:"Almacenamiento (nivel 2)", pdf:"82–112", tema:"almacenamiento", partes:[[2,"Clave, SAS o Entra ID"],[3,"Ciclo de vida"],[4,"Proteger los datos"]]},
 {num:9, titulo:"Azure Virtual Machines (VM)", pdf:"113–130", tema:"computo", partes:[[1,"¿Cómo me conecto a la VM?"],[2,"Scale Set: autoescalado"]]},
 {num:10,titulo:"Infraestructura como código: ARM y Bicep", pdf:"131–135", tema:"computo", partes:[[3,"ARM vs Bicep"]]},
 {num:11,titulo:"Azure App Service", base:[5]},
 {num:12,titulo:"Contenedores", tema:"computo", partes:[[4,"De Dockerfile a ACI, Container Apps o AKS"]]},
 {num:13,titulo:"Redes virtuales (nivel 1)", pdf:"156–189", tema:"redes", partes:[[1,"NSG en subred y NIC, con ASG"],[2,"Peering con varios espacios"]]},
 {num:14,titulo:"Redes virtuales (nivel 2)", pdf:"156–189", tema:"redes", partes:[[3,"Application Gateway"],[4,"Azure DNS"]]},
 {num:15,titulo:"Monitorización", pdf:"190–200", tema:"monitoreo", partes:[[1,"Regla de alerta"],[2,"Consultas KQL"]]},
 {num:16,titulo:"Copias de seguridad y recuperación", pdf:"201–202", tema:"monitoreo", partes:[[3,"Azure Backup y Site Recovery"]]}
];

const CERTS=[
 {id:"az900",codigo:"AZ-900",nombre:"Azure Fundamentals",               nivel:"Fundamentals",carpeta:"az900",temas:CAPITULOS},
 {id:"az104",codigo:"AZ-104",nombre:"Azure Administrator Associate",    nivel:"Associate",   carpeta:"az104",temas:AZ104,secciones:SECCIONES_AZ104},
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
