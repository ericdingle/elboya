import BaseHTTPServer

from elboya import session
from elboya import settings

class HTTPServer(BaseHTTPServer.HTTPServer):

  def __init__(self, *args, **kwds):
    test_session = kwds.get('test_session', False)
    del kwds['test_session']

    BaseHTTPServer.HTTPServer.__init__(self, *args, **kwds)

    if not test_session:
      self.session = session.Session()
    else:
      self.session = session.TestSession()

    self.settings = settings.Settings()
    self.ReloadSettings()

  def ReloadSettings(self):
    self.session.SetDownloadRateLimit(
        self.settings.Get('download_rate_limit'))
    self.session.SetUploadRateLimit(
        self.settings.Get('upload_rate_limit'))
