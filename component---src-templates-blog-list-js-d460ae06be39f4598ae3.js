(self.webpackChunkflexible_gatsby=self.webpackChunkflexible_gatsby||[]).push([[544],{6179:function(e,t,a){"use strict";var n=a(7294),r=a(5414),i=a(5444);function l(e){var t=e.description,a=e.lang,l=e.meta,s=e.postImage,o=e.title,c=e.path,m=(0,i.useStaticQuery)("764694655").site,p=t||m.siteMetadata.description,g=s&&s.src?""+m.siteMetadata.siteUrl+s.src:null,u=""+m.siteMetadata.siteUrl+c;return n.createElement(r.Z,{htmlAttributes:{lang:a},title:o,titleTemplate:"%s | "+m.siteMetadata.title,meta:[{name:"description",content:p},{property:"og:url",content:u},{property:"og:title",content:o},{property:"og:description",content:p},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:image",content:g},{name:"twitter:creator",content:m.siteMetadata.author},{name:"twitter:title",content:o},{name:"twitter:description",content:p}].concat(g?[{property:"og:image",content:g},{property:"og:image:width",content:s.width},{property:"og:image:height",content:s.height},{name:"twitter:card",content:"summary_large_image"}]:[{name:"twitter:card",content:"summary"}]).concat(l)})}l.defaultProps={lang:"en",meta:[],description:""},t.Z=l},6032:function(e,t,a){"use strict";a.r(t);var n=a(3552),r=a(7294),i=a(5444),l=a(8738),s=a(6179),o=function(e){function t(){return e.apply(this,arguments)||this}return(0,n.Z)(t,e),t.prototype.render=function(){var e=this.props.data,t=e.site.siteMetadata.title,a=e.allMarkdownRemark.edges,n=this.props.pageContext,o=n.currentPage,c=n.numPages,m=1===o,p=o===c,g=o-1==1?"/":(o-1).toString(),u=(o+1).toString();return r.createElement(l.Z,null,r.createElement(s.Z,{title:t,keywords:["blog","gatsby","javascript","react","aparna ravindra","books review"]}),r.createElement("div",{className:"content-box clearfix"},a.map((function(e){var t=e.node;return r.createElement("article",{className:"post",key:t.fields.slug},t.frontmatter.img&&t.frontmatter.img.childImageSharp&&t.frontmatter.img.childImageSharp.gatsbyImageData&&r.createElement(i.Link,{to:t.fields.slug,className:"post-thumbnail",style:{backgroundImage:"url("+t.frontmatter.img.childImageSharp.gatsbyImageData.images.fallback.src+")"}}),r.createElement("div",{className:"post-content"},r.createElement("h2",{className:"post-title"},r.createElement(i.Link,{to:t.fields.slug},t.frontmatter.title)),r.createElement("p",null,t.excerpt),r.createElement("span",{className:"post-date"},t.frontmatter.date,"  — "),r.createElement("span",{className:"post-words"},t.timeToRead," minute read")))})),r.createElement("div",{className:"container"},r.createElement("nav",{className:"pagination",role:"navigation"},r.createElement("ul",null,!m&&r.createElement("p",null,r.createElement(i.Link,{to:g,rel:"prev",className:"newer-posts"},"← Previous Page")),r.createElement("p",null,r.createElement("span",{className:"page-number"},"Page ",o," of ",c)),!p&&r.createElement("p",null,r.createElement(i.Link,{to:u,rel:"next",className:"older-posts"},"Next Page →")))))))},t}(r.Component);t.default=o}}]);
//# sourceMappingURL=component---src-templates-blog-list-js-d460ae06be39f4598ae3.js.map