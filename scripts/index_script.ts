import util from 'util'
import { exec } from 'child_process'

export default util.promisify(exec);