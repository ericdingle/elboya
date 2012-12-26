import BaseHTTPServer
import libtorrent

class HTTPServer(BaseHTTPServer.HTTPServer):

  def __init__(self, *args, **kwds):
    BaseHTTPServer.HTTPServer.__init__(self, *args, **kwds)

    self.session = libtorrent.session()
    self.session.listen_on(6881, 6891)
