import { Layout } from 'antd'
import { graphql, Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Header from '../../components/PageLayout/Header'
import Sidebar404 from '../../components/PageLayout/Sidebar/Sidebar404'
import style from './404.module.less'

export const query = graphql`
  {
    file(base: { eq: "404.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
  }
`

const NotFound = ({ data }) => (
  <Layout className="outerPadding">
    <Layout className="container">
      <Header />
      <Sidebar404>
        <>
          <div className={`${style.sidebar404Img} ${style.boxContent}`}>
            <img
              src={data.file.childImageSharp.fluid.src}
              width="100%"
              alt="404"
            />
          </div>
          <div className={`textCenter ${style.boxContent}`}>
            <h1>این صفحه وجود نداره :(</h1>
            <p>میتونی دنبال مطلب مورد نظرت توی بخش بلاگ بگردی :)</p>
            <Link to="/">
              <div className={`centerAlign ${style.textHover}`}>
                <span>بازگشت به خانه</span>
              </div>
            </Link>
          </div>
        </>
      </Sidebar404>
    </Layout>
  </Layout>
)

NotFound.propTypes = {
  data: PropTypes.object,
}

export default NotFound
