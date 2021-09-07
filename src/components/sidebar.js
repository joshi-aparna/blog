import { Link } from 'gatsby'
import React from 'react'

import Logo from './pic.jpg'

const Sidebar = ({ siteMetadata }) => (
  <>
    <aside className="sidebar">
      <header>
        <div className="about">
          <div className="cover-author-image">
            <Link to="/">
              <img src={Logo} alt={siteMetadata.author} />
            </Link>
          </div>
          <div className="author-name">{siteMetadata.author}</div>
          <p>{siteMetadata.description}</p>
        </div>
      </header>
      {siteMetadata.recommendations.read.title && (
        <div className="post">
        <div className="post-content">
            <h4><i className="fa fa-book" aria-hidden="true"></i> Read</h4>
            <a href={siteMetadata.recommendations.read.link}><p>{siteMetadata.recommendations.read.title}</p></a>
        </div>
      </div>
      )}
      {siteMetadata.recommendations.listen.title && (
        <div className="post">
        <div className="post-content">
            <h4><i className="fa fa-headphones" aria-hidden="true"></i> Listen</h4>
            <a href={siteMetadata.recommendations.listen.link}><p>{siteMetadata.recommendations.listen.title}</p></a>
        </div>
      </div>
      )}
      {siteMetadata.recommendations.watch.title && (
        <div className="post">
        <div className="post-content">
            <h4><i className="fa fa-television" aria-hidden="true"></i> Watch</h4>
            <a href={siteMetadata.recommendations.watch.link}><p>{siteMetadata.recommendations.watch.title}</p></a>
        </div>
      </div>
      )}
      
      <footer>
        <section className="contact">
          <h3 className="contact-title">Contact me</h3>
          <ul>
            {siteMetadata.social.twitter && (
              <li>
                <a
                  href={`https://twitter.com/${siteMetadata.social.twitter}`}
                  target="_blank"
                >
                  <i className="fa fa-twitter" aria-hidden="true" />
                </a>
              </li>
            )}
            {siteMetadata.social.facebook && (
              <li>
                <a
                  href={`https://facebook.com/${siteMetadata.social.facebook}`}
                  target="_blank"
                >
                  <i className="fa fa-facebook" aria-hidden="true" />
                </a>
              </li>
            )}
            {siteMetadata.social.github && (
              <li>
                <a
                  href={`https://github.com/${siteMetadata.social.github}`}
                  target="_blank"
                >
                  <i className="fa fa-github" aria-hidden="true" />
                </a>
              </li>
            )}
            {siteMetadata.social.linkedin && (
              <li>
                <a
                  href={`https://linkedin.com/in/${siteMetadata.social.linkedin}`}
                  target="_blank"
                >
                  <i className="fa fa-linkedin" aria-hidden="true" />
                </a>
              </li>
            )}
            {siteMetadata.social.email && (
              <li>
                <a href={`mailto:${siteMetadata.social.email}`} target="_blank">
                  <i className="fa fa-envelope-o" aria-hidden="true" />
                </a>
              </li>
            )}
          </ul>
        </section>
        <div className="copyright">
          <p>
            {new Date().getFullYear()} &copy; {siteMetadata.author}
          </p>
        </div>
      </footer>
    </aside>
  </>
)

export default Sidebar
