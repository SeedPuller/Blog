import { Col, Row } from 'antd'
import React from 'react'
import { domHtml, stripTags } from '../../../utils/stripTags'
import AboutTile from '../../AboutTile'
import SEO from '../../Seo'

const pageText = {
  paraOne: 
  `سلام.
  توی این وبلاگ قراره درباره هرچیزی که می‌بینم و نمی‌بینم بنویسم. اینجا خلاصه مطالبی که خوندم رو می‌نویسم؛ چیز هایی که یاد میگیرم رو می‌نویسم؛ [بعضی] احساساتم رو می‌نویسم و حقیقتا نوشتن رو دوست دارم و ازش لذت می‌برم.`,
  paraTwo:
    '',
}

const AboutMe = () => {
  const description = `${pageText.paraOne} ${stripTags(pageText.paraTwo)}`

  return (
    <>
      <div>
        <SEO
          title="درباره‌ی من"
          description={description}
          path=""
          keywords={[
            'SeedPuller',
          ]}
        />
        <h1 className="titleSeparate">درباره‌ی من</h1>
        <p>{pageText.paraOne}</p>
        <p dangerouslySetInnerHTML={domHtml(pageText.paraTwo)} />
      </div>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="gnu.png"
            height={60}
            alt="GNU image"
            textH3="دوستدار گنو"
            textH4="علاقه‌مند به جنبش نرم‌افزار آزاد"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="book.png"
            alt="book image"
            textH3="دوستدار کتاب"
            textH4="علاقه‌مند به دانستن"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="stupid.webp"
            alt="stupid image"
            textH3="ژنراتور دری وری"
            textH4="متخصص ساختن بداههٔ جملات بی‌معنی"
          />
        </Col>
      </Row>
    </>
  )
}
export default AboutMe
