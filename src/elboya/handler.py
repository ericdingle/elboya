import httplib
import json
import SimpleHTTPServer
import urlparse

from elboya import torrent


class HTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

  def do_GET(self):
    path = self.path.split('?', 1)[0]
    if path == '/ajax/get_settings':
      self._GetSettings()
    elif path == '/ajax/get_torrents':
      self._GetTorrents()
    else:
      SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

  def _GetSettings(self):
    self.send_response(httplib.OK)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()

    settings = self.server.settings.GetAll()
    json.dump(settings, self.wfile)

  def _GetTorrents(self):
    self.send_response(httplib.OK)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()

    torrents = self.server.session.GetTorrents()
    json.dump(torrents, self.wfile, cls=torrent.JSONEncoder)

  def do_POST(self):
    path = self.path.split('?', 1)[0]
    if path == '/ajax/add_torrent':
      self._AddTorrent()
    elif path == '/ajax/remove_torrent':
      self._RemoveTorrent()
    elif path == '/ajax/save_settings':
      self._SaveSettings()
    else:
      self.send_error(httplib.NOT_FOUND)

  def _GetPostParams(self):
    content_length = int(self.headers.getheader('Content-Length'))
    content = self.rfile.read(content_length)
    return urlparse.parse_qs(content)

  def _AddTorrent(self):
    params = self._GetPostParams()

    if 'magnet_url' not in params:
      self.send_error(httplib.BAD_REQUEST, 'Missing magnet URL')
      return
    if 'save_path' not in params:
      self.send_error(httplib.BAD_REQUEST, 'Missing save path')
      return

    self.server.session.AddTorrent(params['magnet_url'][0],
                                   params['save_path'][0])

    self.send_response(httplib.OK)

  def _RemoveTorrent(self):
    params = self._GetPostParams()
    
    if 'hash' not in params:
      self.send_error(httplib.BAD_REQUEST, 'Missing hash')
      return

    if not self.server.session.RemoveTorrent(params['hash'][0]):
      self.send_error(httplib.BAD_REQUEST, 'Invalid hash')
      return

    self.send_response(httplib.OK)

  def _SaveSettings(self):
    params = self._GetPostParams()

    for name, value in params.iteritems():
      if not self.server.settings.Set(name, value[0]):
        self.send_error(httplib.BAD_REQUEST, 'Invalid setting: %s' % name)
        return

    self.server.settings.Save()

    self.send_response(httplib.OK)
