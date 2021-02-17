/**
 * Cache plugin for caching ApostropheCMS pages
 *
 * For most anonymous/member page visits static content can be rendered directly from the cache,
 * saving a lot in performance
 *
 * This module saves HTML response by overwriting ApostropheCMS function renderPageForModule
 *
 * Then Ssrves cached content in the expressMiddleware, this is called after some logic is run
 * like Auth, and data.global is filled but not much more.
 *
 * Conditions for cache are found in shouldRequestBeCached
 *
 * Uses standard cache of Openstad this gets emptied on every api request done through the proxy
 */
const cache = require('../../../services/cache').cache;
const qs = require('qs');
const cacheLifespan = 15 * 60;   // set lifespan of 15 minutes;
const cookieAuthKey = 'openstad-authorization.sid'; //@TODO get this from env somewhere

module.exports = {
    name: 'openstad-template-cache',
    improve: 'apostrophe-templates',
    construct(self, options) {
        /**
         * We serve the cache from the middleware
         */
        self.expressMiddleware = {
            // afterConfigured is one of the latest points to run middleware
            // this is done to ensure authentication logic has been run
            // this is used to determine if content should be cached or not
            when: 'afterConfigured',
            middleware: (req, res, next) => {
                const cacheKey = self.formatCacheKey(req);
                const cachedResponse = cache.get(cacheKey);

                if (cachedResponse && self.shouldRequestBeCached(req)) {
                    console.log('send Cached Page')
                    return req.res.send(cachedResponse);
                } else {
                    console.log('next')

                    // in case cache requirements are met,
                    // call self.sendPage();
                    next();
                }

            }
        };

        self.formatCacheKey = (req) => {
            return encodeURIComponent(`${req.url}?${qs.stringify(req.query)}`);
        }

        // check if it's a request that should be cached
        self.shouldRequestBeCached = (req) => {
            // APOS auth logic have not yet taken place
            // check if user is logged in directly in session
            // and check if user doesn't have a moderator role
            // only cache GET requests
            const moderatorRoles = ['member', 'moderator', 'admin'];

            return req.method === 'GET' &&
                (!req.session.openstadUser || (req.session.openstadUser && !moderatorRoles.includes(req.session.openstadUser.role)))
        }

        // this is the ApostropheCMS function for rendering a page in HTML
        const superRenderPageForModule = self.renderPageForModule;

        self.renderPageForModule = (req, template, data, module) => {
            let content;
            content = superRenderPageForModule(req, template, data, module);

            if (self.shouldRequestBeCached(req)) {
                const cacheKey = self.formatCacheKey(req);

                cache.set(cacheKey, content, {
                    life: cacheLifespan
                });
            }

            return content;
        }
    }
};