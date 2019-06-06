const log4js = require('log4js')
const logger=log4js.getLogger("foo")
log4js.configure({
    appenders: { console: { type: "console" } },
    categories: { default: { appenders: ["console"], level: "all" } }
})

console.log("foo")
console.log("bar")
console.log("coo")
console.log("noo")
logger.info("info")
logger.warn("warn")
logger.error("error")
// throw "shit"