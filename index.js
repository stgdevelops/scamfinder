// Packages
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const math = require('mathjs');
const discord = require('./discord');
require('dotenv').config();
let PORT = process.env.PORT;
db = require('./database/mongo');

// Server Stuff
app.get('/', async (req, res) => {
  res.sendFile('/index.html', {
    root: `${__dirname}/Home`
  });
});
app.get('/css', async (req, res) => {
  let folder = req.query.folder;
  let file = req.query.file;
  res.sendFile(`/${file}.css`, {
    root: `${__dirname}/${folder}`
  });
});
app.get('/js', async (req, res) => {
  let folder = req.query.folder;
  let file = req.query.file;

  res.sendFile(`/${file}.js`, {
    root: `${__dirname}/${folder}`
  });
});
app.get('/json', async (req, res) => {
  let folder = req.query.folder;
  let file = req.query.file;

  res.sendFile(`/${file}.json`, {
    root: `${__dirname}/${folder}`
  });
});
app.get('/icon', async (req, res) => {
  res.sendFile(`/icon.png`, {
    root: __dirname
  });
});
app.get('/robots.txt', async (req, res) => {
  res.sendFile('/robots.txt', {
    root: __dirname
  });
});
app.get('/sitemap.rss', async (req, res) => {
  res.sendFile('/sitemap.rss', {
    root: __dirname
  });
  res.status(200);
});
app.get('/ping', async (req, res) => {
  res.send('sent ping');
  console.log('recieved ping');
});
app.get('/privacy', async (req, res) => {
  res.sendFile('/privacy.html', {
    root: `${__dirname}/Home/Policies`
  });
});
app.get('/terms', async (req, res) => {
  res.sendFile('/terms.html', {
    root: `${__dirname}/Home/Policies`
  });
});
app.get('/alexa', async (req, res) => {
  res.sendFile('/index.html', {
    root: `${__dirname}/Home/Alexa`
  });
});
app.get('/report', async (req, res) => {
  res.sendFile('/index.html', {
    root: `${__dirname}/Report`
  });
});
app.get('/api/get', async (req, res) => {
  let number = req.query.number;
  let results = await db.numbers.get(number);
  db.search.add(number);
  res.json(results);
});
app.get('/api/getrecentsearches', async (req, res) => {
  let results = await db.search.list();
  res.json(results);
});
app.get('*', async (req, res) => {
  res.sendFile('/index.html', {
    root: `${__dirname}/404`
  });
  res.status('404');
});

// Sockets
io.on('connection', socket => {
  socket.on('error', async error => {
    console.log(error);
  });
  socket.on('report', async (number, category) => {
    if (number.length === 10) {
    }
    else {
      let results = await db.numbers.get(number);
      if (results === null) {
        db.numbers.add(number, '1', '25', category, false);
      } else {
        let newReports = math.add(results.reports, 1);
        let newPercentage = math.add(results.percentage, 25);

        if (newPercentage > 100) {
          db.numbers.edit(number, newReports, newPercentage, category, true);
        } else {
          db.numbers.edit(
            number,
            newReports,
            newPercentage,
            category,
            results.verified
          );
        }
      }
    }
  });

  socket.on('getNumber', async number => {
    if (number.length === 10) {
    }
    else {
      let results = await db.numbers.get(number);

      db.search.add(number);

      if (results === null) {
        socket.emit(
          'results',
          `the phone number you have specified has not been reported, there is a 25 percent chance of this being a scam call if this is a scam call please go to the <a href="/report">Report</a> section of this website!`
        );
      } else {
        if (results.verified === true) {
          socket.emit(
            'results',
            `the phone number you have specified has ${
            results.reports
            } reports as a <span style="color: red;">${
            results.type
            }</span>, this is definitely a scam caller`
          );
        } else {
          socket.emit(
            'results',
            `the phone number you have specified has ${
            results.reports
            } reports as a <span style="color: red;">${
            results.type
            }</span>, there is a ${
            results.percentage
            } percent chance of this being a scam call`
          );
        }
      }
    }
  });
});

// Start Server
http.listen(PORT, () => {
  console.log(`Server Online!`);
  db.connect(process.env.MONGO);
});
