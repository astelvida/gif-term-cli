const readline = require('readline');
const chalk = require('chalk');
const clipboardy = require('clipboardy');
const t = require('ansi-escapes');
const getCursorPosition = require('get-cursor-position');

const gifcat = require('../gifcat/index.js');

function init(introMsg, prompt) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    const initPos = getCursorPosition.sync();
    process.stdout.write(chalk`{dim.bold \n${introMsg}\n}`);
    process.stdout.write(chalk`{cyan ${prompt}} `);
    process.stdout.write(t.cursorSavePosition);
    return initPos;
}

function renderGif(imgStr, text) {
    readline.clearScreenDown(process.stdout);
    console.log('\n\n  ' + imgStr);
    process.stdout.write(t.cursorRestorePosition);
    readline.moveCursor(process.stdout, text.length, 0);
}

function updateText(str, key, text) {
    if (key.name === 'backspace') {
        if (text) {
            text = text.slice(0, text.length - 1);
            readline.moveCursor(process.stdout, -1, 0)
            readline.clearLine(process.stdout, 1);
        }
    } else if (str && key.sequence.length) {
        text += key.sequence;
        process.stdout.write(str);
    }
    return text;
}

function handleExit(initPos, message = 'Later! 👋') {
    readline.cursorTo(process.stdout, initPos.col, initPos.row);
    readline.clearScreenDown(process.stdout);
    readline.clearLine(process.stdout, 0)
    console.log(chalk`{cyan ${message}}\n`);
    process.exit();
}

async function run (text='' , flags) {
    if (text) {
        const { imgStr } = await gifcat.data(text, flags);
        console.log('\n  ' + imgStr + '\n');
        return;
    }
    
    text = '';
    let src;
    const initPos = init('type text to translate into gif and press return', '»');

    async function render() {
        const data = await gifcat.data(text, flags);
        if (!data) {
            return false;
         }
         src = data.url;
         renderGif(data.imgStr, text);
         return true;
    }

    process.stdin.on('keypress', async (str, key) => {
        if (key.name === 'return') {
            text && await render();
            return;
        }
        
        if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
            (flags.clip && url ) && clipboardy.sync(url);
            handleExit(initPos);
            return;
        } 

        text = updateText(str, key, text);
    })
}

async function runTv(text = '', flags) {
    let tvStream;
    let intervalId = null;
    let currChannel = '';
    let src;
    text = text || '';
    const initPos = init(`type text to set/change tv channel and press return`, '» channel');

    const tv = gifcat.tv(text, flags);

    function startChannel() {
        intervalId = setInterval(async () => {
            await render();
        }, 5000)
    }
    
    function stopChannel() {
        intervalId && clearInterval(intervalId);
        intervalId = null;
    }

    async function render(isInt) {
        let data = await tv.next();
        if (!data) {
           return false;
        }
        renderGif(data.imgStr, text);
        return true;
    }
    
    async function setChannel(text) {
        stopChannel();
        await tv.init(text);
        await render() ? 
            startChannel() : 
            handleExit(initPos, `oops, input "${text}" is invalid! 🙊`);
    }

    if (text) {
        process.stdout.write(text);
        await setChannel(text);
    }

    process.stdin.on('keypress', async (str, key) => {
        if (key.name === 'return') {
            text && await setChannel(text);
            return;
        }

        if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
            handleExit(initPos);
            return;
        } 

        text = updateText(str, key, text);
    })    
}


module.exports = {
    runTv,
    run,
}

/*
    TODO:
    function positionTv (width, height) {
        const { columns, rows } = process.stdout;
        const bgStart = 2;
        const relWidth =  width / height * termH * 2.6 // NEED TO FIND A BETTER WAY TO GET THIS
        const startPos = Math.floor(columns / 2 - relWidth/ 2);
        process.stdout.write(t.cursorSavePosition);
        for (let r = 0; r < termH; r++) {
            readline.moveCursor(process.stdout, bgStart, 0);
            console.log(chalk.bgBlack(' ').repeat(columns - 2 * bgStart))
        }
        process.stdout.write('\n');
        process.stdout.write(t.cursorRestorePosition);
        readline.moveCursor(process.stdout, startPos,  0);
    }
*/