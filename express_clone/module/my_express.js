const http = require("http");
const URL = require("url");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");

const my_express = () => {
  const app = {};
  const requestHandler = (req, res) => {};
  app.listen = (port, callback) => {
    const server = http.createServer(requestHandler);
    server.listen(port, (err) => {
      callback(err);
    });
  };

   const get = {
     handler: [],
     path: [],
   };

   // app.get() function
   app.get = (path, handler) => {
     get.handler.push(handler);

     if (path.includes("/:")) {
       let urlPath = path.split(":")[0];
       urlPath = urlPath.substring(0, urlPath.length - 1);
       get.path.push(urlPath);
     } else {
       get.path.push(path);
     }
   };

   // The Routes Handler
   function manageRouteHandler(req, res) {
     const method = req.method;
     const url = req.url;
     const parsedUrl = URL.parse(url);
     const parsedQuery = querystring.parse(parsedUrl.query);

     req.query = parsedQuery;

     if (method === "GET" && get.path.includes(parsedUrl.pathname)) {
       const handlerIndex = get.path.indexOf(parsedUrl.pathname);
       get.handler[handlerIndex](req, res);
     } else {
       res.statusCode = 404;
       res.end(`Cannot ${method} ${url}`);
     }
   }

   // Request handler function
   const requestHandler = (req, res) => {
     manageRouteHandler(req, res);
   };

  return app;
};

module.exports = { my_express };
