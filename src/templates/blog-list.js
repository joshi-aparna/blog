import React from 'react'
import { Link, graphql } from 'gatsby'

import DefaultLayout from '../components/layout'
import SEO from '../components/seo'
import BlogItems from './blog-item'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

    return (
      <DefaultLayout>
        <SEO
          title={siteTitle}
          keywords={[`blog`, `gatsby`, `javascript`, `react`, `aparna ravindra`, `books review`]}
        />
        <div className="content-box clearfix">
          <BlogItems items={posts} />
          <div className="container">
            <nav className="pagination" role="navigation">
              <ul>
                {!isFirst && (
                  <p>
                    <Link to={prevPage} rel="prev" className="newer-posts">
                      ← Previous Page
                    </Link>
                  </p>
                )}
                <p>
                  <span className="page-number">
                    Page {currentPage} of {numPages}
                  </span>
                </p>
                {!isLast && (
                  <p>
                    <Link to={nextPage} rel="next" className="older-posts">
                      Next Page →
                    </Link>
                  </p>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </DefaultLayout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: { isFuture: {  eq: false } } 
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          timeToRead
          frontmatter {
            title
            date(formatString: "YYYY, MMM DD")
            img {
              childImageSharp {
                gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH, formats: [AUTO, AVIF, WEBP])
              }
            }
          }
        }
      }
    }
  }
`
