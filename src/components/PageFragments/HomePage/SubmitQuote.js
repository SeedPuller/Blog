import { Button, Form, Input, message } from 'antd'
import PropType from 'prop-types'
import React from 'react'
import { quotesToken, quotesUrl } from '../../../../config'

const SubmitQuote = ({ handleOk }) => {
  const [form] = Form.useForm()

  const onFinish = ({ author, name, link = '', text }) => {
    fetch(quotesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2MjYyOTQ3NjMsImF1ZCI6WyJodHRwczovL2FwaS1hcC1ub3J0aGVhc3QtMS5ncmFwaGNtcy5jb20vdjIvY2txcXF5cndtM2dwZDAxeHg0bmRuaDAwcS9tYXN0ZXIiLCJodHRwczovL21hbmFnZW1lbnQtbmV4dC5ncmFwaGNtcy5jb20iXSwiaXNzIjoiaHR0cHM6Ly9tYW5hZ2VtZW50LmdyYXBoY21zLmNvbS8iLCJzdWIiOiIzY2QwOGM1Mi1lYjkwLTRmMDItOGMyMy0wODIwZjI4YTNkZmUiLCJqdGkiOiJja3IzeHd1ajUwM3kyMDF4aTk3NXM1cWpzIn0.2WqEYlBh1kZVDZ0kGktsC92CCAr_K-ltwfIdGnJen_BD1mawz7OJtAfrZE-UmocpWB-46rlex7b71OywpP_q28PV7R5pqG8iZDXnYlrm_byRG_W5JAOwgWOkP3NSLoWGZQSorgIglOWtqIKKN1RvIQ7yl5rG6_WP7LJTKz16NDFYpBklGEeK1bY5BGR0Mbs67ZdciQnOeJW_YNF7nCCjaLkpXXOsODOkiUoXi-zY6JSARlddfYAPMc1EHEL-LNp5huau3Tir_kyFoFO1wkZIxs_YzyKi5kachzYv3uxJ6r5X_uJG4cVw9_-qSqGv8xHsAfcYvYkjx7H9N25AUU9VPdzxsoH63-s4BeRNtaNn7Nh-t59ZAQhiCtZG9kN-WMtHGVzCHHOG8W7jL52_DZpbB7UlVtBLn2FIowy6jSJXGC9udcvmL1aCaVm-83bMLR0XzdlstkTCgCsymWQ3ZAdf9p-ZK1GsVcxrZeOeKXKfuUiVVCOaXIeQZHoP7al53HVyN6PeMqYwZ9D3sApsZYDLRgDwoD2hBukHzBnJL42TjaQttWoiO1hkd-vT5fAjIqiDmxlQQbSRMVNe5wuQtRRhIdKr27xqUtEutTP-znzeum4gu0YUlHeB3PvDINfsJDOzVbJ2UiZMY-iyhY3jrBW042TroVkwhMZwPNy_OOYEP78`,
      },
      body: JSON.stringify({
        query: `
        mutation MyMutation {
          __typename  createQuote(
            data: {
              text: "${text}",
              author: "${author}",
              senderName: "${name}",
              senderLink: "${link || ''}"
                }) {
            id
          }
        }        
        `
      })
    })
      .then(() => {
        message.success('دمت گرم بابت اشتراک گذاری 🙂')
      })
      .catch(err => {
        console.error(err)
      })
    handleOk()
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const validateMessages = {
    required: 'این فیلد الزامی است',
    types: {
      url: 'آدرس نادرست است',
    },
  }
  return (
    <Form
      form={form}
      name="nest-messages"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      validateMessages={validateMessages}
    >
      <Form.Item name={['author']} rules={[{ required: true }]}>
        <Input size="middle" placeholder="گوینده" />
      </Form.Item>
      <Form.Item name={['name']} rules={[{ required: true }]}>
        <Input size="middle" placeholder="نام شما" />
      </Form.Item>
      <Form.Item name={['link']} rules={[{ type: 'url' }]}>
        <Input size="middle" placeholder="لینک به شما" />
      </Form.Item>
      <Form.Item name={['text']} rules={[{ required: true }]}>
        <Input.TextArea size="middle" rows={2} placeholder="متن" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          ارسال
        </Button>
      </Form.Item>
    </Form>
  )
}

SubmitQuote.propTypes = {
  handleOk: PropType.func.isRequired,
}

export default SubmitQuote
