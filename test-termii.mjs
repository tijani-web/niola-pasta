// run with: node --env-file=.env test-termii.mjs

const TERMII_API_KEY = process.env.TERMII_API_KEY
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'N-Alert'
const TO_NUMBER = '2347030462283'

async function testSMS() {
  console.log('Testing Termii SMS...')
  const res = await fetch('https://api.ng.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: TO_NUMBER,
      from: TERMII_SENDER_ID,
      sms: 'TEST: Niola Pasta notification system is working! ✅',
      type: 'plain',
      api_key: TERMII_API_KEY,
      channel: 'dnd'
    }),
  })
  const data = await res.json()
  console.log('SMS result:', JSON.stringify(data, null, 2))
}

async function testWhatsApp() {
  console.log('\nTesting Termii WhatsApp...')
  const res = await fetch('https://api.ng.termii.com/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: TO_NUMBER,
      from: 'N-Alert',
      sms: '🍝 *TEST ORDER — NP-TEST-0001*\n\nThis is a WhatsApp test from Niola Pasta!',
      type: 'plain',
      api_key: TERMII_API_KEY,
      channel: 'whatsapp'
    }),
  })
  const data = await res.json()
  console.log('WhatsApp result:', JSON.stringify(data, null, 2))
}

async function checkBalance() {
  console.log('\nChecking Termii balance...')
  const res = await fetch(`https://api.ng.termii.com/api/get-balance?api_key=${TERMII_API_KEY}`)
  const data = await res.json()
  console.log('Balance:', JSON.stringify(data, null, 2))
}

checkBalance().then(testSMS).then(testWhatsApp).catch(console.error)
