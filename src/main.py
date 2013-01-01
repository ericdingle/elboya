import optparse

from elboya import handler
from elboya import server

parser = optparse.OptionParser()
parser.add_option('--test_session', action='store_true', default=False,
                  dest='test_session', help='Use a test torrent session.')
options, _ = parser.parse_args()

server = server.HTTPServer(('', 8080), handler.HTTPRequestHandler,
                           test_session=options.test_session)
server.serve_forever()
