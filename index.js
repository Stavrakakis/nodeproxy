var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with latency
//
var proxy = httpProxy.createProxyServer();

//
// Create your server that make an operation that take a while
// and then proxy de request
//
http.createServer(function (req, res) {
  // This simulate an operation that take 500ms in execute
  if (req.method == 'POST') {
        console.log('POST');
        var body = '';

        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            console.log('Body: ' + body);
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
}
  setTimeout(function () {
    proxy.web(req, res, {
      target: 'http://localhost:9008'
    });
  }, 1500);
}).listen(8008);

//
// Create your target server
//
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9008);