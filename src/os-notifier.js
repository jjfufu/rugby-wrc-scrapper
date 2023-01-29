import notifier from 'node-notifier'
import useLogger from "./logger";
require('dotenv').config()

export default function useNotifier(config= {sound: true, wait: false, reply: false}) {
    const logger = useLogger('NOTIFICATION')
    function notify(message, title = null) {
        if(process.env.NOTIFICATION_ACTIVE) {
            const notifyOptions = {
                ...config,
                title: title || process.env.NOTIFICATION_TITLE,
                message: message
            }
            logger.log(JSON.stringify(notifyOptions))
            notifier.notify(notifyOptions)
        }

        logger.log(message)
    }

    return {
        notify
    }
}
