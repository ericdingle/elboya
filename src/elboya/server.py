import BaseHTTPServer
import libtorrent

from elboya import settings

class HTTPServer(BaseHTTPServer.HTTPServer):

  def __init__(self, *args, **kwds):
    BaseHTTPServer.HTTPServer.__init__(self, *args, **kwds)

    self.session = libtorrent.session()
    self.session.listen_on(6881, 6891)

    self.settings = settings.Settings()
    self.ReloadSettings()

  def ReloadSettings(self):
    self.session.set_download_rate_limit(
        self.settings.Get('download_rate_limit'))
    self.session.set_upload_rate_limit(
        self.settings.Get('upload_rate_limit'))
