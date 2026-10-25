// Quiz compartido: carga las preguntas de data/preguntas-capXX.json, las muestra y guarda el avance con progreso.js.
// Formato de cada pregunta: {"pregunta":"...","opciones":["..."],"correcta":<índice>,"explicacion":"..."}
// Uso: iniciarQuiz("cap07")  (requiere <div id="score"> y <div id="quiz"> en la página)

async function iniciarQuiz(cap){
  const el=document.getElementById("quiz"),sc=document.getElementById("score");
  const url=`data/preguntas-${cap}.json`;
  let Q;
  try{
    const r=await fetch(url);
    if(!r.ok)throw new Error(r.status);
    Q=await r.json();
  }catch(e){
    sc.textContent="";
    el.innerHTML=`<p class="fb">No se pudieron cargar las preguntas (${url}). Abre el sitio con Live Server, no con doble clic sobre el archivo.</p>`;
    return;
  }

  let p=Progreso.leer(cap)||{};
  // Si cambió la cantidad de preguntas, las respuestas guardadas ya no calzan
  if(p.total!==Q.length)p={respuestas:{},total:Q.length,mejor:Math.min(p.mejor||0,Q.length)};
  const ans=p.respuestas||{};

  function correctas(){return Object.keys(ans).filter(i=>ans[i]===Q[i].correcta).length}

  function pintar(){
    el.innerHTML="";
    Q.forEach((x,i)=>{
      const d=document.createElement("div");d.className="q";
      d.innerHTML=`<p></p><div class="opts"></div><div class="fb"></div>`;
      d.querySelector("p").textContent=`${i+1}. ${x.pregunta}`;
      const opts=d.querySelector(".opts");
      x.opciones.forEach((o,j)=>{
        const b=document.createElement("button");b.type="button";b.textContent=o;
        if(i in ans){if(j===x.correcta)b.className="right";else if(j===ans[i])b.className="wrong";b.disabled=true}
        b.onclick=()=>{ans[i]=j;p.respuestas=ans;p.mejor=Math.max(p.mejor||0,correctas());Progreso.guardar(cap,p);pintar()};
        opts.appendChild(b);
      });
      if(i in ans)d.querySelector(".fb").textContent=(ans[i]===x.correcta?"Correcto. ":"Incorrecto. ")+x.explicacion;
      el.appendChild(d);
    });

    const done=Object.keys(ans).length;
    sc.innerHTML="";
    const t=document.createElement("span");
    t.textContent=done?`Puntaje: ${correctas()} de ${done} respondidas · mejor intento: ${p.mejor||0} de ${Q.length}`:"Responde para ver tu puntaje.";
    sc.appendChild(t);
    if(done){
      const b=document.createElement("button");b.type="button";b.className="btn";b.textContent="Reintentar";
      b.onclick=()=>{Object.keys(ans).forEach(k=>delete ans[k]);p.respuestas=ans;Progreso.guardar(cap,p);pintar()};
      sc.appendChild(b);
    }
  }
  pintar();
}
