// var express = require('express'),
//     router = express.Router(),
//     /*
//       'path' is needed because relative paths ../../ are considered malicious
//       when importing modules in node. Example: importing routes in index.js
//     */
//     path = require('path');
//
// router.get('/', function(req, res, next) {
//   res.render( path.resolve('client/public/views/index.ejs') );
// });
//
//
// router.get('/profile', function(req, res, next){
//   console.log( req );
//   res.render('profile');
// })
//
//
// module.exports = router;
