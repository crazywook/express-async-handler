const http = require('http')

const httpMethodNames = http.METHODS.map(name => name.toLowerCase())
const methodNames = ['route', 'use', 'all', 'del'].concat(httpMethodNames)

const mnames = [
  'route',
  // 'use',
  // 'all',
  // 'del',
  // 'acl',
  // 'bind',
  // 'checkout',
  // 'connect',
  // 'copy',
  // 'delete',
  'get',
  // 'head',
  // 'link',
  // 'lock',
  // 'm-search',
  // 'merge',
  // 'mkactivity',
  // 'mkcalendar',
  // 'mkcol',
  // 'move',
  // 'notify',
  // 'options',
  // 'patch',
  'post',
  // 'propfind',
  // 'proppatch',
  // 'purge',
  // 'put',
  // 'rebind',
  // 'report',
  // 'search',
  // 'source',
  // 'subscribe',
  // 'trace',
  // 'unbind',
  // 'unlink',
  // 'unlock',
  // 'unsubscribe'
]

const wrapRouter = requestHandler => {

  if (requestHandler.length === 4) {
      return (err, req, res, next) => {
          const result = requestHandler(err, req, res, next)
          if (result instanceof Promise) {
            result.catch(next)
          }
      }
  }
  return (req, res, next) => {

      const result = requestHandler(req, res, next)
      if (result instanceof Promise) {
        result.then(r =>
          res.json({data: r})
        )
        .catch(e => {
          res.json({
            resultType: 'failure',
            reason: e.message
          })
        })
      }
  }
}

function applyWrapRouter(method, app) {
  
  return (...fn) => {
    const newArgs = fn.map(requestHandler =>
      typeof requestHandler === 'function'
        ? wrapRouter(requestHandler)
        : requestHandler
    )
    console.log('newArgs', newArgs)
    return method.apply(app, newArgs)
  }
}

function asyncApp(app) {

  mnames.forEach(name => {

    const method = app[name]
    if (typeof method !== 'function') return

    console.log(name, 'methods', app[name], typeof app[name])
    app[name] = name === 'route'
      ? (...args) => asyncApp(method.call(app, ...args))
      : applyWrapRouter(method, app)
  })

  return app
}

module.exports = asyncApp;