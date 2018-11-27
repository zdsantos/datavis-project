import cgi, cgitb

data = cgi.FieldStorage()

output = data["var1"] // É assim que você captura os parâmetros passados.

print(output)