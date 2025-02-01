const {
  app,
  Menu,
} = require('electron')

const MESSAGES = require('./messages')

module.exports = (window) => Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { role: 'quit' },
    ],
  },
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Save',
        accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
        click: () => window.webContents.send(MESSAGES.SAVE),
      },
    ],
  },
  {
    role: 'editMenu',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: () => window.webContents.send(MESSAGES.UNDO),
      },
      {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click: () => window.webContents.send(MESSAGES.REDO),
      },

      { type: 'separator' },

      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: () => window.webContents.send(MESSAGES.CUT),
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: () => window.webContents.send(MESSAGES.COPY),
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: () => window.webContents.send(MESSAGES.PASTE),
      },
      {
        label: 'Delete',
        accelerator: process.platform === 'darwin' ? 'Cmd+Backspace' : 'Delete',
        click: () => window.webContents.send(MESSAGES.DELETE),
      },
      { role: 'selectAll' },
    ],
  },
  {
    role: 'viewMenu',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },

      { type: 'separator' },

      {
        label: 'Grid Settings',
        click: () => window.webContents.send(MESSAGES.SETTINGS, 'grid'),
      },

      { type: 'separator' },

      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },

      { type: 'separator' },

      { role: 'togglefullscreen' },

      { type: 'separator' },

      {
        label: 'Switch Theme',
        click: () => window.webContents.send(MESSAGES.SWITCH_THEME, 'grid'),
      },
    ].filter(Boolean),
  },
])
