document.documentElement.setAttribute("data-theme","light");
hasta=11;resaltar=false;flujo=null;sel=null;
document.fonts.ready.then(()=>{dibujar();aplicar();poster()});
function poster(){
  const NS="http://www.w3.org/2000/svg",W=1372,H=970,DX=66,DY=72;
  const P=["fill","stroke","stroke-width","stroke-dasharray","stroke-linejoin","opacity","font-family","font-size","font-weight","letter-spacing","paint-order"];
  const copia=svg.cloneNode(true);
  const orig=[...svg.querySelectorAll("*")],cl=[...copia.querySelectorAll("*")];
  const quitar=[],colores=new Set();
  orig.forEach((o,i)=>{
    const c=cl[i],cs=getComputedStyle(o);
    if(o.closest("defs"))return;
    if(cs.display==="none"){quitar.push(c);return}
    c.removeAttribute("class");c.removeAttribute("tabindex");c.removeAttribute("role");c.removeAttribute("data-id");
    c.setAttribute("style",P.map(p=>p+":"+cs.getPropertyValue(p)).join(";"));
    if(c.getAttribute("marker-end")){const k=cs.getPropertyValue("stroke");colores.add(k);c.setAttribute("marker-end","url(#p"+[...colores].indexOf(k)+")")}
  });
  quitar.forEach(c=>c.remove());
  copia.querySelector("defs").innerHTML=[...colores].map((k,i)=>`<marker id="p${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="${k}"/></marker>`).join("");
  const s=document.createElementNS(NS,"svg");
  s.setAttribute("xmlns",NS);s.setAttribute("viewBox",`0 0 ${W} ${H}`);s.setAttribute("width",W);s.setAttribute("height",H);
  document.body.innerHTML="";document.body.style.cssText="margin:0;background:#fff";document.body.appendChild(s);
  const t=(x,y,txt,st)=>{const e=document.createElementNS(NS,"text");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("style",st);e.textContent=txt;s.appendChild(e);return e};
  const r=(x,y,w,h,st,rx=0)=>{const e=document.createElementNS(NS,"rect");[["x",x],["y",y],["width",w],["height",h],["rx",rx]].forEach(([a,v])=>e.setAttribute(a,v));e.setAttribute("style",st);s.appendChild(e)};
  const css=getComputedStyle(document.documentElement),v=n=>css.getPropertyValue(n).trim();
  const fD='font-family:Archivo,"Segoe UI",sans-serif',fB='font-family:"IBM Plex Sans","Segoe UI",sans-serif',fM='font-family:"IBM Plex Mono",Consolas,monospace';
  const st=document.createElementNS(NS,"style");st.textContent='@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap");';s.appendChild(st);
  r(0,0,W,H,"fill:#ffffff");
  t(DX,32,"AZ-900 · MICROSOFT AZURE FUNDAMENTALS",`${fM};font-size:11px;letter-spacing:.08em;fill:${v("--accent")}`);
  t(DX,60,"Arquitectura de referencia: web de 3 niveles con la oficina conectada",`${fD};font-size:24px;font-weight:800;fill:${v("--ink")}`);
  t(W-DX,60,"Brazil South · 3 zonas · región emparejada South Central US",`${fM};font-size:11px;fill:${v("--muted")};text-anchor:end`);
  const g=document.createElementNS(NS,"g");g.setAttribute("transform",`translate(${DX},${DY})`);
  g.appendChild(copia.querySelector("defs"));[...copia.childNodes].forEach(n=>g.appendChild(n));s.appendChild(g);
  // Leyenda
  let x=DX;const y=DY+860+20;
  t(x,y+4,"PIEZAS",`${fM};font-size:10px;letter-spacing:.06em;fill:${v("--muted")}`);x+=52;
  AREAS.forEach((a,i)=>{r(x,y-6,11,11,`fill:${v("--a"+i)}`,3);const e=t(x+16,y+4,a.n,`${fB};font-size:11px;fill:${v("--ink")}`);x+=e.getComputedTextLength()+34});
  x+=14;
  t(x,y+4,"FLECHAS",`${fM};font-size:10px;letter-spacing:.06em;fill:${v("--muted")}`);x+=60;
  [[1,"tráfico web y oficina"],[3,"datos"],[0,"identidad"],[4,"gestión"],[5,"costos"]].forEach(([i,n])=>{r(x,y-1,20,3,`fill:${v("--a"+i)}`);const e=t(x+26,y+4,n,`${fB};font-size:11px;fill:${v("--ink")}`);x+=e.getComputedTextLength()+44});
  const ser=new XMLSerializer().serializeToString(s);
  const ta=document.createElement("textarea");ta.id="svgout";ta.style.display="none";ta.value=ser;document.body.appendChild(ta);
  ta.textContent=ser;
}
