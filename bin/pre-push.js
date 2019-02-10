/*
 * bin/pre-push.js
 * Invoked via [Husky](https://github.com/typicode/husky)
 * Only run if pushing master or forced via environment variable
 *
 * e.g.
 *
 * ```bash
 * HUSKY_FORCE_PREPUSH=1 git push
 * ```
*/
import child_process from 'child_process'
import path from 'path'

import { get, pick, find } from 'lodash'
import spawnNpm from 'spawn-npm'

import logger from '../src/logger'

const log = logger(path.basename(__filename))

const deployRefRegex=/^refs\/tags\/(v.+)$/

const env = pick(process.env, [
  'HUSKY_FORCE_PREPUSH',
  'HUSKY_GIT_STDIN',
])

const HUSKY_GIT_STDIN = get(env, 'HUSKY_GIT_STDIN', '')

log('HUSKY_GIT_STDIN:\n%s', HUSKY_GIT_STDIN)

const [
  _localRefs,
  _localSHAs,
  remoteRefs = [],
  _remoteSHAs,
] = HUSKY_GIT_STDIN.split('\n').map(line => line.trim().split(' '))


const forceRun = env.HUSKY_FORCE_PREPUSH == '1'
const deployRefMatch = find(remoteRefs, ref => ref.match(deployRefRegex))

const shouldRun = deployRefMatch || forceRun
if (deployRefMatch) {
  const tag = deployRefMatch[1]
  log('building; triggered by push to %s', tag)
} else if (forceRun) {
  log('building; forced run')

  if (remoteRef) {
    log('triggered by push to %s', remoteRef)
  }
} else if (!shouldRun) {
  log.info('not running script; exiting')
  log.info('set HUSKY_FORCE_PREPUSH=1 to force run')
  process.exit()
}


const run = spawnNpm('run', {_: 'build'})
run.stdout.pipe(process.stdout);
run.stderr.pipe(process.stderr);
run.on('close', ()=> log.info('Done'))
run.on('error', (error) => log.error(error))
