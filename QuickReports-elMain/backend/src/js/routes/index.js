var addon = require('../../c++/build/Release/addon');
const express = require('express')
const app = express()
const port = 3000

console.log(addon)
let resp = addon.getSampleCount() // 'STATUS Number Of Devices Connected: X'


app.get('/' , (req , res) => {
    resp = addon.getSampleCount()
    console.log(resp)
    res.send(resp)

})

app.get('/hello', (req , res) => {
    res.send(addon.hello())
})

app.listen(port , () => {
    console.log('Example app')
})