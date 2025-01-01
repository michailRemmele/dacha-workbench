const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')

const getExtensionWebpackConfig = require('../webpack.extension.config')

const applyExtension = (entry, app, window) => {
  const compiler = webpack(getExtensionWebpackConfig(entry))

  let lastHash
  compiler.hooks.afterDone.tap('extensionWatcher', (stats) => {
    if (lastHash === undefined) {
      lastHash = stats.hash
      return
    }

    if (lastHash !== stats.hash) {
      lastHash = stats.hash
      window.webContents.reload()
    }
  })

  app.use(
    middleware(compiler),
  )
}

module.exports = applyExtension
