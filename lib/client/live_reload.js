var chokidar, consoleMessage, cssExtensions, lastRun, pathlib,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

require('colors');

pathlib = require('path');

chokidar = require('chokidar');

lastRun = {
  updateCSS: Date.now(),
  reload: Date.now()
};

cssExtensions = ['.css', '.styl', '.stylus', '.less'];

consoleMessage = {
  updateCSS: 'CSS files changed. Updating browser...',
  reload: 'Client files changed. Reloading browser...'
};

module.exports = function(root, options, ss) {
  var dir, watchDirs, watcher;
  watchDirs = (function() {
    var _i, _len, _ref, _results;
    _ref = options.liveReload;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dir = _ref[_i];
      _results.push(pathlib.join(root, options.dirs[dir]));
    }
    return _results;
  })();
  watcher = chokidar.watch(watchDirs, {
    ignored: /(\/\.|~$)/
  });
  return watcher.on('all', function(event, path) {
    var action, _ref;
    action = (_ref = pathlib.extname(path), __indexOf.call(cssExtensions, _ref) >= 0) ? 'updateCSS' : 'reload';
    if ((Date.now() - lastRun[action]) > 1000) {
      console.log('✎'.green, consoleMessage[action].grey);
      ss.publish.all('__ss:' + action);
      return lastRun[action] = Date.now();
    }
  });
};
