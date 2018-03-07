# gif-term-cli

>  Search for a GIF by a word or phrase and display it in the terminal. 
*Inspired by Giphy for Slack.*

![](./demo.gif)

*Currently supported on [iTerm2 >= 3](https://www.iterm2.com/downloads.html).*

## Install

```
$ npm install -g gif-term-cli
```

## Usage

```
    Usage
    $  gif-term <text>

    Options
    --sticker -s    Get a sticker gif
    --clip -c       Copy gif url to clipboard
    --height        Set gif height [Default: 250px]
    --width         Set gif width [Default: auto]

    Examples
    $ gif-term 'monday cat'
    $ gif-term 'facepalm' --clip

    Run it without text input to enter search mode.
```


## Related

- [gif-term](https://github.com/astelvida/gif-term) - API for this module

## License

MIT ©