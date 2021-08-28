import React from 'react'
import { Link } from 'gatsby'

class BlogItems extends React.Component {
    render() {
        const posts = this.props.items
        return(
            posts.map(({ node }) => {
                return (
                  <article className="post" key={node.fields.slug}>
                    {node.frontmatter.img &&
                      node.frontmatter.img.childImageSharp &&
                      node.frontmatter.img.childImageSharp.gatsbyImageData && (
                        <Link
                          to={node.fields.slug}
                          className="post-thumbnail"
                          style={{
                            backgroundImage: `url(${node.frontmatter.img.childImageSharp.gatsbyImageData.images.fallback.src})`,
                          }}
                        />
                      )}
                    <div className="post-content">
                      <h2 className="post-title">
                        <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                      </h2>
                      <p>{node.excerpt}</p>
                      <span className="post-date">
                        {node.frontmatter.date}&nbsp;&nbsp;—&nbsp;
                      </span>
                      <span className="post-words">
                        {node.timeToRead} minute read
                      </span>
                    </div>
                  </article>
                )
              })
        )
        
    }
}

export default BlogItems