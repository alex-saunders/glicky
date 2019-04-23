# 🐭 Glicky

### The in-browser task runner for modern web development

![Glicky in the wild](https://github.com/alex-saunders/glicky/raw/master/docs/images/glicky-example.png)

Getting into modern web development as a beginner is _**hard**_. Along with learning HTML, CSS, JavaScript and Node.js (the list goes on), developers these days have to learn a whole host of extra skills to get up and running in a modern stack.

One such skill is operating npm (or yarn) and traversing the terminal as a whole. Controlling the terminal requires developers to execute unclear commands and save them to memory (not to mention if you initially learn how to use npm, you're then often encouraged to forget all this and learn how to use yarn!). This mental overhead is often daunting for new developers and can lead to unnecessary confusion and burnout.

Should learning these skills be necessary to start in modern development or could this be avoided?

Glicky aims to solve this problem by providing a GUI for common CLI commands that are necessary when working on a modern project. Glicky offers functionality for:

- Running scripts defined in package.json
  - Along with a visual representation of each script's state, allowing developers to see if a script is erroring & restart it if necessary.
- Adding dependencies
- Removing dependencies
- Updating dependencies

Glicky hopes that by removing the need to learn the commands necessary to execute these tasks, beginners will feel more empowered get going with the work they actually want to compete, rather than wrestling with the command line.

> ⚠️ **NOTE**: This is an **early pre-release**. There will undoubtedly be bugs but it mostly works and important features are _upcoming_. **Windows is not fully supported** and there might be unforseen bugs.

## Why would I use this?

There are already a number of applications that aim to provide users with a GUI for common CLI and/or project management tasks. However, these are usually native applications (most built with electron) that require manual download and installation (or using Homebrew if on macOS). This makes getting started with the application (and updating it) cumbersome, which can put users off as they're aiming to reduce the complexity needed to get started!

Glicky is hosted on NPM and runs in your browser, allowing for easy installation and fast startup times. Users need only execute 1 command to get started with Glicky in seconds, also ensuring that they are running the most up-to-date version that they can be.

## Quick Start Guide

Glicky works best with [npx](https://www.npmjs.com/package/npx), if you have it installed, you can run:

```
npx glicky [options]
```

From your project root and Glicky should automatically open in your default browser!

Alternatively, you could install Glicky globally via:

`npm i -g glicky` and then running `glicky [options]`.

However, this is not recommended as it could lead to problems with running out of date versions and conflicting with local installations further down the line (see more info [here](https://codeburst.io/maybe-dont-globally-install-that-node-js-package-f1ea20f94a00)).

Glicky accepts a number of options:
- `--open` (default `true`) - if passed `false`, Glicky will not automatically open in your default browser.
- `--port` (default `5000`) - Glicky will attempt to open on the specified port, if this port is not available it will attempt to use a number of close ports, falling back to a random, free port.

> ⚠️ **NOTE**: At the moment, Glicky only works in projects that have been initialised with a package.json, please run `npm init` in your project root if you do not have one.

## How does it work?

Glicky is based on Web Sockets (via [socket.io](https://socket.io/)). When Glicky is opened, a local server is spun up and opens a socket. The client then connects to this socket and requests the server to execute any commands necessary when interacting with the GUI. The response is sent back from the server via the same socket, keeping the server and client in sync with each other and allowing the client to 'execute' CLI commands on behalf of the user. This is undoubtedly quite hacky but it allows us to quickly open an app which is capable of performing OS level tasks, completely in the browser, without needing a native application!


### The Future

The current version of Glicky features a small number of core features. It allows for executing tasks defined in the `scripts` section of your project's `package.json`, as well as dependency management.

In the future, Glicky has plans to extend it's functionality by providing a means of getting started in a fresh project (i.e. one without a package.json), for example, by running `npm init` and guiding the user through the options via the GUI.

This is just one idea to increase the features that Glicky provides. Nonetheless, the project has aims to include a whole host of features, all with the aim of making modern web development easier to learn and accessible to everyone.

## Attribution

As mentioned, a number of a similar projects existed before Glicky that attempted to bridge the gap between CLI tools and GUIs. These projects and ideas influenced the development of this project heavily and Glicky owes them a lot. These include:

  - [Guppy](https://github.com/joshwcomeau/guppy) by [joshwcomeau](https://github.com/joshwcomeau) - A friendly application manager and task runner for React.js
  - [JSUI](https://github.com/kitze/JSUI) by [Kitze](https://github.com/kitze) - A powerful UI toolkit for managing JavaScript apps
  - [Sunil Pai](https://github.com/threepointone)'s talk at React Europe 2018 - ['Stop writing code'](https://www.youtube.com/watch?v=WYWVGQKnz5M), along with this [tweet](https://twitter.com/threepointone/status/948559739826376704), was a big source of inspiration and stimulated the initial work on Glicky.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://asaunders.com"><img src="https://avatars2.githubusercontent.com/u/22820481?v=4" width="100px;" alt="Alex Saunders"/><br /><sub><b>Alex Saunders</b></sub></a><br /><a href="https://github.com/alex-saunders/glicky/commits?author=alex-saunders" title="Code">💻</a> <a href="#design-alex-saunders" title="Design">🎨</a> <a href="#infra-alex-saunders" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-alex-saunders" title="Ideas, Planning, & Feedback">🤔</a> <a href="#review-alex-saunders" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/threepointone"><img src="https://avatars2.githubusercontent.com/u/18808?v=4" width="100px;" alt="Sunil Pai"/><br /><sub><b>Sunil Pai</b></sub></a><br /><a href="#ideas-threepointone" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://github.com/Tolsee"><img src="https://avatars0.githubusercontent.com/u/16590492?v=4" width="100px;" alt="Tulsi Sapkota"/><br /><sub><b>Tulsi Sapkota</b></sub></a><br /><a href="https://github.com/alex-saunders/glicky/commits?author=Tolsee" title="Code">💻</a></td><td align="center"><a href="https://github.com/neutrino2211"><img src="https://avatars1.githubusercontent.com/u/21989345?v=4" width="100px;" alt="Tsowa Mainasara Al-amin"/><br /><sub><b>Tsowa Mainasara Al-amin</b></sub></a><br /><a href="https://github.com/alex-saunders/glicky/commits?author=neutrino2211" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

---

(The mouse emoji is because Glicky provides a Graphical User Interface that you control with a **mouse**. That makes sense... right?)
