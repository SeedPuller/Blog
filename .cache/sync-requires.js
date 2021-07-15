

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/.cache/dev-404-page.js"))),
  "component---src-pages-404-index-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/src/pages/404/index.js"))),
  "component---src-pages-blog-index-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/src/pages/blog/index.js"))),
  "component---src-pages-contact-index-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/src/pages/contact/index.js"))),
  "component---src-pages-index-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/src/pages/index.js"))),
  "component---src-pages-tags-index-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/src/pages/tags/index.js"))),
  "component---src-templates-post-post-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/src/templates/post/post.js"))),
  "component---src-templates-tags-index-js": (preferDefault(require("/home/moorko/Blog/jekyll/Blog/src/templates/tags/index.js")))
}

