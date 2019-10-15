const gifTerm = require('gif-term');
const readline = require('readline');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const t = require('ansi-escapes');
const getCursorPosition = require('./cursor-position.js');

const ora = require('ora');


async function search(text, flags) {
    let output;
    let url;
    let error;
    let currentPosition;
    let isFetching = false;
    let hasStarted = false;
    text = text || '';
    let spinner = ora(text)
    let copiedMsg = chalk`{hex('#1DE9B6') ✔} {hex('#B388FF') gif copied to clipboard}`


    function handleExit(clip = false) {
        let message = ''
        if (error) {
            message = error
        } else if (clip) {
            clipboardy.writeSync(url);
            message = copiedMsg
        } 
        currentPosition = currentPosition || getCursorPosition.sync()
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, currentPosition.row)

        process.stdout.write(message + '\n');
        process.exit(0);
    }
    async function fetchAndSetGif() {
        const data = await gifTerm.data(text, flags) || {};
        output = data.imgStr
        url = data.url || '';
        error = data.errorMsg || '';
    }

    process.stdout.write(t.cursorHide);

    if (text) {
        spinner.start()
        await fetchAndSetGif();
        spinner.clear();
        process.stdout.write(output + '\n');
        currentPosition = getCursorPosition.sync();
        return handleExit(flags.clip);
    }

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const introMsg = 'start typing and hit return to get matching GIF';
    const prompt = chalk`{hex('#1DE9B6') ❯}`;
    process.stdout.write(prompt + ' ');
    process.stdout.write(chalk`{bold.dim ${introMsg}}`);

    

    process.stdin.on('keypress', async (str, key) => {

        if (isFetching || !str) {
            return;
        } 

        if (key.name === 'return') {
            
            isFetching = true
            spinner.start();
            
            await fetchAndSetGif();

            spinner.stopAndPersist({ symbol: prompt, text });
            process.stdout.write(t.cursorHide);

            readline.clearScreenDown(process.stdout);
            process.stdout.write(output + '\n');
            
            currentPosition = getCursorPosition.sync();
            readline.cursorTo(process.stdout, 0, currentPosition.row)
            process.stdout.write(prompt + ' ' + text);
            process.stdout.write(t.cursorShow);
            
            isFetching = false
            return;

        } else if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
            currentPosition = currentPosition || getCursorPosition.sync()
            readline.cursorTo(process.stdout, 0, currentPosition.row);
            process.stdout.write(chalk`{hex('#1DE9B6').bold ? } {bold.dim Save to clipboard? {white (y/N)}}`);

            process.stdin.on('keypress', (char, key) => {
                let clip = (char && char.match(/(y|yes|yeah|yep)/gi));
                return handleExit(clip);
            });

        } else if (key.name === 'backspace') {
            if (!text) return
            text = text.slice(0, text.length - 1);
            readline.moveCursor(process.stdout, -1, 0)
            readline.clearLine(process.stdout, 1);

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

    process.stdin.on('error',
        (err) => {
            error = err.message
            handleExit(false)
        })
}

module.exports = { search };