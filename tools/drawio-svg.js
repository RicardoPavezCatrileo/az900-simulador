// Convierte el póster SVG (el que arma poster()) en un archivo .drawio editable.
// Se inyecta DESPUÉS del script del póster: envuelve poster(), marca cada pieza con su id
// (data-dio) antes de que poster() borre las clases, y al final deja el XML en <textarea id="dioout">.
// Cada pieza del diagrama queda como un grupo de draw.io (caja + franja de color + textos + ícono de Azure).
const ICONOS={
 inet:"general/Globe",portal:"general/Management_Portal",cli:"general/Dev_Console",ps:"general/Powershell",
 shell:"other/Azure_Cloud_Shell",arm:"general/Templates",repo:"general/Code",pipe:"devops/Azure_DevOps",
 advisor:"management_governance/Advisor",vmw1:"compute/Virtual_Machine",vmw2:"compute/Virtual_Machine",vmw3:"compute/Virtual_Machine",
 vma1:"compute/Virtual_Machine",vma2:"compute/Virtual_Machine",vma3:"compute/Virtual_Machine",dcvm:"compute/Virtual_Machine",
 fd:"networking/Front_Doors",tm:"networking/Traffic_Manager_Profiles",appgw:"networking/Application_Gateways",lb:"networking/Load_Balancers",
 vpngw:"networking/Virtual_Network_Gateways",ergw:"networking/Virtual_Network_Gateways",router:"networking/Local_Network_Gateways",
 er:"networking/ExpressRoute_Circuits",sql:"databases/SQL_Database",st:"storage/Storage_Accounts",st2:"storage/Storage_Accounts",
 files:"general/Storage_Azure_Files",entra:"other/Entra_Identity",mfa:"identity/Multi_Factor_Authentication",ca:"security/Conditional_Access",
 connect:"identity/Entra_Connect",adds:"general/Server_Farm",eds:"identity/Entra_Domain_Services",emp:"identity/Users",
 pe:"networking/Private_Endpoint",kv:"security/Key_Vaults",defender:"security/Azure_Defender",monitor:"management_governance/Monitor",
 logs:"analytics/Log_Analytics_Workspaces",appi:"devops/Application_Insights",alertas:"management_governance/Alerts",
 logic:"integration/Logic_Apps",sh:"general/Service_Health",cost:"general/Cost_Management",
 // administracion.html
 p_azure:"general/Management_Portal",p_entra:"other/Entra_Identity",usuarios:"identity/Users",rolesE:"identity/Users",
 vms:"compute/Virtual_Machine",vnet:"networking/Virtual_Networks",budget:"general/Cost_Budgets",
 apps:"identity/Entra_Managed_Identities",logsE:"management_governance/Monitor"
};
const _posterOriginal=poster;
poster=function(){
  document.querySelectorAll("#svg .el[data-id]").forEach(g=>g.setAttribute("data-dio",g.dataset.id));
  _posterOriginal();
  drawio();
};
function drawio(){
  const s=document.querySelector("body>svg"),W=+s.getAttribute("width"),H=+s.getAttribute("height");
  const celdas=[];let n=0;
  const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const r1=v=>Math.round(v*10)/10;
  // Colores calculados: rgb(), rgba() o color(srgb r g b / a) → [#hex, opacidad 0–100] (null = sin color)
  function color(c){
    if(!c||c==="none")return null;
    let m=c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/),v,a=1;
    if(m){v=[+m[1],+m[2],+m[3]];if(m[4]!==undefined)a=+m[4]}
    else if((m=c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/))){v=[m[1]*255,m[2]*255,m[3]*255];if(m[4]!==undefined)a=+m[4]}
    else return null;
    if(a===0)return null;
    return ["#"+v.map(x=>Math.round(x).toString(16).padStart(2,"0")).join(""),Math.round(a*100)];
  }
  // Fuentes de Windows (draw.io Desktop no carga las de Google al exportar): IBM Plex Mono → Consolas; el resto → Segoe UI
const fuente=f=>/Mono|Consolas/.test(f)?"Consolas":"Segoe UI";
  function trazo(cs){
    const k=color(cs.stroke),w=parseFloat(cs.strokeWidth)||1,da=cs.strokeDasharray;
    let st=k?`strokeColor=${k[0]};strokeWidth=${w};`:"strokeColor=none;";
    if(k&&da&&da!=="none")st+=`dashed=1;fixDash=1;dashPattern=${da.replace(/px/g,"").split(/[ ,]+/).join(" ")};`;
    return st;
  }
  function rect(e,ox,oy,cs){
    const x=+e.getAttribute("x")+ox,y=+e.getAttribute("y")+oy,w=+e.getAttribute("width"),h=+e.getAttribute("height"),rx=+(e.getAttribute("rx")||0);
    const f=color(cs.fill),op=parseFloat(cs.opacity);
    let st=(rx?`rounded=1;absoluteArcSize=1;arcSize=${rx*2};`:"rounded=0;")+(f?`fillColor=${f[0]};`+(f[1]<100?`fillOpacity=${f[1]};`:""):"fillColor=none;")+trazo(cs);
    if(op<1)st+=`opacity=${Math.round(op*100)};`;
    return {x,y,w,h,st:"whiteSpace=wrap;html=1;"+st,v:""};
  }
  const lienzo=document.createElement("canvas").getContext("2d");
  function texto(e,ox,oy,cs){
    const ff=fuente(cs.fontFamily),tl=e.getAttribute("textLength");
    const k=color(cs.fill)||["#000000",100],bold=parseInt(cs.fontWeight,10)>=600||/Archivo/.test(cs.fontFamily);
    // Ancho que el texto ocupa en el póster; si en la fuente de Windows queda más ancho, se achica la letra
    let fs=parseFloat(cs.fontSize);const wP=tl?+tl:e.getComputedTextLength();
    lienzo.font=`${bold?"bold ":""}${fs}px "${ff}"`;const wS=lienzo.measureText(e.textContent).width;
    if(wS>wP*1.01)fs=Math.floor(fs*wP/wS*10)/10;
    const w=wP+2,ta=cs.textAnchor||e.getAttribute("text-anchor")||"start";
    // centrado vertical en la altura de las minúsculas (más estable entre fuentes que alinear por arriba)
    let x=+e.getAttribute("x")+ox;const h=fs*1.5,y=+e.getAttribute("y")+oy-fs*.33-h/2;
    x=ta==="middle"?x-w/2:ta==="end"?x-w:x-1;
    let st=`text;html=1;whiteSpace=nowrap;align=${ta==="middle"?"center":ta==="end"?"right":"left"};verticalAlign=middle;spacing=0;spacingTop=0;spacingLeft=0;spacingRight=0;spacingBottom=0;`+
      `fontFamily=${ff};fontSize=${fs};fontColor=${k[0]};`+(bold?"fontStyle=1;":"");
    if(/stroke/.test(cs.paintOrder)){const b=color(cs.stroke);if(b)st+=`labelBackgroundColor=${b[0]};`}
    return {x,y,w,h,st,v:esc(esc(e.textContent))};
  }
  function linea(e,ox,oy,cs){
    const p=(e.getAttribute("d").match(/-?[\d.]+/g)||[]).map(Number),pt=[];
    for(let i=0;i<p.length;i+=2)pt.push([p[i]+ox,p[i+1]+oy]);
    let st="edgeStyle=none;rounded=0;html=1;"+trazo(cs)+(e.getAttribute("marker-end")?"endArrow=block;endFill=1;endSize=5;":"endArrow=none;")+
      (e.getAttribute("marker-start")?"startArrow=block;startFill=1;startSize=5;":"startArrow=none;");
    return {edge:true,pt,st};
  }
  // Recorre el SVG: cada .el (data-dio) es un grupo; los marcos de capa y el translate solo desplazan
  function recorrer(nodo,ox,oy,dest){
    for(const e of nodo.children){
      const tag=e.tagName.toLowerCase();
      if(tag==="defs"||tag==="style"||tag==="textarea")continue;
      const cs=getComputedStyle(e);
      if(cs.display==="none")continue;
      if(tag==="g"){
        let dx=ox,dy=oy;const m=(e.getAttribute("transform")||"").match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
        if(m){dx+=+m[1];dy+=+m[2]}
        const id=e.getAttribute("data-dio");
        if(id){const hijos=[];recorrer(e,dx,dy,hijos);icono(id,hijos,dx,dy);if(hijos.length)dest.push({grupo:id,hijos})}
        else recorrer(e,dx,dy,dest);
      }else if(tag==="rect"){
        const c=rect(e,ox,oy,cs);
        if(c.x===0&&c.y===0&&c.w===W&&c.h===H)continue;   // fondo blanco del póster
        dest.push(c);
      }else if(tag==="text")dest.push(texto(e,ox,oy,cs));
      else if(tag==="path")dest.push(linea(e,ox,oy,cs));
    }
  }
  // Ícono de Azure: grande y centrado a la derecha si caben los textos; si no, chico abajo a la derecha (junto al subtítulo)
  function icono(id,hijos,ox,oy){
    const e=POR_ID[id];if(!e||!ICONOS[id]||!(e.k==="nodo"||e.k==="persona"))return;
    const textos=[...document.querySelectorAll(`[data-dio="${id}"] text`)].filter(t=>!t.closest(".modelo"));
    const largo=t=>t?(t.getAttribute("textLength")?1e4:t.getComputedTextLength()):0;
    const ancho=Math.max(0,...textos.map(largo)),sub=largo(textos.find(t=>t.classList.contains("s"))||textos[1]);
    const img=`image;aspect=fixed;html=1;points=[];image=img/lib/azure2/${ICONOS[id]}.svg;`;
    let tam=Math.min(22,e.h-16);
    if(tam>=16&&13+ancho+8+tam+6<=e.w){hijos.push({x:e.x+ox+e.w-tam-6,y:e.y+oy+(e.h-tam)/2,w:tam,h:tam,st:img,v:""});return}
    tam=16;
    if(e.h>=44&&13+sub+6+tam+5<=e.w)hijos.push({x:e.x+ox+e.w-tam-5,y:e.y+oy+e.h-tam-4,w:tam,h:tam,st:img,v:""});
  }
  const arbol=[];recorrer(s,0,0,arbol);
  // Caja que encierra una lista de celdas (en coordenadas absolutas)
  function caja(l){
    let a=1e9,b=1e9,c=-1e9,d=-1e9;
    l.forEach(h=>{const ps=h.edge?h.pt:[[h.x,h.y],[h.x+h.w,h.y+h.h]];ps.forEach(([x,y])=>{a=Math.min(a,x);b=Math.min(b,y);c=Math.max(c,x);d=Math.max(d,y)})});
    return [a,b,c-a,d-b];
  }
  function emitir(c,padre,px,py){
    const id="c"+(++n);
    if(c.edge){
      const [p0,...resto]=c.pt,pf=resto.pop();
      celdas.push(`<mxCell id="${id}" style="${c.st}" edge="1" parent="${padre}"><mxGeometry relative="1" as="geometry">`+
        `<mxPoint x="${r1(p0[0]-px)}" y="${r1(p0[1]-py)}" as="sourcePoint"/><mxPoint x="${r1(pf[0]-px)}" y="${r1(pf[1]-py)}" as="targetPoint"/>`+
        (resto.length?`<Array as="points">${resto.map(([x,y])=>`<mxPoint x="${r1(x-px)}" y="${r1(y-py)}"/>`).join("")}</Array>`:"")+
        `</mxGeometry></mxCell>`);
    }else celdas.push(`<mxCell id="${id}" value="${c.v}" style="${c.st}" vertex="1" parent="${padre}"><mxGeometry x="${r1(c.x-px)}" y="${r1(c.y-py)}" width="${r1(c.w)}" height="${r1(c.h)}" as="geometry"/></mxCell>`);
  }
  arbol.forEach(c=>{
    if(!c.grupo){emitir(c,"1",0,0);return}
    if(c.hijos.length===1){emitir(c.hijos[0],"1",0,0);return}
    const [x,y,w,h]=caja(c.hijos),gid=c.grupo;
    celdas.push(`<mxCell id="${gid}" value="" style="group;" vertex="1" connectable="0" parent="1"><mxGeometry x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" as="geometry"/></mxCell>`);
    c.hijos.forEach(h=>emitir(h,gid,x,y));
  });
  const titulo=document.title.replace(/"/g,"");
  const xml=`<mxfile host="az900-simulador" agent="tools/drawio-svg.js"><diagram name="${esc(titulo)}" id="poster">`+
    `<mxGraphModel dx="${W}" dy="${H}" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${W}" pageHeight="${H}" background="#ffffff" math="0" shadow="0">`+
    `<root><mxCell id="0"/><mxCell id="1" parent="0"/>${celdas.join("")}</root></mxGraphModel></diagram></mxfile>`;
  const ta=document.createElement("textarea");ta.id="dioout";ta.style.display="none";ta.textContent=xml;document.body.appendChild(ta);
}
