const https = require('https');

writeLog();
setInterval(() => {
	writeLog();
}, 10 * 1000);

process
	.on('SIGINT', () => {
		sendSlack('Receive SIGNAL `SIGINT`.');
	})
	.on('SIGTERM', () => {
		sendSlack('Receive SIGNAL `SIGTERM`.');
	});

function writeLog() {
	const date = new Date();
	console.log('Hello World!', date.toLocaleString());
	sendSlack(`[${date.toLocaleString()}] Regular message.`);
}

function sendSlack(text) {
	const req = https.request('https://slack.com/api/chat.postMessage', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env['SLACK_TOKEN']}`,
			'Content-Type': 'application/json; charset=UTF-8',
		}
	}, (res) => {
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log(chunk);
		});
		res.on('end', () => {});
	});

	req.write(JSON.stringify({ channel: 'post-message', text }));
	req.end();
}