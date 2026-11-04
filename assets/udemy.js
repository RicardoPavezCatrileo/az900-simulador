// Porcentajes de los simulacros de Udemy (externos), compartidos por index.html y az900/index.html.
// [examen, 1.ª vuelta, 2.ª vuelta]; null = pendiente. Actualizar aquí cada puntaje nuevo.
const UDEMY=[[1,75,null],[2,66,72],[3,68,null],[4,74,null],[5,58,null],[6,64,null]];
(function(){
  const APR=70;
  const celda=v=>v==null?'<td class="n">—</td>':`<td class="${v>=APR?"y":"bajo"}">${v}%${v>=APR?" ✓":""}</td>`;
  const prom=i=>{const v=UDEMY.map(r=>r[i]).filter(x=>x!=null);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):null};
  document.querySelectorAll("section.udemy").forEach(sec=>{
    let filas="";
    UDEMY.forEach(([n,a,b])=>{const d=a!=null&&b!=null?b-a:null;
      filas+=`<tr><td>Examen ${n}</td>${celda(a)}${celda(b)}<td class="${d==null?"n":d>=0?"y":"bajo"}">${d==null?"—":(d>0?"+":"")+d+" pts"}</td></tr>`});
    filas+=`<tr class="prom"><td>Promedio</td>${celda(prom(1))}${celda(prom(2))}<td class="n"></td></tr>`;
    sec.innerHTML=`<h2 class="seccion-herr">Porcentajes de Udemy · simulacros AZ-900</h2><div class="tbl"><table><thead><tr><th>Examen</th><th>1.ª vuelta</th><th>2.ª vuelta</th><th>Diferencia</th></tr></thead><tbody>${filas}</tbody></table></div><p class="nota-udemy">Se aprueba con 70%. Las preguntas falladas están en el quiz de su capítulo y en <a href="${sec.dataset.dudas}">Las dudas del examen</a>.</p>`;
  });
})();
