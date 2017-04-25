/* eslint-disable import/no-extraneous-dependencies, global-require */
const env = require('./config/env')

const webhookUrl = process.env.SLACK_WEBHOOK || env.slack.webhook
const channel = process.env.SLACK_CHANNEL || env.slack.channel

module.exports = (shipit) => {
  require('./node_modules/shipit-deploy')(shipit)
  require('./node_modules/shipit-pm2')(shipit)
  require('./node_modules/shipit-npm')(shipit)
  require('./node_modules/shipit-shared')(shipit)
  require('./node_modules/shipit-slack')(shipit)

  shipit.initConfig({
    default: {
      workspace: 'tmp',
      repositoryUrl: 'git@github.com:bingneef/AristotoServer.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 10,
      shallowClone: true,
      dirToCopy: '',
      npm: {
        remote: true,
        installFlags: ['--only=production']
      },
      shared: {
        overwrite: false,
        files: [
          'config/config.json',
          'config/env.json',
          'app.json'
        ]
      },
      slack: {
        webhookUrl,
        channel,
        message: 'Deploy complete',
        status: 'good'
      }
    },
    staging: {
      branch: 'develop',
      deployTo: '/var/www/aristoto-api-staging',
      servers: 'bing@5.157.85.46'
    },
    production: {
      branch: 'master',
      deployTo: '/var/www/aristoto-api',
      servers: 'bing@5.157.85.46'
    }
  })

  shipit.blTask('db:migrate', () => {
    const command = `cd ${shipit.config.deployTo}/current && npm run db:migrate`
    return shipit.remote(command)
  })
  shipit.on('published', () => shipit.start('db:migrate'))

  shipit.blTask('clean-up', () => {
    const command = 'rm -r tmp'
    shipit.local(command)
  })
  shipit.on('deployed', () => {
    shipit.start('clean-up')
  })
}
