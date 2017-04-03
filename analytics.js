const Analytics = require('analytics-node')
const env       = require('./config/env')

class AnalyticsHelper {
  static trigger (userId, event, properties) {
    if (process.env.NODE_ENV === 'production') {
      const analytics = new Analytics(env.segment)

      analytics.track({
        userId,
        event,
        properties
      });
    } else {
      // eslint-disable-next-line no-console
      console.log(userId, event, properties)
    }
  }
}

module.exports = AnalyticsHelper
