import debug from 'debug'
import { pick } from 'lodash'

export default function logger(basename) {
  const methods = [
    'log',
    'debug',
    'info',
    'warn',
    'error',
  ]

  const base = debug(basename)
  const loggers = methods.reduce((loggers, method) => {
    const logger = base.extend(method)
    logger.log = console[method].bind(console)
    loggers[method] = logger
    return loggers
  }, {})


  const [log, ...restMethods] = methods
  return Object.assign(loggers[log], pick(loggers, restMethods))
}
