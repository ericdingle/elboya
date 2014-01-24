import threading
import time
import libtorrent

class AlertHandler(object):

  def __init__(self,session):
    self._session = session
    self._workerThread = threading.Thread(target=self._GetAlerts,args=(self._session,))
    self._workerThread.daemon = True #daemon thread will not hang around after main thread is killed

  def _GetAlerts(self,session):
    #every 10 seconds, check if any torrents are finished
    session._session.set_alert_mask(libtorrent.alert.category_t.status_notification)
    while True:
      alerts = session._session.pop_alerts()
      for alert in alerts:
        if alert.what() == 'torrent_finished_alert':
          session.RemoveTorrent(str(alert.handle.get_torrent_info().info_hash()))
      time.sleep(10)

  def StartMonitoring(self):
    self._workerThread.start()
