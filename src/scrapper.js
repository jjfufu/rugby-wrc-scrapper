const { chromium } = require('playwright');
const nodemailer =  require('nodemailer');
const notifier = require('node-notifier');
const dotenv = require('dotenv');

dotenv.config()

const useLogger = require('./logger.js')
const logger = useLogger('SCRAPPER')

const urls = {
    fr: [
        {
            name: 'France-Italie',
            url: 'https://tickets.rugbyworldcup.com/fr/revente_france_italie'
        },
        {
            name: 'France-Namibie',
            url: 'https://tickets.rugbyworldcup.com/fr/revente_france_namibie'
        },
        {
            name: 'France-Nouvelle-Zélande',
            url: 'https://tickets.rugbyworldcup.com/fr/revente_france_nouvelle_zelande'
        },
        {
            name: 'France-Uruguay',
            url: 'https://tickets.rugbyworldcup.com/fr/revente_france_uruguay'
        },
    ]
};

async function testHasTickets({name, url}) {
    const browser = await chromium.launch()
    const page = await browser.newPage({
        extraHTTPHeaders: {'Cache-Control': 'no-cache'},
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    })

    const response = await page.goto(url)

    if(response.status() !== 200) {
        logger.log(`Page ${url} injoignable. Status ${response.status()}`)
        return false
    }

    const result = !!(await Promise.all([
        page.getByText('FILE D\'ATTENTE').count(),
        page.locator('.global_waiting_page').count(),
        page.locator('.maintenance-page').count(),
        page.locator('.product-not-on-sale-info').count()
    ])).every(result => result === 0);

    await browser.close()

    return result
}

async function send(matchs, callback) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: process.env.MAIL_TLS === 'true',
        auth: {
            user: process.env.SMTP_FROM,
            pass: process.env.SMTP_PASS
        }
    })

    const text = matchs.map(({url, name}) => {
        return `${name} : ${url} `
    }).join('\n')

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_TO,
        bcc: process.env.SMTP_BCC,
        subject: process.env.MAIL_SUBJECT,
        text
    }

    await transporter.sendMail(mailOptions, callback)
}

function notify(message = {content: '', title: ''}, config =  {sound: true, wait: false, reply: false}) {
    const notifyOptions = {
        ...config,
        ...message
    }
    notifier.notify(notifyOptions)
}

module.exports = (async () => {
    const keys = Object.keys(urls)
    const matchsHasTickets = []

    for(let key of keys) {
        for(let match of urls[key]) {
            if(await testHasTickets(match)) {
                matchsHasTickets.push(match)

                if(process.env.NOTIFICATION_ACTIVE === 'true') {
                    notify({
                        content: `Tickets disponibles pour le match ${match.name}`,
                        title: process.env.NOTIFICATION_TITLE
                    })
                }
            }
        }
    }

    if(matchsHasTickets.length > 0) {
        await send(matchsHasTickets, (error, info) => {
            if (error) {
                logger.log(error)
            } else {
                logger.log('Email envoyé : ' + info.response);
            }

            process.exit()
        })
    } else {
        logger.log('Pas de mail envoyé')
        process.exit()
    }
})
