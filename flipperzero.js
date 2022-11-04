module.exports = {
  async handler ({ sendSMS }) {
    const res = await fetch('https://lab401.com/products/flipper-zero.js')
    const json = await res.json()

    const variants = json.variants

    const dateTimeNow = new Date()
    // Format dateTimeNow as YYYY-MM-DD HH:MM:SS
    const dateTimeNowFormatted = dateTimeNow.toISOString().replace('T', ' ').replace('Z', '')

    console.log(`Results for FlipperZero at ${dateTimeNowFormatted}`)
    
    await Promise.all(variants.map(async (variant) => {
      const name = variant.name
      const title = String(variant.title).blue
      const price = String('€' + ((variant.price * 1.20) / 100).toFixed(2)).cyan
      const inStock = variant.available ? true : false
      const inStockString = inStock ? 'In Stock'.green : 'Out of Stock'.red

      const link = String(`https://lab401.com/products/flipper-zero?variant=${variant.id}`)

      console.log(`${title} - ${inStockString} - ${price}` + (inStock ? ` - ${link}` : ''))

      if (inStock) {
        await sendSMS(`${name} in stock - ${link}`)
        process.exit(0)
      }
    }))

    console.log('\n\r')
  }
}