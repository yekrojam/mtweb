# MajorKey 2
This repo represents a full web deployment of MajorKey. It servers both web pages and the API to support them. Libraries, frameworks, and technologies used include:

- [Marko](https://markojs.com/docs/) (with [Lasso](https://markojs.com/docs/lasso/) doing the bundling for CSS & JS)
- [Express](http://expressjs.com/en/api.html)
- [Sass](https://sass-lang.com/guide)
- [Spectre.css](https://picturepan2.github.io/spectre/index.html)

The site functions as a MULTI-page application. Reading of data and majoring rendering is typically done through a full, server side rendered page load. Writes are typically done from the client by hitting the API.

## Install

```bash
npm install
```

## Starting the server

In dev, the server starts using [`browser-refresh`](https://www.npmjs.com/package/browser-refresh), which will update the page in the browser as soon as any files are changed.
```bash
npm run dev
```

Start the server in production mode (minification enabled, etc.):

```bash
npm start
```
