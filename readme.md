## Run
```bash
node index.js
```

## Cron job

You can schedule email sending with cron job like this :

```bash
#!/bin/bash
export PATH="/usr/bin:/bin:/home/$(whoami)/.nvm/versions/node/XX.XX.XX/bin" # define your node path here for cron job
export XDG_RUNTIME_DIR=/run/user/$(id -u)
cd $PWD/path/to/rugby-worldcup-tester && node index.js

```

> Change "/path/to" by your path to clone directory


### Enable cron with logs (every 5 mins)
`
5/ * * * * /path/to/executable/run.sh >> /path/to/log/rgb-wrc-cron.log
`


## TODO
* Use templating library to format the email (edge, mustache..)
* Add tickets to card directly
