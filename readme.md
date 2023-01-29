## Cron job

You can schedule email sending with cron job like this :

```bash
#!/bin/bash (run.sh)
export PATH="/usr/bin:/bin:/home/$(whoami)/.nvm/versions/node/v18.12.1/bin" # define your node path here for cron job
export XDG_RUNTIME_DIR=/run/user/$(id -u) # required to send OS notification from cron job
rm -f "$PWD"/path/to/clone/dir/rugby-worldcup-tester/src/mail-content.txt && touch "$PWD"/path/to/clone/dir/rugby-worldcup-tester/src/mail-content.txt
cd $PWD/path/to/clone/dir/rugby-worldcup-tester && npx playwright test && node $PWD/path/to/clone/dir/rugby-worldcup-tester/src/send-email-report.js

```

> Change /path/to/clone/dir/ by your clone directory


### Enable cron with logs (every 5 mins)
`
5/ * * * * /path/to/executable/run.sh >> /path/to/log/rgb-wrc-cron.log
`


## TODO
* Use templating library to format the email (edge, mustache..)
* Add tickets to card directly
