require('dotenv').config()
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns")

let { AWS_ACCESS, AWS_SECRET } = process.env

const client = new SNSClient({
  credentials: {
    accessKeyId: AWS_ACCESS,
    secretAccessKey: AWS_SECRET
  },
  region: 'eu-west-2'
})

module.exports = {
  async sendSMS (message) {
    const command = new PublishCommand({
      Message: message,
      TopicArn: 'arn:aws:sns:eu-west-2:059047984671:WebScan'
    })

    try {
      const data = await client.send(command)
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }
}