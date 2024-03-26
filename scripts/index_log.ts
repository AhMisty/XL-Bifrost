import ora from 'ora'
import chalk from 'chalk'

const spinnerOption = {
    spinner: {
        interval: 80,
        frames: [
            chalk.rgb(255,0,0)("⠋"),
			chalk.rgb(255,128,0)("⠙"),
			chalk.rgb(255,255,0)("⠹"),
			chalk.rgb(128,255,0)("⠸"),
			chalk.rgb(0,255,0)("⠼"),
			chalk.rgb(0,255,255)("⠴"),
			chalk.rgb(0,0,255)("⠦"),
			chalk.rgb(128,0,255)("⠧"),
			chalk.rgb(255,0,255)("⠇"),
			chalk.rgb(255,0,128)("⠏"),
        ],
    }
}
const spinner = ora(spinnerOption);
export default spinner