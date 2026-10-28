import sys,re
src,js,out=sys.argv[1:4]
s=open(src,encoding="utf-8").read()
s=re.sub(r"^try\{const v=","//try{const v=",s,flags=re.M)
a="dibujar();aplicar();panelCapitulo();"
assert s.count(a)==1
s=s.replace(a,a+"\n"+open(js,encoding="utf-8").read())
open(out,"w",encoding="utf-8").write(s);print("ok")
