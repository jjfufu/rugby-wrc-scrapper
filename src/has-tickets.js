import useNotifier from "./os-notifier";
import useMailer from "./send-email-report";

// @ts-check
/** @implements {import('@playwright/test/reporter').Reporter} */
class HasTickets {
    async onTestEnd(test, result) {
        if(result.status === 'passed') {
            useNotifier().notify( `Des tickets sont disponibles pour le match ${test.title}`)
            await useMailer().appendMatch(test.title)
        }
    }
}

module.exports = HasTickets;
