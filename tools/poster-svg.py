import sys,re,html
d=open(sys.argv[1],encoding="utf-8").read()
# 3.er argumento opcional: el id del textarea (dioout = archivo .drawio de tools/drawio-svg.js)
ta=sys.argv[3] if len(sys.argv)>3 else "svgout"
m=re.search(r'<textarea id="'+ta+r'"[^>]*>(.*?)</textarea>',d,re.S)
svg=html.unescape(m.group(1))
open(sys.argv[2],"w",encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n'+svg)
print(len(svg),svg.count("var("),svg.count("context-stroke"))
