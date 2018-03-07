# gif-term-cli [![Build Status](https://travis-ci.org/astelvida/gif-term-cli.svg?branch=master)](https://travis-ci.org/astelvida/gif-term-cli)

>  Search GIFs by a word or phrase and display a match in the terminal. Like *Giphy for Slack*, but for the terminal.

![](./omg-awesome.gif)

*Currently supported on [iTerm2 >= 3](https://www.iterm2.com/downloads.html).*

## Install

```
$ npm install --global gif-term-cli
```

## Usage

```
gif-term --help

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
```

## Related

- [gif-term](https://github.com/astelvida/gif-term) - API for this module, check out for more details

## License

MIT