#!/usr/bin/env node
'use strict';
const path = require('path');
const meow = require('meow');

const { run, runTv } = require('./index.js');

const cli = meow(
    `
        Express yourself with gifs on the command line.

        Usage
        $  gifcat [<text>] [options] - translate text to gif (random gif if no text)
    
        Options
        --sticker -s    Get a sticker gif

        --clip -c       Copy gif url to clipboard
        
        --height        Set gif height [pixels|% of term screen height|rowNum|autoscale] [Default: 250px]
        
        --width         Set gif width [pixels|% of term screen width|colNum|autoscale] [Default: auto]
    
        --tv            Go into tv mode - browse channels interactively

        Examples
        $ gifcat 'monday cat' --clip
        $ gifcat 'snl' --tv

        Run it without arguments to enter live search. 
        Use the '--tv' option to stream gifs in your terminal and change channels in the prompt.
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
            tv: {
                type: 'boolean',
                default: false,
            },
        }
    }
);



if (cli.flags.tv) {
    runTv(cli.input[0], cli.flags);
} else {
    run(cli.input[0], cli.flags);
}