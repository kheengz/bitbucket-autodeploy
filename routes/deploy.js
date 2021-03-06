var express = require('express');
var router = express.Router();
require('dotenv').config();
const { exec } = require('child_process');
router.post('/', async function(req, res) {
    //console.log(' deploy ', req.body);
    const payload  = req.body;
    console.log('deploy triggered!', JSON.stringify(req.body));
    if (process.env['any']) {
	await 	exec(process.env['any'], (err, stdout, stderr) => {
			if (err) {
				console.log(err , stderr);
				res.send(err);
				return;
			}
			console.log('output', `${stdout}`);
			res.send( payload );
		});

		return;
    }
    if (payload.push
        && payload.push.changes
        && payload.push.changes[0]
        && payload.push.changes[0].new
      ) {
        // run the deploy shell script
        const resp = res;
        const command = process.env[`${payload.push.changes[0].new.name}`];
        if( command) {
            console.log(`${payload.push.changes[0].new.name}`, command)
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    resp.send(err);
                    console.log(err);
                    return;
                }
                console.log(`${stdout}`);
            });
        }
         res.send( payload.push.changes[0].new.name );
        return;
    }
    res.send('Invalid request');
});
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
