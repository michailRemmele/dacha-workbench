const { dialog } = require('electron')
const path = require('path')

module.exports = async (assetsPath, extensions) => {
  const result = await dialog.showOpenDialog({
    defaultPath: path.resolve(assetsPath),
    properties: ['openFile'],
    filters: extensions !== undefined ? [
      { name: 'Images', extensions },
    ] : [],
  })

  if (!result.filePaths[0]) {
    return undefined
  }

  const relativePlatformPath = path.relative(path.resolve(assetsPath), result.filePaths[0])

  // It is forbidden to select file outside of assets folder
  // On Windows relative path can be calculated as absolute if file is on another drive
  if (relativePlatformPath.startsWith('..') || path.isAbsolute(relativePlatformPath)) {
    return undefined
  }

  return relativePlatformPath.split(path.sep).join(path.posix.sep)
}
