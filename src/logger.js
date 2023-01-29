const useLogger = (prefix = '') => {
    function log(log) {
        console.log(buildLogMessage(log))
    }

    function buildLogMessage(log) {
        const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        return `${date} | ${prefix} | ${log}`
    }

    return {
        log,
        buildLogMessage
    }
}

module.exports = useLogger
