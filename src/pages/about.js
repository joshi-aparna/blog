import * as React from 'react'
import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = ({ data, location }) => {
  const title = "About"
  return (
    <Layout location={location} title={title}>
      <Seo title="About" />
      <p>
       This is one of my side projects as an attempt to learn Markdown, Gatsby and GraphQL. I promise to come back and update this page to share about me better.
      </p>
    </Layout>
  )
}
// Step 3: Export your component
export default AboutPage