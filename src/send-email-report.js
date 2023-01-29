const useLogger = require('./logger.js')

const nodemailer =  require('nodemailer')
const fs = require('fs/promises')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const useMailer = (config = {contentFilename: 'mail-content.txt'}) => {
    const filepath = path.join(__dirname, config.contentFilename)
    const logger = useLogger('EMAIL')
    function getTransporter() {
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: process.env.MAIL_TLS === 'true',
            auth: {
                user: process.env.SMTP_FROM,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async function getMailOptions() {
        return {
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_TO,
            subject: process.env.MAIL_SUBJECT,
            text: await getContent(filepath)
        }
    }

    async function getContent(path) {
        return (await fs.readFile(path, 'utf8'))
    }

    async function fileSize (path) {
        return (await fs.stat(path)).size
    }

    async function send() {
        const length = await fileSize(filepath)
        const mailOptions = await getMailOptions()
        console.log(mailOptions)
        if(length > 0) {
            const transporter = getTransporter()
            const mailOptions = await getMailOptions()
            console.log(mailOptions)
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.log(error)
                } else {
                    logger.log('Email sent: ' + info.response);
                }
            })
        } else {
            logger.log('Pas de mail envoyé')
        }
    }

    async function appendMatch(match) {
        await fs.appendFile(filepath, match + '\n', 'utf8')
    }

    return {
        appendMatch,
        getContent,
        fileSize,
        filepath,
        send
    }
}

(async () => await useMailer().send())()

module.exports = useMailer
