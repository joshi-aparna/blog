import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Sidebar from '.././components/sidebar'
import '../styles/main.scss'
import '../styles/fonts/font-awesome/css/font-awesome.min.css'
const tags = [{"name":"tag1"}]
const DefaultLayout = ({ children }) => (
  
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
            totalCount
          }
        }
        site {
          siteMetadata {
            author
            description
            social {
              twitter
              facebook
              linkedin
              github
              email
            }
            recommendations {
              read {
                title
                link
              }
              listen {
                title
                link
              }
              watch {
                title
                link
              }
            }
          }
        }
      }
    `}
    
    render={data => (
      <div className="wrapper">
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css?family=Lato|PT+Serif&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <Sidebar siteMetadata={data.site.siteMetadata} tags={data.allMarkdownRemark.group} />
        {children}
        <Sidebar tags={data.allMarkdownRemark.group} />
      </div>
    )}
  />
)

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultLayout
