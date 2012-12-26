from elboya import handler
from elboya import server

server = server.HTTPServer(('', 8080), handler.HTTPRequestHandler)
server.serve_forever()
