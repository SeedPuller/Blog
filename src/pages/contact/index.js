import { Col, Layout, Row } from 'antd'
import React from 'react'
// import ContactForm from '../../components/PageFragments/ContactForm'
import Header from '../../components/PageLayout/Header'
import SidebarWrapper from '../../components/PageLayout/Sidebar'
import SEO from '../../components/Seo'

const Contact = () => (
  <Layout className="outerPadding">
    <Layout className="container">
      <SEO
        title="ارتباط با من"
        description="سیدپولر، برنامه‌نویس سی++ و علاقه‌مند به نرم‌افزار آزاد و امنیت نرم‌افزار"
        path="/contact"
        keywords={[
          'سیدپولر',
          'برنامه نویس',
        ]}
      />
      <Header />
      <SidebarWrapper>
        <div className="marginTopTitle">
          <h1 className="titleSeparate">ارتباط با من</h1>
        </div>
        <Row>
          <Col>
            <p style={{ marginBottom: 40 }}>
            راه های ارتباط با من این ها هستند:
            <ul>
              <li>رایانامهٔ من: SeedPuller [at] Gmail [dot] com</li>
              <li>حساب تلگرامم: SeedPuller</li>
              <li>حساب ماتریکس: @seedpuller:tchncs.de</li>
            </ul>
            <br></br>
            و همچنین کلید عمومی من:
            <ul>
              <li>کلید عمومی من در 
                {' '}
                <a href="https://keybase.io/seedpuller/">
                  KeyBase
                </a>
              </li>
            </ul>
            <br></br>
            هزینه پاسخ به هر پیام شما ۵ هزارتومان وجه رایج مملکت خواهد بود :) 
            </p>
          </Col>
        </Row>
        <Row gutter={[40, 20]}>

          <Col sm={24} md={24} lg={12}>
            <img
                src="../../contact.png"
                alt="contact"
                className="widthFull contactImgBorder"
              />
          </Col>

          {/* <ContactForm /> */}
        </Row>
      </SidebarWrapper>
    </Layout>
  </Layout>
)

export default Contact
