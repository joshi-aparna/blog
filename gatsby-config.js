module.exports = {
  pathPrefix: "/blog",
  siteMetadata: {
    title: `Aparna's Personal Space`,
    description: `This space will contain everything I want to remember.`,
    author: `Aparna Ravindra`,
    siteUrl: `https://joshi-aparna.github.io/blog`,
    social: {
      twitter: `R_APARNA_`,
      facebook: ``,
      github: `joshi-aparna`,
      linkedin: `aparna-ravindra`,
      email: `aparnaravindrajoshi@gmail.com`,
    },
    recommendations: {
      read: {
        title: `Start With Why`,
        link: `https://www.goodreads.com/book/show/7108725-start-with-why`
      },
      listen: {
        title: ``,
        link: `https://www.amazingif.com/listen/how-to-negotiate-for-what-you-need/`,
      },
      watch: {
        title: ``,
        link: ``,
      }
    },
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-emoji-unicode`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 970,
              withWebp: true,
              withAvif: true,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `warn`,
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
            }
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `files`,
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
            },
          },
          `gatsby-remark-prismjs`,
          {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
                    // You can add multiple tracking ids and a pageview event will be fired for all of them.
                    trackingIds: [
                      "G-ZTX2MT1Q88", // Google Analytics / GA
                    ],                    
                    // This object is used for configuration specific to this plugin
                    pluginConfig: {
                      // Puts tracking script in the head instead of the body
                      head: false,
                      // Setting this parameter is also optional
                      respectDNT: true,
                      // Avoids sending pageview hits from custom paths
                      exclude: ["/preview/**", ],
                    },
            },
          },
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    // uncomment this and input the trackingId to enable google analytics
    // {
    // resolve: `gatsby-plugin-google-analytics`,
    // options: {
    // trackingId: `ADD YOUR TRACKING ID HERE`,
    // },
    // },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `flexible-gatsby-starter`,
        short_name: `flexible-gatsby`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `./static/blog-icon.png`, // This path is relative to the root of the site.
      },
    },
    // `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
  ],
}
