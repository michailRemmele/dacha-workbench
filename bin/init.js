const path = require('path')
const fs = require('fs')

const DATA_FOLDER_NAME = 'data'
const ASSETS_FOLDER_NAME = 'assets'

const INITIAL_DATA = {
  scenes: [],
  levels: [],
  templates: [],
  loaders: [],
  startSceneId: null,
  startLoaderId: null,
}

const init = () => {
  const dataPath = path.resolve(DATA_FOLDER_NAME)
  const assetsPath = path.resolve(DATA_FOLDER_NAME, ASSETS_FOLDER_NAME)

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath)
  }
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath)
  }

  fs.writeFileSync(path.resolve(dataPath, 'data.json'), JSON.stringify(INITIAL_DATA, null, 2))
  fs.writeFileSync(path.resolve('remiz-editor.config.js'), `module.exports = ${JSON.stringify({
    projectConfig: `${DATA_FOLDER_NAME}/data.json`,
    assets: `${DATA_FOLDER_NAME}/${ASSETS_FOLDER_NAME}`,
  }, null, 2)}`)
}

module.exports = init
