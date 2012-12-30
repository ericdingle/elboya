import httplib
import json
import libtorrent
import mimetypes
import SimpleHTTPServer
import urlparse

from elboya import torrent

class HTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

  def do_GET(self):
    path = self.path.split('?', 1)[0]
    if path == '/ajax/get_torrents':
      self.GetTorrents()
    else:
      SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

  def GetTorrents(self):
    torrents = self.server.session.get_torrents()

    self.send_response(httplib.OK)
    self.send_header('Content-Type', mimetypes.guess_extension('.json'))
    self.end_headers()

    json.dump({'torrents': torrents}, self.wfile, cls=torrent.JSONEncoder)

  def do_POST(self):
    path = self.path.split('?', 1)[0]
    if path == '/ajax/add_torrent':
      self.AddTorrent()
    elif path == '/ajax/remove_torrent':
      self.RemoveTorrent()
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

    magnet_url = params['magnet_url'][0]
    params = {'save_path': params['save_path'][0]}
    libtorrent.add_magnet_uri(self.server.session, magnet_url, params)

    self.send_response(httplib.OK)

  def RemoveTorrent(self):
    params = self.GetPostParams()
    
    if 'hash' not in params:
      self.send_error(httplib.BAD_REQUEST, 'Missing hash')
      return

    try:
      hash = params['hash'][0].decode('hex')
    except TypeError:
      self.send_error(httplib.BAD_REQUEST, 'Invalid hash')
      return

    torrent = self.server.session.find_torrent(libtorrent.big_number(hash));
    if not torrent.is_valid():
      self.send_error(httplib.BAD_REQUEST, 'Invalid torrent')
      return

    self.server.session.remove_torrent(torrent)

    self.send_response(httplib.OK)
