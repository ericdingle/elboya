import json
import libtorrent
import random
import time

from collections import namedtuple


class JSONEncoder(json.JSONEncoder):

  def default(self, obj):
    if isinstance(obj, (libtorrent.torrent_info, TestInfo)):
      return {'hash': str(obj.info_hash()),
              'total_size': obj.total_size()}

    if isinstance(obj, (libtorrent.torrent_status, TestStatus)):
      return {'progress': obj.progress,
              'download_rate': obj.download_rate,
              'upload_rate': obj.upload_rate,
              'num_peers': obj.num_peers,
              'state': str(obj.state)}

    if isinstance(obj, (libtorrent.torrent_handle, TestHandle)):
      info = {'hash': '', 'total_size': 0}
      if obj.has_metadata():
        info = self.default(obj.get_torrent_info())

      return {'info': info,
              'name': obj.name(),
              'status': self.default(obj.status())}

    return super(JSONEncoder, self).default(obj)


class TestInfo(object):

  def __init__(self, hash, total_size):
    self._hash = hash
    self._total_size = total_size

  def info_hash(self):
    return self._hash

  def total_size(self):
    return self._total_size


TestStatus = namedtuple(
    'TestStatus',
    ['progress', 'download_rate', 'upload_rate', 'num_peers', 'state'])


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
