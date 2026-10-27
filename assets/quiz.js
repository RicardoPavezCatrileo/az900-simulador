// Quiz compartido: carga las preguntas de data/preguntas-capXX.json, las muestra y guarda el avance con progreso.js.
// Formato de cada pregunta: {"pregunta":"...","opciones":["..."],"correcta":<índice>,"explicacion":"..."}
// Selección múltiple: "correcta":[<índice>,...]; se marcan varias opciones y se responde con "Comprobar".
// Uso: iniciarQuiz("cap07") o iniciarQuiz("identidad","az104")  (requiere <div id="score"> y <div id="quiz"> en la página)

async function iniciarQuiz(cap,cert="az900"){
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

  let p=Progreso.leer(cap,cert)||{};
  // Si cambió la cantidad de preguntas, las respuestas guardadas ya no calzan
  if(p.total!==Q.length)p={respuestas:{},total:Q.length,mejor:Math.min(p.mejor||0,Q.length)};
  const ans=p.respuestas||{};

  const multi=i=>Array.isArray(Q[i].correcta);
  // En selección múltiple la respuesta guardada es la lista ordenada de opciones marcadas
  function acierto(i){
    if(!multi(i))return ans[i]===Q[i].correcta;
    const a=[...ans[i]].sort(),c=[...Q[i].correcta].sort();
    return a.length===c.length&&a.every((v,k)=>v===c[k]);
  }
  function correctas(){return Object.keys(ans).filter(i=>acierto(i)).length}
  const marcadas={};  // selección en curso (sin comprobar) de las preguntas múltiples
  function responder(i,r){ans[i]=r;p.respuestas=ans;p.mejor=Math.max(p.mejor||0,correctas());Progreso.guardar(cap,p,cert);pintar()}

  function pintar(){
    el.innerHTML="";
    Q.forEach((x,i)=>{
      const d=document.createElement("div");d.className="q";
      d.innerHTML=`<p></p><div class="opts"></div><div class="fb"></div>`;
      d.querySelector("p").textContent=`${i+1}. ${x.pregunta}`;
      const opts=d.querySelector(".opts");
      if(multi(i)){
        const m=marcadas[i]||(marcadas[i]=new Set());
        x.opciones.forEach((o,j)=>{
          const b=document.createElement("button");b.type="button";b.textContent=o;
          if(i in ans){
            if(x.correcta.includes(j))b.className=ans[i].includes(j)?"right":"right missed";
            else if(ans[i].includes(j))b.className="wrong";
            b.disabled=true;
          }else{
            b.setAttribute("aria-pressed",String(m.has(j)));
            if(m.has(j))b.className="pick";
            b.onclick=()=>{m.has(j)?m.delete(j):m.add(j);pintar()};
          }
          opts.appendChild(b);
        });
        if(!(i in ans)){
          const c=document.createElement("button");c.type="button";c.className="btn";c.textContent="Comprobar";
          c.disabled=!m.size;
          c.onclick=()=>{responder(i,[...m].sort((a,b)=>a-b));delete marcadas[i]};
          d.querySelector(".fb").textContent="Selección múltiple: marca todas las que correspondan y presiona Comprobar.";
          d.insertBefore(c,d.querySelector(".fb"));
        }
      }else{
        x.opciones.forEach((o,j)=>{
          const b=document.createElement("button");b.type="button";b.textContent=o;
          if(i in ans){if(j===x.correcta)b.className="right";else if(j===ans[i])b.className="wrong";b.disabled=true}
          b.onclick=()=>responder(i,j);
          opts.appendChild(b);
        });
      }
      if(i in ans)d.querySelector(".fb").textContent=(acierto(i)?"Correcto. ":"Incorrecto. ")+x.explicacion;
      el.appendChild(d);
    });

    const done=Object.keys(ans).length;
    sc.innerHTML="";
    const t=document.createElement("span");
    t.textContent=done?`Puntaje: ${correctas()} de ${done} respondidas · mejor intento: ${p.mejor||0} de ${Q.length}`:"Responde para ver tu puntaje.";
    sc.appendChild(t);
    if(done){
      const b=document.createElement("button");b.type="button";b.className="btn";b.textContent="Reintentar";
      b.onclick=()=>{Object.keys(ans).forEach(k=>delete ans[k]);p.respuestas=ans;Progreso.guardar(cap,p,cert);pintar()};
      sc.appendChild(b);
    }
  }
  pintar();
}
