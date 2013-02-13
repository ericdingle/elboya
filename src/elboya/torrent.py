import json
import libtorrent
import random
import time

class JSONEncoder(json.JSONEncoder):

  def default(self, obj):
    if isinstance(obj, (libtorrent.torrent_handle, TestHandle)):
      if obj.has_metadata():
        info = {
            'hash': str(obj.get_torrent_info().info_hash()),
            'total_size': obj.get_torrent_info().total_size()
        }
      else:
        info = {
            'hash': '',
            'total_size': 0
        }

      return {
          'info': info,
          'name': obj.name(),
          'status': {
              'progress': obj.status().progress,
              'download_rate': obj.status().download_rate,
              'upload_rate': obj.status().upload_rate,
              'num_peers': obj.status().num_peers,
              'state': str(obj.status().state)
          }
      }

    return super(JSONEncoder, self).default(obj)

class TestInfo(object):

  def __init__(self, hash, total_size):
    self._hash = hash
    self._total_size = total_size

  def info_hash(self):
    return self._hash

  def total_size(self):
    return self._total_size

class TestStatus(object):

  def __init__(self, progress, download_rate, upload_rate, num_peers, state):
    self.progress = progress
    self.download_rate = download_rate
    self.upload_rate = upload_rate
    self.num_peers = num_peers
    self.state = state

class TestHandle(object):

  def __init__(self, hash, name):
    self._info = TestInfo(hash, (50 + random.randint(0, 100)) * 1024 * 1024)
    self._name = name

    self._start_time = time.time()
    self._duration = 60 * random.randint(1, 9) + random.randint(0, 60)

  def has_metadata(self):
    return True

  def get_torrent_info(self):
    return self._info

  def name(self):
    return self._name

  def status(self):
    cur_time = time.time()
    progress = min((cur_time - self._start_time) / self._duration, 1.0)

    if progress < 1:
      download_rate = (self._info.total_size() / self._duration) + 200 * random.randint(-5, 5)
      upload_rate = download_rate / 50
      num_peers = 10 + int(20 * progress) + random.randint(-1, 1)
      status = 'downloading'
    else:
      download_rate = 0
      upload_rate = 0
      num_peers = 0
      status = 'seeding'

    return TestStatus(progress, download_rate, upload_rate, num_peers, status)
