import React from 'react'
import { Link, graphql } from 'gatsby'
import { kebabCase } from 'lodash'
import { GatsbyImage } from 'gatsby-plugin-image'

import DefaultLayout from '../components/layout'
import MemoryCard from '../components/MemoryCard/memorycard'
import PracticeCard from '../components/PracticeCard/practicecard'
import SEO from '../components/seo'
import ShareButtons from "../components/share"

import 'katex/dist/katex.min.css'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const seoimage = post.frontmatter.img
      ? post.frontmatter.img.childImageSharp.resize
      : null
    const slug = post.fields.slug
    const socail_share_title = `Read ${post.frontmatter.title} `;
    const tags = post.frontmatter.tags;
    const url = this.props.location.href;
    const twitterHandle = "R_APARNA_";

    return (
      <DefaultLayout>
        <SEO title={post.frontmatter.title} description={post.excerpt} postImage={seoimage} path={slug}/>
        <div className="clearfix post-content-box">
          <article className="article-page">
            <div className="page-content">
              {post.frontmatter.img && (
                <div className="page-cover-image">
                  <figure>
                    <GatsbyImage
                      image={
                        post.frontmatter.img.childImageSharp.gatsbyImageData
                      }
                      className="page-image"
                      key={
                        post.frontmatter.img.childImageSharp.gatsbyImageData.src
                      }
                      alt=""
                    />
                  </figure>
                </div>
              )}
              <div className="wrap-content">
                <header className="header-page">
                  <h1 className="page-title">{post.frontmatter.title}</h1>
                  <div className="page-date">
                    <span>{post.frontmatter.date}</span>
                  </div>
                </header>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
                <br/>
                {post.frontmatter.memorydata && (
                  <MemoryCard content={post.frontmatter.memorydata.internal}/>
                )}
                {post.frontmatter.practicedata && (
                  <PracticeCard content={post.frontmatter.practicedata.internal}/>
                )}
                <br/>
                <div>
                  <ShareButtons title={socail_share_title} url={url} twitterHandle={twitterHandle} tags={tags}/>
                </div>
                <div className="page-footer">
                  <div className="page-tag">
                    {post.frontmatter.tags &&
                      post.frontmatter.tags.map((tag) => (
                        <span key={tag}>
                          <Link className="tag" to={`/tags/${kebabCase(tag)}/`}>
                            # {tag}
                          </Link>
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </DefaultLayout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY, MMM DD")
        tags
        memorydata {
          internal {
            content
          }
        }
        practicedata {
          internal {
            content
          }
        }
        img {
          childImageSharp {
            resize(width: 1200) {
              src
              height
              width
            }
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH, formats: [AUTO, AVIF, WEBP])
          }
        }
      }
    }
  }
`
