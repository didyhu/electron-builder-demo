const express = require('express')
const sanitizeFilename = require('sanitize-filename')
const fs = require('fs')
const path = require('path')

const distPath = path.join(__dirname, "./public")
const app = express()
// for debug
app.use("/pub", (req, res, next) => {
    // console.debug("headers", req.rawHeaders)
    next()
})
// upload
app.post("/pub", (req, res) => {
    const { token } = req.headers
    if (token != "test-token") {
        res.writeHead("403")
        res.write("Bad Token")
        res.end()
        console.debug("Bad Token", token)
        return
    }
    const { filename } = req.query
    console.debug("incoming upload", filename)
    let safeFilename = sanitizeFilename(filename)
    console.debug("safeFilename", safeFilename)
    console.debug("target", path.join(distPath, safeFilename))
    const ws = fs.createWriteStream(path.join(distPath, safeFilename))
    req.pipe(ws)
    req.on("error", error => {
        res.writeHead(500)
        res.write(error.message)
        console.error(error.message, error)
        res.end()
    })
    req.on("end", () => {
        res.end()
    })
})
// download
app.use("/pub", express.static(distPath))

app.listen(1234)
console.info("start")