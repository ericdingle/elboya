import threading
import time
import libtorrent


class AlertHandler(object):

  def __init__(self, session):
    alert_thread = threading.Thread(target=self._GetAlerts, args=(session,))
    alert_thread.daemon = True
    alert_thread.start()

  def _GetAlerts(self, session):
    session.SetAlertMask(libtorrent.alert.category_t.status_notification)

    while True:
      alerts = session._session.pop_alerts()
      for alert in alerts:
        if alert.what() == 'torrent_finished_alert':
          session.RemoveTorrent(str(alert.handle.get_torrent_info().info_hash()))
      time.sleep(10)
