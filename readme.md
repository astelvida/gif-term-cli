# gif-term-cli

>  Translates words and phrases to a GIF and displays it in the terminal. Inspired by Slack's giphy integration.

![](./demo.gif)

*Currently supported on [iTerm2 >= 3](https://www.iterm2.com/downloads.html).*

## Install

```
$ npm install -g gif-term-cli
```

## Usage

```
    gif-term --help

    Usage

    $  gif-term [<text>] [options]

    Options
    --sticker -s    Get a sticker gif
    --clip -c       Copy gif url to clipboard
    --height        Set gif height [Default: 250px]
    --width         Set gif width [Default: auto]

    Examples
    $ gif-term 'monday cat'
    $ gif-term 'facepalm' --clip

    Run it without arguments to enter live search.
    Press the return key to get another gif (similar to slack giphy).
```


## Related

- [gif-term](https://github.com/sindresorhus/wallpaper) - API for this module


## License

MIT ©