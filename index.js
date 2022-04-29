// Place your server entry point code here
const express = require('express')
const app = express()
const db = require("./src/services/database.js");
const morgan = require ('morgan');
const fs = require('fs');
// var md5 = require('md5');
// const { restart } = require('nodemon');

//read unrlencoded and json using express
app.use(express.urlencoded({extended: true}));
// Make Express use its own built-in body parser to handle JSON
app.use(express.json());

const args = require('minimist')(process.argv.slice(2))
args['port', 'debug', 'log', 'help']
const port = args.port || process.env.PORT || 5555;

//help command messages
if (args.help == true) {
    // console.log('server.js [options]')
    console.log('--port     Set the port number for the server to listen on. Must be an integer between 1 and 65535.\n')
    console.log('--debug    If set to `true`, creates endlpoints /app/log/access/ which returns a JSON access log from the database and /app/error which throws an error with the message "Error test successful." Defaults to `false`.\n')
    console.log('--log      If set to false, no log files are written. Defaults to true. Logs are always written to database.\n')
    console.log('--help     Return this message and exit.')
    process.exit(0)
}

//create access log file if true, additional middleware, writing to file
if (args.log == true) {
    //create a file called access log and wrtie to it
    const WRITESTREAM = fs.createWriteStream('FILE', {flags : 'a'});
    // Set up the access logging middleware
    app.use(morgan('FORMAT', { stream: WRITESTREAM }))
}

//start server for app
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

//middleware code
app.use( (req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        secure: req.secure,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
      }
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url,  protocol, httpversion, secure, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr.toString(), logdata.remoteuser, logdata.time, logdata.method.toString(), logdata.url.toString(), logdata.protocol.toString(), logdata.httpversion.toString(), logdata.secure.toString(), logdata.status.toString(), logdata.referer, logdata.useragent.toString())
    next()
 })

 // Serve static HTML files
app.use(express.static('./public'));

app.get('/app/', (req, res) => {
  // Respond with status 200
    res.statusCode = 200;
  // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

//ENDPOINTS for coinflip

//endpoints for debug == true
if (args.debug == true) {
    //app log access endpoint
    app.get('/app/log/access', (req, res) => {
        try {
            const stmt = db.prepare('SELECT * FROM accesslog').all()
            res.status(200).json(stmt)
            } catch(e) {
              console.error(e)
            }
    })

    //app error endpoint
    app.get('/app/error', (req, res) => {
        res.status(500);
        throw new Error('Error test successful.');
    })
}

app.get('/app/flip/', (req, res) => {
    let flip = coinFlip();
    res.status(200).json({'flip' : flip})
});

app.post('/app/flip/coins/', (req, res, next) => {
    const flips = coinFlips(req.body.number)
    const count = countFlips(flips)
    res.status(200).json({"raw": flips, "summary": count})
})

//endpoint that returns json object with raw random number flips and summary 
app.get('/app/flips/:number', (req, res) => {
	let raw_flips = coinFlips(req.params.number);
    let sum_flips = countFlips(raw_flips)
    res.json({'raw': raw_flips, 'summary': sum_flips})
});

//return result of flip
app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).json(flipACoin('heads'));
})

app.post('/app/flip/call/', (req, res, next) => {
        const game  = flipACoin(req.body.guess)
        res.status(200).json(game)

})

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).json(flipACoin('tails'));
})

//API that returns 404 not found for any undefined endpoints
app.use(function(req, res){
    const statusCode = 404
    const statusMessage = "Not Found"
    res.status(statusCode).end(statusCode + " " + statusMessage)
})

process.on('SIGINT', () => {
    server.close(() =>{
        console.log('\nApp stopped.')
    })
})

//COIN FLIPS FUNCTIONS
function coinFlip() {
    return Math.random() > .5 ? ("heads") : ("tails")
  }
  
  /** Multiple coin flips
   * 
   * Write a function that accepts one parameter (number of flips) and returns an array of 
   * resulting "heads" or "tails".
   * 
   * @param {number} flips 
   * @returns {string[]} results
   * 
   * example: coinFlips(10)
   * returns:
   *  [
        'heads', 'heads',
        'heads', 'tails',
        'heads', 'tails',
        'tails', 'heads',
        'tails', 'heads'
      ]
   */
  
function coinFlips(flips) {
    const results = new Array();
    
    for(let i = 0; i < flips; i++) {
      results.push(coinFlip());
    }
  
    return results
  
  }
  
  /** Count multiple flips
   * 
   * Write a function that accepts an array consisting of "heads" or "tails" 
   * (e.g. the results of your `coinFlips()` function) and counts each, returning 
   * an object containing the number of each.
   * 
   * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
   * { tails: 5, heads: 5 }
   * 
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
function countFlips(array) {
    let heads = 0;
    let tails = 0;
    let count = { heads: heads, tails: tails};
  
    for (let i = 0; i < array.length; i++) {
      if (array[i] === "heads") {
        heads++;
      }
      else {
        tails++;
      }
    }
  
    if (tails == 0) {
      count = {heads};
    }
    else if (heads == 0) {
      count = {tails};
    }
    else {
      count = {heads, tails};
    }
    return count;
  
  }
  
  /** Flip a coin!
   * 
   * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
   * 
   * @param {string} call 
   * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
   * 
   * example: flipACoin('tails')
   * returns: { call: 'tails', flip: 'heads', result: 'lose' }
   */
  
function flipACoin(call) {
    let flips = coinFlip();
    let result;
    if (call === flips) {
      result = "win";
    }
    else {
      result = "lose";
    }
    
    let output = {call: call, flip: flips, result: result}
    return output
  
  }