async function testRedirect() {
  const res = await fetch('https://niolaspasta.com/api/webhooks/flutterwave', {
    method: 'POST',
    redirect: 'manual'
  })
  console.log('Status:', res.status)
  console.log('Headers:', res.headers)
}
testRedirect()
