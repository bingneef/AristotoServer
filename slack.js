/* eslint-disable import/no-extraneous-dependencies */
const Slack = require('node-slackr')
const moment = require('moment')
const s = require('underscore.string')
const env = require('./config/env')

let webhookUrl = env.slack.webhook
let channel = env.slack.channel

/* eslint-disable no-undef */
if (typeof SLACK_WEBHOOK !== 'undefined' && SLACK_WEBHOOK) {
  webhookUrl = SLACK_WEBHOOK
}
if (typeof SLACK_CHANNEL !== 'undefined' && SLACK_CHANNEL) {
  channel = SLACK_CHANNEL
}
/* eslint-enable no-undef */

const slack = new Slack(webhookUrl,
  {
    channel
  }
)

const allowedEnvs = ['Production', 'Staging']
const buildEnv = s(process.argv[2]).capitalize().value()
const message = {
  attachments: [
    {
      fallback: 'Deploy complete',
      color: allowedEnvs.indexOf(buildEnv) > -1 ? 'good' : 'warning',
      fields: [
        {
          title: 'Deploy complete',
          value: moment().format('MMMM Do YYYY, H:mm:ss'),
          short: true
        },
        {
          title: 'Environment',
          value: buildEnv || 'Env undefined',
          short: true
        }
      ]
    }
  ]
}
slack.notify(message)

