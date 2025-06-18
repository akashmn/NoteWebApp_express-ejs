const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    fs.readdir(`./files`, function(err, files) {
        res.render('index', {files: files});
    })
});

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('_')}.txt`, req.body.description, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating file');
        }
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});