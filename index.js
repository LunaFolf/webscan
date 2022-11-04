require('dotenv').config()

const { sendSMS } = require('./aws')

const readline = require('node:readline/promises')
require('colors')
const strip = require('strip-color')

const fs = require('node:fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const RawArgs = process.argv.slice(2)

const searchTerms = {}

;['flipperzero'].forEach(module => {
  searchTerms[module] = require(`./${module}`).handler
})

const args = {}
RawArgs.forEach(arg => {
  const [key, value] = arg.split(':')
  args[key] = value
})

let search = args.search

let ol = console.log
console.log = (...args) => {
  ol(...args)
  fs.appendFileSync('log.txt', strip(args.join(' ')) + '\n')
}

;(async () => {
  while (!search) {
    console.log('Please enter a search term')
    Object.keys(searchTerms).forEach((term, i) => console.log(`${i + 1} ${term}`))
    let answer = await rl.question('Search: ')
    answer = parseInt(answer)
    if (answer > 0 && answer <= Object.keys(searchTerms).length) {
      search = Object.keys(searchTerms)[answer - 1]
      rl.close()
    }
  }

  console.log('\n\r')

  if (!searchTerms[search]) {
    console.error(`Search term ${search} not found`)
    process.exit()
  }

  while (true) {
    // console.clear()
    await searchTerms[search]({ sendSMS })
    await new Promise(resolve => {
      const timeToWait = Math.round(Math.random() * 7 + 3) // 3-10 seconds
      console.log(`Waiting ${timeToWait} seconds before next check`.magenta + '\n\r')
      setTimeout(resolve, timeToWait * 1000)
    })
  }
})();