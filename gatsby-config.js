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
        title: `Designing Data Intensive Applications`,
        link: `https://learning.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/`
      },
      listen: {
        title: `Squiggly Careers - How to negotiate for what you need`,
        link: `https://www.amazingif.com/listen/how-to-negotiate-for-what-you-need/`,
      },
      watch: {
        title: ``,
        link: `test`,
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
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `files`,
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
            },
          },
          `gatsby-remark-prismjs`,
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
        icon: `./static/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
  ],
}
