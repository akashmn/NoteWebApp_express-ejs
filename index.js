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

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(404).send('File not found');
        }
        res.render('show', { title: req.params.filename, description: data });
    });
});

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(404).send('File not found');
        }
        res.render('edit', { title: req.params.filename, description: data });
    });
});

app.post('/edit', (req, res) => {
    const oldFilename = req.body.previous;
    const newFilename = req.body.new || oldFilename; // Use old filename if new one is empty
    const newContent = req.body.description;

    // First, update the content
    fs.writeFile(`./files/${oldFilename}`, newContent, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating file content');
        }

        // If filename changed, rename the file
        if (oldFilename !== newFilename) {
            fs.rename(`./files/${oldFilename}`, `./files/${newFilename}`, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error renaming file');
                }
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    });
});

// Add delete route
app.post('/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting file');
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});