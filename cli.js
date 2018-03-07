#!/usr/bin/env node
'use strict';
const path = require('path');
const meow = require('meow');

const { run } = require('./index.js');

const cli = meow(
    `
        Usage
        $  gif-term <text>
    
        Options
        --sticker -s    Get a sticker gif
        --clip -c       Copy gif url to clipboard
        --height -h     Set gif height
        --width -w      Set gif width
    
        Examples
        $ gif-term 'monday cat'
        $ gif-term 'facepalm' --clip --width=100%

        Run it without arguments to enter search mode (similar to slack giphy).
    `,
    {
        flags: {
            stickers: {
                type: 'boolean',
                default: false,
                alias: 's',
            },
            clip: {
                type: 'boolean',
                default: false,
                alias: 'c',
            },
            height: {
                type: 'string',
                default: '200px',
                alias: 'h',
            },
            width: {
                type: 'string',
                default: 'auto',
                alias: 'w',
            },
        }
    }
);


run(cli.input[0], cli.flags);