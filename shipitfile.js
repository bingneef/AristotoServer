module.exports = (shipit) => {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('./node_modules/shipit-deploy')(shipit)
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('./node_modules/shipit-pm2')(shipit)
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('./node_modules/shipit-npm')(shipit)
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('./node_modules/shipit-shared')(shipit)

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
  shipit.on('finished', () => shipit.start('clean-up'))
}
