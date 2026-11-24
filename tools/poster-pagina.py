import sys,re
src,js,out=sys.argv[1:4]
# 4.º argumento opcional: la línea de arranque de la página, tras la que se inyecta el script del póster
s=open(src,encoding="utf-8").read()
s=re.sub(r"^try\{const v=","//try{const v=",s,flags=re.M)
a=sys.argv[4] if len(sys.argv)>4 else "dibujar();aplicar();panelCapitulo();"
assert s.count(a)==1
s=s.replace(a,a+"\n"+open(js,encoding="utf-8").read())
open(out,"w",encoding="utf-8").write(s);print("ok")
