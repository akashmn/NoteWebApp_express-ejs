import express from 'express'
const app = express()

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`)
    next()
})

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.get('/about', (req, res) => {
    res.send('About Page')
})

app.get('/contact', (req, res) => {
    res.send('Contact Page')
})

// Catch-all route for 404 errors
app.use((req, res) => {
    res.status(404).send('404 Not Found')
})

//for handling errors
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})