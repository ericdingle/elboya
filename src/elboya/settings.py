import json

class Settings(object):

  _SETTINGS_FILE = 'settings.json'

  def __init__(self):
    self._settings = {}
    self._types = {}

    self._Define('default_save_path', str, '')
    self._Define('download_rate_limit', int, -1)
    self._Define('upload_rate_limit', int, -1)

    self._Load()

  def _Define(self, name, setting_type, default_value):
    self._settings[name] = default_value
    self._types[name] = setting_type

  def _Load(self):
    # This function assumes that the settings file was written by this class,
    # and therefore must already be valid json with settings of the right type.
    try:
      f = open(self._SETTINGS_FILE, 'r')
    except IOError:
      return

    settings = json.load(f)
    for name, value in self._settings.iteritems():
      if name in settings:
        self._settings[name] = self._settings[name]

    f.close()

  def _Save(self):
    f = open(self._SETTINGS_FILE, 'w')
    json.dump(self._settings, f, indent=2, separators=(',', ': '),
              sort_keys=True)
    f.close()

  def Get(self, name):
    return self._settings.get(name)

  def Set(self, name, value):
    if name not in self._settings:
      return False

    try:
      value = self._types[name](value)
    except ValueError:
      return False

    self._settings[name] = value
    self._Save()

    return True
