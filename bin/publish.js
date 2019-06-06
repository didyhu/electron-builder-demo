#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const http = require('http')
const jsYaml = require('js-yaml')

const dir = path.join(__dirname, "../dist")
const configFile = "latest.yml"
const config = jsYaml.load(fs.readFileSync(path.join(dir, configFile).toString()))
const token = "test-token"

const { files } = config

const uploader = uploadTasks()
function next(callback) {
    const { done, value } = uploader.next()
    if (done) {
        return callback()
    }
    value(() => next(callback))
}
next(() => {
    console.info("finished")
})

function* uploadTasks() {
    yield upload(configFile)
    for (const file of files) {
        const { url } = file
        yield upload(url)
    }
}

function upload(file) {
    return callback => {
        const filepath = path.join(dir, file)
        const req = http.request("http://127.0.0.1:1234/pub?filename=" + encodeURIComponent(file), {
            method: "post",
            headers: { token }
        }, (res) => {
            if (res.statusCode != 200) {
                const buffers = []
                res.on("data", chunk => {
                    buffers.push(chunk)
                })
                res.on("end", () => {
                    console.error("Failed to upload:", file, Buffer.concat(buffers).toString())
                    callback()
                })
            } else {
                console.info("Uploaded", file)
                callback()
            }
        })
        req.write(fs.readFileSync(filepath))
        req.end()
    }
}
