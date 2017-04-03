module.exports = (shipit) => {
  require('shipit-deploy')(shipit) // eslint-disable-line import/no-extraneous-dependencies, global-require
  require('shipit-pm2')(shipit) // eslint-disable-line import/no-extraneous-dependencies, global-require
  require('shipit-npm')(shipit) // eslint-disable-line import/no-extraneous-dependencies, global-require
  require('shipit-shared')(shipit) // eslint-disable-line import/no-extraneous-dependencies, global-require

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

  shipit.blTask('db:migrate', () => shipit.remote(`cd ${shipit.config.deployTo}/current && npm run db:migrate`))
  shipit.on('published', () => shipit.start('db:migrate'))

  shipit.blTask('clean-up', () => shipit.local('rm -r tmp'))
  shipit.on('finished', () => shipit.start('clean-up'))
}
