// Portada de una certificación: una tarjeta por tema con su avance (requiere progreso.js).
// Uso: portadaCert("az104")  (requiere <div id="total">, <div id="caps"> y <button id="borrar"> en la página)
// Si el tema tiene "base", la tarjeta enlaza a los capítulos de AZ-900 que conviene repasar antes.
// Si la certificación tiene "secciones" (AZ-104), las tarjetas siguen las secciones del curso en vez de los temas.

function portadaCert(certId){
  const c=CERTS.find(x=>x.id===certId);
  const etiqueta=c.id==="az900"?"Capítulo":"Dominio";
  const capAz900=n=>CAPITULOS.find(k=>k.num===n);

  // Con "secciones" (AZ-104), una tarjeta por sección del curso que enlaza a su parte de la página del dominio
  function pintarSecciones(caps){
    c.secciones.forEach(s=>{
      const t=s.tema&&c.temas.find(x=>x.id===s.tema);
      const el=document.createElement("div");
      el.className="cap"+(t?"":" pendiente");
      const p=t&&Progreso.leer(t.id,c.id),pct=t&&Progreso.porcentaje(t.id,c.id);
      const repaso=s.base?`<div class="det">Repaso AZ-900: ${s.base.map(n=>`<a href="../az900/${capAz900(n).archivo}" title="${capAz900(n).titulo}">cap. ${n}</a>`).join(" · ")}</div>`:"";
      const partes=t?`<div class="det">${s.partes.map(([n,nom])=>`<a href="${t.archivo}#s${n}">§${n} ${nom}</a>`).join(" · ")}</div>`:"";
      const quiz=t?`<div class="det extra">Resumen y quiz de <a href="${t.archivo}#${t.resumen}">${t.titulo}</a> · <a href="${t.archivo}#quiz">${pct===null?"sin empezar":`${p.mejor||0} de ${p.total} · ${pct}%`}</a></div>`:"";
      el.innerHTML=`<div class="n">Sección ${s.num}${s.pdf?` · PDF págs. ${s.pdf}`:""}</div><h2></h2>${t?"":'<div class="det">Pendiente: todavía sin simulador</div>'}${partes}${repaso}${quiz}`;
      const h=el.querySelector("h2");
      if(t){const a=document.createElement("a");a.href=`${t.archivo}#s${s.partes[0][0]}`;a.textContent=s.titulo+" →";h.appendChild(a)}
      else h.textContent=s.titulo;
      caps.appendChild(el);
    });
    const prom=Progreso.porcentajeCert(c);
    const con=c.secciones.filter(s=>s.tema).length;
    document.getElementById("total").innerHTML=`<div class="fila"><span>Avance ${c.codigo} · quiz de los ${c.temas.length} dominios · ${con} de ${c.secciones.length} secciones del curso con simulador</span><b>${prom}%</b></div><div class="bar${prom===100?" full":""}"><span style="width:${prom}%"></span></div>`;
  }

  function pintar(){
    const caps=document.getElementById("caps");caps.innerHTML="";
    if(c.secciones){pintarSecciones(caps);return}
    c.temas.forEach(t=>{
      const pct=Progreso.porcentaje(t.id,c.id),p=Progreso.leer(t.id,c.id);
      // Sin enlaces internos, la tarjeta completa es el enlace; con "Repaso", solo el título
      const entera=t.listo&&!t.base&&!t.extras;
      const el=document.createElement(entera?"a":"div");
      el.className="cap"+(t.listo?"":" pendiente");
      if(entera)el.href=t.archivo;
      const det=!t.listo?"Pendiente":pct===null?"Sin empezar":`${p.mejor||0} de ${p.total} correctas · ${pct}%`;
      const repaso=t.base?`<div class="det">Repaso AZ-900: ${t.base.map(n=>`<a href="../az900/${capAz900(n).archivo}" title="${capAz900(n).titulo}">cap. ${n}</a>`).join(" · ")}</div>`:"";
      // Prácticas del capítulo (laboratorios, guías): enlace propio y, si tienen quiz, su avance aparte
      const extras=(t.extras||[]).map(x=>{
        const q=x.quiz&&Progreso.leer(x.quiz,c.id);
        return `<div class="det extra">${x.tipo}: <a href="${x.archivo}">${x.titulo} →</a>${q?` · ${q.mejor||0} de ${q.total}`:""}</div>`;
      }).join("");
      el.innerHTML=`<div class="n">${etiqueta} ${t.num}${t.pdf?` · PDF págs. ${t.pdf}`:""}</div><h2></h2><div class="bar${pct===100?" full":""}"><span style="width:${pct||0}%"></span></div><div class="det">${det}</div>${repaso}${extras}`;
      const h=el.querySelector("h2");
      if(t.listo&&!entera){const a=document.createElement("a");a.href=t.archivo;a.textContent=t.titulo+" →";h.appendChild(a)}
      else h.textContent=t.titulo;
      caps.appendChild(el);
    });
    const prom=Progreso.porcentajeCert(c);
    const listos=c.temas.filter(t=>t.listo).length;
    document.getElementById("total").innerHTML=`<div class="fila"><span>Avance ${c.codigo} · ${listos} de ${c.temas.length} ${etiqueta.toLowerCase()}s disponibles</span><b>${prom}%</b></div><div class="bar${prom===100?" full":""}"><span style="width:${prom}%"></span></div>`;
  }
  document.getElementById("borrar").onclick=()=>{
    if(confirm(`¿Borrar el progreso de ${c.codigo}?`)){c.temas.forEach(t=>Progreso.borrar(t.id,c.id));pintar()}
  };
  pintar();
}
