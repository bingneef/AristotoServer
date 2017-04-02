module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-pm2')(shipit);
  require('shipit-npm')(shipit);
  require('shipit-shared')(shipit);

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
        ],
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
  });

  shipit.blTask('db:migrate', function() {
    return shipit.remote('cd ' + shipit.config.deployTo + '/current && npm run db:migrate');
  });

  shipit.on('published', function() {
    return shipit.start('db:migrate');
  });

  shipit.blTask('clean-up', function() {
    return shipit.local('rm -r tmp');
  });

  shipit.on('finished', function() {
    return shipit.start('clean-up');
  });
};


