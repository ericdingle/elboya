import json
import libtorrent

class JSONEncoder(json.JSONEncoder):

  def default(self, obj):
    if isinstance(obj, libtorrent.torrent_handle):
      status = obj.status();
      return {
          'name': obj.name(),
          'status': {
              'progress': status.progress,
              'download_rate': status.download_rate,
              'upload_rate': status.upload_rate,
              'num_peers': status.num_peers,
              'state': str(status.state)
          }
      }

    return super(JSONEncoder, self).default(obj)
