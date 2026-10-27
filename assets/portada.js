// Portada de una certificación: una tarjeta por tema con su avance (requiere progreso.js).
// Uso: portadaCert("az104")  (requiere <div id="total">, <div id="caps"> y <button id="borrar"> en la página)
// Si el tema tiene "base", la tarjeta enlaza a los capítulos de AZ-900 que conviene repasar antes.

function portadaCert(certId){
  const c=CERTS.find(x=>x.id===certId);
  const etiqueta=c.id==="az900"?"Capítulo":"Dominio";
  const capAz900=n=>CAPITULOS.find(k=>k.num===n);

  function pintar(){
    const caps=document.getElementById("caps");caps.innerHTML="";
    c.temas.forEach(t=>{
      const pct=Progreso.porcentaje(t.id,c.id),p=Progreso.leer(t.id,c.id);
      // Sin enlaces internos, la tarjeta completa es el enlace; con "Repaso", solo el título
      const entera=t.listo&&!t.base;
      const el=document.createElement(entera?"a":"div");
      el.className="cap"+(t.listo?"":" pendiente");
      if(entera)el.href=t.archivo;
      const det=!t.listo?"Pendiente":pct===null?"Sin empezar":`${p.mejor||0} de ${p.total} correctas · ${pct}%`;
      const repaso=t.base?`<div class="det">Repaso AZ-900: ${t.base.map(n=>`<a href="../az900/${capAz900(n).archivo}" title="${capAz900(n).titulo}">cap. ${n}</a>`).join(" · ")}</div>`:"";
      el.innerHTML=`<div class="n">${etiqueta} ${t.num}${t.pdf?` · PDF págs. ${t.pdf}`:""}</div><h2></h2><div class="bar${pct===100?" full":""}"><span style="width:${pct||0}%"></span></div><div class="det">${det}</div>${repaso}`;
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
