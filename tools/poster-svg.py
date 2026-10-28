import sys,re,html
d=open(sys.argv[1],encoding="utf-8").read()
m=re.search(r'<textarea id="svgout"[^>]*>(.*?)</textarea>',d,re.S)
svg=html.unescape(m.group(1))
open(sys.argv[2],"w",encoding="utf-8").write('<?xml version="1.0" encoding="UTF-8"?>\n'+svg)
print(len(svg),svg.count("var("),svg.count("context-stroke"))
