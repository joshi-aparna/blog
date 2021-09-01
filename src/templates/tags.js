import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import BlogItems from './blog-item'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`
  return (
    <Layout>
      <div className="content-box clearfix">
        <div className="blog-tags">
          <h1>{tagHeader}</h1>
          {/* <ul className="tag-list">
            {edges.map(({ node }) => {
              const { title, date } = node.frontmatter
              const { slug } = node.fields
              return (
                <li key={slug}>
                  <Link to={slug}>{title}</Link>
                  <small> | {date}</small>
                </li>
              )
            })}
          </ul> */}
          <BlogItems items={edges} />
          <span>
            <Link to="/tags">← All tags</Link>
          </span>
        </div>
      </div>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } }, isFuture: {  eq: false }  }
    ) {
      totalCount
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
