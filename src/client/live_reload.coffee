# Live Reload
# -----------
# Detects changes in client files and sends an event to connected browsers instructing them to refresh the page

require('colors')
pathlib = require('path')
chokidar = require('chokidar')

lastRun =
  updateCSS: Date.now()
  reload:    Date.now()

cssExtensions = ['.css', '.styl', '.stylus', '.less']

consoleMessage =
  updateCSS: 'CSS files changed. Updating browser...'
  reload:    'Client files changed. Reloading browser...'


module.exports = (root, options, ss) ->

  watchDirs = for dir in options.liveReload
    pathlib.join root, options.dirs[dir]

  watcher = chokidar.watch watchDirs, { ignored: /(\/\.|~$)/ }
  watcher.on 'all', (event, path) ->
    action = if pathlib.extname(path) in cssExtensions then 'updateCSS' else 'reload'
    if (Date.now() - lastRun[action]) > 1000  # Reload browser max once per second
      console.log('✎'.green, consoleMessage[action].grey)
      ss.publish.all('__ss:' + action)
      lastRun[action] = Date.now()