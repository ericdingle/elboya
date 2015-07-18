import httplib
import json
import libtorrent
import SimpleHTTPServer
import urlparse

from elboya import torrent

class HTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

  def do_GET(self):
    path = self.path.split('?', 1)[0]
    if path == '/ajax/get_settings':
      self.GetSettings()
    elif path == '/ajax/get_torrents':
      self.GetTorrents()
    else:
      SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

  def GetSettings(self):
    self.send_response(httplib.OK)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()

    json.dump(self.server.settings.GetAll(), self.wfile)

  def GetTorrents(self):
    torrents = self.server.session.GetTorrents()

    self.send_response(httplib.OK)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()

    json.dump({'torrents': torrents}, self.wfile, cls=torrent.JSONEncoder)

  def do_POST(self):
    path = self.path.split('?', 1)[0]
    if path == '/ajax/add_torrent':
      self.AddTorrent()
    elif path == '/ajax/remove_torrent':
      self.RemoveTorrent()
    elif path == '/ajax/save_settings':
      self.SaveSettings()
    else:
      self.send_error(httplib.NOT_FOUND)

  def GetPostParams(self):
    content_length = int(self.headers.getheader('Content-Length'))
    content = self.rfile.read(content_length)
    return urlparse.parse_qs(content)

  def AddTorrent(self):
    params = self.GetPostParams()

    if 'magnet_url' not in params:
      self.send_error(httplib.BAD_REQUEST, 'Missing magnet URL')
      return
    if 'save_path' not in params:
      self.send_error(httplib.BAD_REQUEST, 'Missing save path')
      return

    self.server.session.AddTorrent(params['magnet_url'][0],
                                   params['save_path'][0])

    self.send_response(httplib.OK)

  def RemoveTorrent(self):
    params = self.GetPostParams()
    
    if 'hash' not in params:
      self.send_error(httplib.BAD_REQUEST, 'Missing hash')
      return

    if not self.server.session.RemoveTorrent(params['hash'][0]):
      self.send_error(httplib.BAD_REQUEST, 'Invalid hash')
      return

    self.send_response(httplib.OK)

  def SaveSettings(self):
    params = self.GetPostParams()

    for name, value in params.iteritems():
      if not self.server.settings.Set(name, value[0]):
        self.send_error(httplib.BAD_REQUEST, 'Invalid setting: %s' % name)
        return

    self.server.settings.Save()

    self.send_response(httplib.OK)
