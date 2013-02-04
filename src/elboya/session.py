import libtorrent
import random
import time

class Session(object):

  def __init__(self):
    self._session = libtorrent.session()
    self._session.listen_on(6881, 6891)

  def AddTorrent(self, magnet_url, save_path):
    libtorrent.add_magnet_uri(self._session, magnet_url,
                              {'save_path': save_path})

  def GetTorrents(self):
    return self._session.get_torrents()

  def RemoveTorrent(self, hash):
    try:
      hash = libtorrent.big_number(hash.decode('hex'))
    except TypeError:
      return False

    torrent = self._session.find_torrent(hash)
    if not torrent.is_valid():
      return False

    self._session.remove_torrent(torrent)
    return True

  def SetDownloadRateLimit(self, limit):
    self._session.set_download_rate_limit(limit)

  def SetUploadRateLimit(self, limit):
    self._session.set_upload_rate_limit(limit)

class TestSession(object):

  def __init__(self):
    self._next_hash = 0
    self._torrents = {}

  def AddTorrent(self, magnet_url, save_path):
    self._next_hash += 1
    self._torrents[self._next_hash] = {
        'name': magnet_url,
        'time': time.time(),
        'duration': 60 * random.randint(1, 10)
    }

  def GetTorrents(self):
    cur_time = time.time()

    torrents = []
    for hash, torrent in self._torrents.iteritems():
      progress = min((cur_time - torrent['time']) / torrent['duration'], 1.0)
      torrents.append({
          'info': {
            'hash': hash
          },
          'name': torrent['name'],
          'status': {
            'progress': progress,
            'download_rate': 100,
            'upload_rate': 10,
            'num_peers': 5,
            'state': 'seeding' if progress == 1.0 else 'download'
          }
      })

    return torrents

  def RemoveTorrent(self, hash):
    del self._torrents[hash]

  def SetDownloadRateLimit(self, limit):
    pass

  def SetUploadRateLimit(self, limit):
    pass
