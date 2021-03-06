import { Button, Modal, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { quotesUrl } from '../../../../config'
import SubmitQuote from './SubmitQuote'

const Quotes = () => {
  const [quote, setQuote] = useState({})
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    fetch(quotesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetLastItem {
            quotes(last: 1, stage: PUBLISHED) {
              id
              text
              author
              senderName
              senderLink
              createdAt
            }
          }
        `,
      }),
    })
    // .then((res) => {
    //   console.log({res})
    // })
      .then(res => res.json())
      .then(({ data: { quotes } }) => {
        console.log(quotes)
        setQuote(quotes[0]) & setLoading(false)
      })
  }, [])

  return (
    <div className="container">
      <h1 className="titleSeparate">سخنی از دوست</h1>
      {loading ? (
        <div style={{ margin: '30px 0' }}>
          <Skeleton active />
        </div>
      ) : (
        <blockquote>
          {quote.text}
          <cite>~ {quote.author}</cite>
          <div className="sender">
            <span>
              {quote.senderLink ? (
                <a href={quote.senderLink}>{quote.senderName}</a>
              ) : (
                <span>{quote.senderName}</span>
              )}
            </span>
            <time dateTime={quote.createdAt}>
              {new Date(quote.createdAt).toLocaleDateString('fa-IR')}
            </time>
            <Button size="small" type="dashed" onClick={showModal}>
              نقل‌قول تازه
            </Button>
          </div>
        </blockquote>
      )}

      <Modal
        footer={null}
        destroyOnClose
        title="ارسال نقل‌قول تازه"
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <p>
          اگر شعر، جمله، دیالوگ یا نوشته‌ای دیدی که از نظرت جالب بود، خیلی
          خوشحال میشم که با ما هم در میون بذاری
          <br />
          تلاش میکنم خیلی زود نوشته‌ات رو تایید کنم، پس از اون بالای بلاگم نشون
          داده میشه و همه کیف میکنیم از خوندنش
        </p>
        <SubmitQuote handleOk={handleOk} />
      </Modal>
    </div>
  )
}

export default Quotes
