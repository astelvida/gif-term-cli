const gifTerm = require('gif-term');
const readline = require('readline');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const t = require('ansi-escapes');
const getCursorPosition = require('get-cursor-position');
const ora = require('ora');

async function run (text, flags) {
    let pos;
    let output;
    let url;
    let error;
    let isRendered;
    let hasStarted = false;
    let spinner;

    text = text || '';

    function handleExit(clip = false, message = '') {
        if (clip && !error && url && isRendered) {
            clipboardy.writeSync(url);
            message = chalk`{hex('#1DE9B6') ✔} {hex('#B388FF') gif copied to clipboard}\n`;
        }

        let row = (!pos || !pos.row) ? getCursorPosition.sync().row : pos.row;
        readline.cursorTo(process.stdout, 0, row - 1);
        readline.clearLine(process.stdout, 0);
        process.stdout.write(message + '\r\n');
        process.exit(0);
    }

    async function setGifData() {
        spinner = ora(text).start();
        const data = await gifTerm.data(text, flags) || {};
        output = data.imgStr || data.errorMsg;
        url = data.url || '';
        error = !!data.errorMsg;
    }

    if (text) {
        await setGifData();
        spinner.clear();
        console.log(output);
        pos = getCursorPosition.sync();
        isRendered = !error;
        return handleExit(flags.clip);
    }
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const introMsg = 'start typing and hit return to get matching GIF';
    const prompt = chalk`{hex('#1DE9B6') ❯}`;
    process.stdout.write('\n');
    process.stdout.write(t.cursorSavePosition);
    process.stdout.write(prompt + ' ');

    process.stdout.write(chalk`{bold.dim ${introMsg}}`);

    process.stdin.on('keypress', async (str, key) => {
        if (key.name === 'return') {
            if (text) {
                process.stdout.write('\r');
                await setGifData();

                readline.clearScreenDown(process.stdout);
                console.log('\n' + output);
                pos = getCursorPosition.sync();
                isRendered = true;
                
                process.stdout.write(t.cursorRestorePosition);
                spinner.stopAndPersist({ symbol: prompt });
                readline.moveCursor(process.stdout, text.length + 2, -1);
            }
            return;
         
        } else if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
            if (error || !isRendered) return handleExit(false);

            if (flags.clip) return handleExit(true);       
            
            let row = (!pos || !pos.row) ? getCursorPosition.sync().row : pos.row;
            readline.cursorTo(process.stdout, 0, row - 1);
            readline.clearLine(process.stdout, 0);

            process.stdout.write(chalk`{hex('#1DE9B6').bold ? } {bold.dim Save to clipboard? {white (y/N)}} `);
            process.stdin.on('keypress', (char, key) => {
                let clip = (char && char.match(/(y|yes|yeah|yep)/gi)) || false; 
                return handleExit(clip);
            });

            
        } else if (key.name === 'backspace') {
            if (text) {
                text = text.slice(0, text.length - 1);
                readline.moveCursor(process.stdout, -1, 0)
                readline.clearLine(process.stdout, 1);
            }

        } else if (str && key.ctrl === false) {
            if (!hasStarted) {
                readline.moveCursor(process.stdout, - introMsg.length, 0);
                readline.clearLine(process.stdout, 1);
                hasStarted = true;
            }
            text += key.sequence;
            process.stdout.write(str);
        }
    })

}

module.exports = { run };