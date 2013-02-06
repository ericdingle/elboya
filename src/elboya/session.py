import libtorrent

from elboya import torrent

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
    hash = str(self._next_hash)
    self._torrents[hash] = torrent.TestHandle(hash, magnet_url)

  def GetTorrents(self):
    return self._torrents.values()

  def RemoveTorrent(self, hash):
    del self._torrents[hash]
    return True

  def SetDownloadRateLimit(self, limit):
    pass

  def SetUploadRateLimit(self, limit):
    pass
