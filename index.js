/**
 * @author Peter Marton, Gergely Nemeth, SciDock LLC
 */

const fetch = require('isomorphic-fetch');

const crawlerUserAgents = [
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkShare',
  'W3C_Validator',
  'redditbot',
  'Applebot',
  'WhatsApp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'SkypeUriPreview',
  'nuzzel',
  'Discordbot',
  'Google Page Speed',
  'Qwantify',
  'pinterestbot',
  'Bitrix link preview',
  'XING-contenttabreceiver',
].map(str => str.toLowerCase());

const extensionsToIgnore = [
  '.js',
  '.css',
  '.xml',
  '.less',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.pdf',
  '.doc',
  '.txt',
  '.ico',
  '.rss',
  '.zip',
  '.mp3',
  '.rar',
  '.exe',
  '.wmv',
  '.doc',
  '.avi',
  '.ppt',
  '.mpg',
  '.mpeg',
  '.tif',
  '.wav',
  '.mov',
  '.psd',
  '.ai',
  '.xls',
  '.mp4',
  '.m4a',
  '.swf',
  '.dat',
  '.dmg',
  '.iso',
  '.flv',
  '.m4v',
  '.torrent',
  '.woff',
  '.ttf',
  '.svg',
];

/*
 * @param {Object} options
 * @return {boolean}
 */
function shouldPreRender(options) {
  if (
    options.method !== 'GET' && options.method !== 'HEAD' ||
    !options.userAgent ||
    extensionsToIgnore.some(extension => options.url.indexOf(extension) !== -1)
  ) {
    return false;
  }

  const {query} = url.parse(options.url, true /* parseQueryString */);
  if (
    query && query['_escaped_fragment_'] != null ||
    options.bufferAgent
  ) {
    return true;
  }

  const userAgent = options.userAgent.toLowerCase();
  return crawlerUserAgents.some(crawlerUserAgent => userAgent.indexOf(crawlerUserAgent) !== -1);
}


/*
 * @param {Object} options
 */
function preRenderMiddleware(options) {
  options = options || {};
  options.prerender = options.prerender || 'http://service.prerender.io/';

  /*
   * @param {Object} ctx
   * @param {Function} next
   */
  return (ctx, next) => {
    const protocol = options.protocol || ctx.protocol;
    const host = options.host || ctx.host || ctx.get('X-Forwarded-Host');
    const userAgent = ctx.get('User-Agent');
    const {method, url} = ctx;

    const isPreRender = shouldPreRender({
      userAgent,
      bufferAgent: ctx.get('X-Bufferbot'),
      method,
      url,
    });

    // Pre-render generate the site and return
    if (isPreRender) {
      ctx.set('X-Prerender', 'true');
      const preRenderUrl = `${options.prerender}${protocol}://${host}${ctx.url}`;
      const headers = {
        'User-Agent': ctx.get('User-Agent'),
	'X-Prerender-Token': options.prerenderToken || process.env.PRERENDER_TOKEN,
      };
      return fetch(preRenderUrl, {headers}).then((res) => {
        ctx.body = res.body;
      });
    }
	  
    ctx.set('X-Prerender', 'false');
    return next();
  };
};

module.exports = preRenderMiddleware;
