const request = require('@egg-cli-dev/request')

module.exports = () => {
  return request({
    url: '/project/template',
  })
}
