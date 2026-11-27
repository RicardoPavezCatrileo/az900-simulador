// Póster A2 de az900/cap07-arquitectura-storage.html (se inyecta tras ponerModo("estudiar"); con tools/poster-pagina.py).
// Modo claro, redundancia RA-GZRS (se dibujan todas las copias) y, en vez de la instrucción "toca LRS…",
// la regla del examen. Íconos para tools/drawio-svg.js en ICONOS_PAGINA (solo cajas, no marcos).
document.documentElement.setAttribute("data-theme","light");
red="gzrs";ra=true;sel=null;seccion=0;rec=null;
window.ICONOS_PAGINA={
 sow:"compute/Disks",sodb:"compute/Disks",ultra:"compute/Disks",hdd:"compute/Disks",
 rsv:"storage/Recovery_Services_Vaults",mdisk:"compute/Disks",files:"general/Storage_Azure_Files",queue:"general/Storage_Queue",
 table:"general/Table",append:"general/Blob_Block",page:"general/Blob_Page",pblock:"general/Blob_Block",
 pfiles:"general/Storage_Azure_Files",ppage:"general/Blob_Page"
};
document.fonts.ready.then(()=>{dibujar();poster()});
function poster(){
  const NS="http://www.w3.org/2000/svg",W=1372,H=970,DX=66,DY=72;
  // Instrucciones de la página → regla del examen
  svg.querySelectorAll("text").forEach(t=>{if(/^(toca LRS|\(abajo a la|ver dónde quedan)/.test(t.textContent))t.remove()});
  [["Regla del examen:","nota fuerte"],["\"tipo de disco\" → sección 4","nota"],["\"cuenta de almacenamiento\" → sección 2","nota"],["Hot/Cool/Cold/Archive → solo Block (GPv2)","nota"]]
    .forEach(([s,c],i)=>texto(950,532+i*16,s,c));
  const P=["fill","stroke","stroke-width","stroke-dasharray","stroke-linejoin","opacity","font-family","font-size","font-weight","letter-spacing","paint-order"];
  const copia=svg.cloneNode(true);
  const orig=[...svg.querySelectorAll("*")],cl=[...copia.querySelectorAll("*")];
  const quitar=[],colores=new Set();
  orig.forEach((o,i)=>{
    const c=cl[i],cs=getComputedStyle(o);
    if(o.closest("defs"))return;
    if(cs.display==="none"||cs.visibility==="hidden"){quitar.push(c);return}
    c.removeAttribute("class");c.removeAttribute("tabindex");c.removeAttribute("role");c.removeAttribute("data-id");
    c.setAttribute("style",P.map(p=>p+":"+cs.getPropertyValue(p)).join(";"));
    if(c.getAttribute("marker-end")){const k=cs.getPropertyValue("stroke");colores.add(k);c.setAttribute("marker-end","url(#p"+[...colores].indexOf(k)+")")}
  });
  quitar.forEach(c=>c.remove());
  copia.querySelector("defs").innerHTML=[...colores].map((k,i)=>`<marker id="p${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="${k}"/></marker>`).join("");
  const s=document.createElementNS(NS,"svg");
  s.setAttribute("xmlns",NS);s.setAttribute("viewBox",`0 0 ${W} ${H}`);s.setAttribute("width",W);s.setAttribute("height",H);
  document.body.innerHTML="";document.body.style.cssText="margin:0;background:#fff";document.body.appendChild(s);
  const t=(x,y,txt,st)=>{const e=document.createElementNS(NS,"text");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("style",st);e.textContent=txt;s.appendChild(e);return e};
  const r=(x,y,w,h,st,rx=0)=>{const e=document.createElementNS(NS,"rect");[["x",x],["y",y],["width",w],["height",h],["rx",rx]].forEach(([a,v])=>e.setAttribute(a,v));e.setAttribute("style",st);s.appendChild(e)};
  const css=getComputedStyle(document.documentElement),v=n=>css.getPropertyValue(n).trim();
  const fD='font-family:Archivo,"Segoe UI",sans-serif',fB='font-family:"IBM Plex Sans","Segoe UI",sans-serif',fM='font-family:"IBM Plex Mono",Consolas,monospace';
  const st=document.createElementNS(NS,"style");st.textContent='@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");';s.appendChild(st);
  r(0,0,W,H,"fill:#ffffff");
  t(DX,32,"AZ-900 · CAPÍTULO 7 · ALMACENAMIENTO",`${fM};font-size:11px;letter-spacing:.08em;fill:${v("--accent")}`);
  t(DX,60,"Arquitectura de almacenamiento: la guía visual en un caso real",`${fD};font-size:24px;font-weight:800;fill:${v("--ink")}`);
  t(W-DX,32,"complemento de la Guía Visual Azure Storage Account · Contoso · Brazil South",`${fM};font-size:11px;fill:${v("--muted")};text-anchor:end`);
  t(W-DX,50,"números = secciones de la guía · copias dibujadas con RA-GZRS",`${fM};font-size:11px;fill:${v("--muted")};text-anchor:end`);
  const g=document.createElementNS(NS,"g");g.setAttribute("transform",`translate(${DX},${DY})`);
  g.appendChild(copia.querySelector("defs"));[...copia.childNodes].forEach(n=>g.appendChild(n));s.appendChild(g);
  // Leyenda de colores
  let x=DX;const y=DY+860+20;
  t(x,y+4,"COLORES",`${fM};font-size:10px;letter-spacing:.06em;fill:${v("--muted")}`);x+=62;
  [["--c-blob","Blob"],["--c-files","Files"],["--c-queue","Queue"],["--c-table","Table / Standard"],["--c-disk","Discos administrados"],["--c-cmp","Cómputo (VMs)"],["--rbr","Brazil South"],["--rus","South Central US"]]
    .forEach(([c,n])=>{r(x,y-6,11,11,`fill:${v(c)}`,3);const e=t(x+16,y+4,n,`${fB};font-size:11px;fill:${v("--ink")}`);x+=e.getComputedTextLength()+30});
  x+=6;
  const e=t(x,y+4,"AZ-104",`${fM};font-size:10px;font-weight:600;fill:${v("--bad")}`);x+=e.getComputedTextLength()+6;
  t(x,y+4,"= va más allá del AZ-900 · línea punteada = temporal o fuera de línea",`${fB};font-size:11px;fill:${v("--ink")}`);
  const ser=new XMLSerializer().serializeToString(s);
  const ta=document.createElement("textarea");ta.id="svgout";ta.style.display="none";ta.textContent=ser;document.body.appendChild(ta);
}
