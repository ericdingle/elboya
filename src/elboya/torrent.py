import json
import libtorrent

class JSONEncoder(json.JSONEncoder):

  def default(self, obj):
    if isinstance(obj, libtorrent.torrent_handle):
      hash = ''
      if obj.has_metadata():
        hash = str(obj.get_torrent_info().info_hash())

      status = obj.status()

      return {
          'info': {
            'hash': hash
          },
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
