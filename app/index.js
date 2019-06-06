"use strict"
const { app, BrowserWindow } = require("electron")
const path = require("path")
const childProcess = require("child_process")
const log4js = require("log4js")

log4js.configure({
    appenders: { console: { type: "console" } },
    categories: { default: { appenders: ["console"], level: "all" } }
})

const logger = log4js.getLogger("main")

app.on("ready", () => {
    const win = new BrowserWindow({
        width: 1024, height: 768,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    })
    win.loadFile(path.join(__dirname, "./content/index.html"))
    win.on("closed", () => {
        app.quit()
    })
})

// root dir
let root
if (app.isPackaged) {
    root = path.join(__dirname, "../../app.asar.unpacked")
} else {
    root = path.join(__dirname, "../")
}
logger.info("root", root)

// auto update
if (app.isPackaged) {
    const { autoUpdater } = require("electron-updater")
    autoUpdater.logger = log4js.getLogger("electron-updater")
    autoUpdater.on("update-downloaded", (info) => {
        autoUpdater.quitAndInstall()
    })
    autoUpdater.on("error", error => {
        logger.error("autoUpdater Error", error.message, error)
    })
    autoUpdater.checkForUpdates()
}

// spawn node process
const child = childProcess.spawn(path.join(root, "node_modules/node/bin/node"),
    [path.join(root, "node/foo.js")], { stdio: [null, "pipe", "pipe", "ipc"] })
child.stdout.on("data", chunk => {
    process.stdout.write(chunk)
})
child.stderr.on("data", chunk => {
    process.stderr.write(chunk)
})