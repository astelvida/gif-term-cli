#!/usr/bin/env node
'use strict';
const path = require('path');
const meow = require('meow');

const { search } = require('./search.js');

const cli = meow(
    `
        Usage
        $ gif-term <text>
    
        Options
        --sticker -s    Get a sticker gif 
        --clip -c       Copy gif url to clipboard
        --height -h     Set gif height [Npx|N%|N|'auto']
        --width -w      Set gif width [Npx|N%|N|'auto']
    
        Examples
        $ gif-term 'this is awesome'
        $ gif-term 'facepalm' --clip --width=100%

        Run it without arguments to enter search mode.
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


search(cli.input[0], cli.flags);