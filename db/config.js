const mongoose = require('mongoose')
// const URI = 'mongodb://127.0.0.1:27017/facebook-servant'
const URI = 'mongodb+srv://facebook-servant-db:facebook-servant-db@cluster0.mvwnn.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('database connected!!')
}).catch((err) => {
    console.log(err.message)
})