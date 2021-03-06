import json


class Settings(object):

  _SETTINGS_FILE = 'settings.json'

  def __init__(self):
    self._values = {}
    self._types = {}

    self._Define('default_save_path', '')
    self._Define('download_rate_limit', 0)
    self._Define('upload_rate_limit', 0)
    
    self._Load()
    
  def _Define(self, name, default_value):
    self._values[name] = default_value
    self._types[name] = type(default_value)

  def _Load(self):
    try:
      f = open(self._SETTINGS_FILE, 'r')
    except IOError as e:
      print 'Error loading settings: %s' % e
      return

    values = json.load(f)
    f.close()

    for name, value in self._values.iteritems():
      if name in values:
        self._values[name] = values[name]
    
  def Get(self, name):
    return self._values.get(name)

  def GetAll(self):
    return self._values.copy()

  def Set(self, name, value):
    if name not in self._values:
      return False

    try:
      value = self._types[name](value)
    except ValueError:
      return False

    self._values[name] = value

    return True

  def Save(self):
    f = open(self._SETTINGS_FILE, 'w')
    json.dump(self._values, f, indent=2, separators=(',', ': '),
              sort_keys=True)
    f.close()
