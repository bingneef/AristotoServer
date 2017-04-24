/* eslint-disable import/no-extraneous-dependencies */
const Slack = require('node-slackr')
const moment = require('moment')
const s = require('underscore.string')

const slack = new Slack('https://hooks.slack.com/services/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',
  {
    channel: '#aristoto'
  }
)

const allowedEnvs = ['production', 'staging']
const env = s(process.argv[2]).capitalize().value()
const message = {
  attachments: [
    {
      fallback: 'Deploy complete',
      color: allowedEnvs.indexOf(process.argv[2]) > -1 ? 'good' : 'warning',
      fields: [
        {
          title: 'Deploy complete',
          value: moment().format('MMMM Do YYYY, H:mm:ss'),
          short: true
        },
        {
          title: 'Environment',
          value: env || 'Env undefined',
          short: true
        }
      ]
    }
  ]
}
slack.notify(message)

