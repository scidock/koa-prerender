# koa-prerender [![Build Status](https://travis-ci.org/scidock/koa-prerender.svg)](https://travis-ci.org/scidock/koa-prerender)

**KOA middleware for prerendering javascript-rendered pages on the fly for SEO**

This [koa](https://koajs.com) middleware intercepts requests to your Node.js website
from crawlers, and then makes a call to the (external) [Prerender](https://prerender.io/)
service to get the static HTML instead of the javascript for that page.

## Setup

### Prerequisites

Install [prerender](https://github.com/prerender/prerender) on a server of your choice.

### Usage

```js
var prerender = require('koa-prerender');

// Options
var options = {
  prerender: PRERENDER_SERVER_URL,   // optional, default:'http://service.prerender.io/'
  protocol: 'http',                  // optional, default: ctx.protocol
  host: 'scidock.com',               // optional, default: ctx.host,
  prerenderToken: ''                 // optional or process.env.PRERENDER_TOKEN
};

// Use as middleware
app.use(prerender(options));
```

## License

ISC
