// Póster A2 de az900/cap06-lab-conectividad.html (se inyecta tras iniciarQuiz("peering"); con tools/poster-pagina.py).
// Configuración con todo conectado (S2S + P2S, tránsito de gateway, los 3 peerings, conexión directa web ↔ dr,
// firewall en el hub y private endpoint), el camino Oficina → stprod resaltado y, abajo, la tabla "Los 3 tramos".
// Para tools/drawio-svg.js: POR_ID (geometría de cada caja, sacada del SVG) e ICONOS_PAGINA.
document.documentElement.setAttribute("data-theme","light");
cfg={...INI,ofi:"s2s",p2s:true,gt:true,hA:true,hB:true,hC:true,AB:true,v2v:false,fw:true,st:"pe"};o="of";d="st";
window.ICONOS_PAGINA={
 n_of:"networking/Local_Network_Gateways",n_vgw:"networking/Virtual_Network_Gateways",n_fw:"networking/Firewalls",
 n_vmw:"compute/Virtual_Machine",n_pe:"networking/Private_Endpoint",n_vmd:"compute/Virtual_Machine",n_vmb:"databases/SQL_Server",
 v_st:"storage/Storage_Accounts",v_inet:"general/Globe"
};
const POR_ID={};
document.fonts.ready.then(()=>{dibujar();poster()});
function poster(){
  const NS="http://www.w3.org/2000/svg",W=1372,H=970,DX=81,DY=72;
  // Cajas que no se usan en esta configuración (VPN Gateways del VNet-to-VNet): fuera del póster
  svg.querySelectorAll(".nd.off").forEach(g=>g.remove());
  // Marca cada caja para drawio-svg.js (data-dio) y guarda su geometría
  svg.querySelectorAll("[data-n],[data-v]").forEach(g=>{
    const id=g.dataset.n?"n_"+g.dataset.n:"v_"+g.dataset.v;
    if(g.dataset.v&&!ICONOS_PAGINA[id])return;   // las VNets no llevan ícono: quedan como marcos sueltos
    const r=g.querySelector("rect");
    g.setAttribute("data-dio",id);
    POR_ID[id]={x:+r.getAttribute("x"),y:+r.getAttribute("y"),w:+r.getAttribute("width"),h:+r.getAttribute("height"),k:"caja"};
  });
  const P=["fill","stroke","stroke-width","stroke-dasharray","stroke-linejoin","opacity","font-family","font-size","font-weight","letter-spacing","paint-order"];
  const copia=svg.cloneNode(true);
  const orig=[...svg.querySelectorAll("*")],cl=[...copia.querySelectorAll("*")];
  const quitar=[];
  orig.forEach((o,i)=>{
    const c=cl[i],cs=getComputedStyle(o);
    if(cs.display==="none"){quitar.push(c);return}
    c.removeAttribute("class");
    c.setAttribute("style",P.map(p=>p+":"+cs.getPropertyValue(p)).join(";"));
  });
  quitar.forEach(c=>c.remove());
  const s=document.createElementNS(NS,"svg");
  s.setAttribute("xmlns",NS);s.setAttribute("viewBox",`0 0 ${W} ${H}`);s.setAttribute("width",W);s.setAttribute("height",H);
  document.body.innerHTML="";document.body.style.cssText="margin:0;background:#fff";document.body.appendChild(s);
  const t=(x,y,txt,st,max)=>{const e=document.createElementNS(NS,"text");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("style",st);e.textContent=txt;s.appendChild(e);
    if(max){let f=parseFloat(e.style.fontSize);while(e.getComputedTextLength()>max&&f>7){f-=.25;e.style.fontSize=f+"px"}}return e};
  const r=(x,y,w,h,st,rx=0)=>{const e=document.createElementNS(NS,"rect");[["x",x],["y",y],["width",w],["height",h],["rx",rx]].forEach(([a,v])=>e.setAttribute(a,v));e.setAttribute("style",st);s.appendChild(e)};
  const css=getComputedStyle(document.documentElement),v=n=>css.getPropertyValue(n).trim();
  const fD='font-family:Archivo,"Segoe UI",sans-serif',fB='font-family:"IBM Plex Sans","Segoe UI",sans-serif',fM='font-family:"IBM Plex Mono",Consolas,monospace';
  const st=document.createElementNS(NS,"style");st.textContent='@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");';s.appendChild(st);
  r(0,0,W,H,"fill:#ffffff");
  t(DX,32,"AZ-900 · CAPÍTULO 6 · REDES (ENDPOINTS: CAP. 9)",`${fM};font-size:11px;letter-spacing:.08em;fill:${v("--accent")}`);
  t(DX,60,"Conectividad en 3 tramos: fuera de Azure → VNet, VNet ↔ VNet, VNet → PaaS",`${fD};font-size:24px;font-weight:800;fill:${v("--ink")}`);
  // Leyenda: en el espacio libre de la región emparejada, bajo vnet-dr
  [["Cómo leer las líneas",1],["verde = conectado",0],["gris punteado = VPN por Internet",0],["gris claro = sin conexión · rojo = error",0],["",0],
   ["azul grueso = un ejemplo de camino:",2],["Oficina → VPN → hub → peering →",2],["vnet-web → private endpoint → stprod",2],["",0],
   ["El peering no es transitivo:",1],["oficina → radios: tránsito de gateway",0],["radio → radio: peering directo o firewall",0]]
    .forEach(([l,k],i)=>{if(l)t(DX+916,DY+418+i*16,l,`${k===1?fB+";font-weight:600;font-size:11.5px":fM+";font-size:10.5px"};fill:${k===2?v("--accent"):k===1?v("--ink"):v("--muted")}`,264)});
  const g=document.createElementNS(NS,"g");g.setAttribute("transform",`translate(${DX},${DY})`);
  [...copia.childNodes].forEach(n=>g.appendChild(n));s.appendChild(g);
  // Tabla "Los 3 tramos" (sección 4 de la página)
  const cols=[170,190,350,250,250],cab=["Tramo","Opción","Qué conecta","Necesita","Pista en el enunciado"];
  const filas=[
   ["1 · Fuera de Azure → VNet","VPN Gateway · Site-to-Site","Toda la oficina, permanente, cifrado por Internet","Dispositivo VPN en la oficina + VPN Gateway","\"oficina\", \"sucursal\""],
   ["","VPN Gateway · Point-to-Site","Un solo equipo, cifrado por Internet","Cliente VPN en el equipo + VPN Gateway","\"trabajador remoto\", \"desde casa\""],
   ["","ExpressRoute","La oficina por un circuito privado de un proveedor","Circuito con el proveedor + ExpressRoute Gateway","\"sin pasar por Internet\", \"dedicado\""],
   ["2 · VNet → VNet","VNet peering","Directo por la red troncal de Microsoft, local o global","Nada: sin gateway (se cobra por GB)","\"dos VNets\", \"menor latencia\""],
   ["","VNet-to-VNet","Túnel IPsec entre dos VNets","VPN Gateway en cada VNet","\"cifrado IPsec entre VNets\""],
   ["3 · VNet → servicio PaaS","Service endpoint","El servicio sigue con IP pública, pero solo deja entrar a tu subred","Gratis; no sirve desde la oficina","\"solo una subred\", \"sin costo\""],
   ["","Private endpoint","El servicio recibe una IP privada dentro de tu VNet","Tiene costo; sí sirve desde la oficina por VPN","\"IP privada\", \"deshabilitar acceso público\""]];
  const y0=DY+680+16,hc=22,hf=22,line=v("--line"),ink=v("--ink"),mut=v("--muted");
  r(DX,y0,1210,hc,`fill:${v("--accent-soft")||"#eef2ff"};stroke:${line}`,0);
  let x=DX;cab.forEach((c,i)=>{t(x+8,y0+15,c.toUpperCase(),`${fM};font-size:9.5px;letter-spacing:.05em;fill:${mut}`,cols[i]-12);x+=cols[i]});
  filas.forEach((f,j)=>{
    const y=y0+hc+j*hf,nuevo=f[0]!=="";
    r(DX,y,1210,hf,`fill:${j%2?"#ffffff":"#f8fafc"};stroke:${line}`,0);
    if(nuevo&&j)r(DX,y,1210,1.6,`fill:${mut}`,0);
    let x=DX;f.forEach((c,i)=>{if(c)t(x+8,y+15,c,`${i<2?fB+";font-weight:600":fB};font-size:10.5px;fill:${i===0?v("--accent"):ink}`,cols[i]-14);x+=cols[i]});
  });
  const ser=new XMLSerializer().serializeToString(s);
  const ta=document.createElement("textarea");ta.id="svgout";ta.style.display="none";ta.textContent=ser;document.body.appendChild(ta);
}
