/**
 * sobbot
 * @package sobbot
 * @version 0.1
 * @author Fernando D.
 * @link fernandomain.com
 * @license GNU Lesser General Public License
 */
var express = require('express'),
    jsdom = require('jsdom'),
    request = require('request'),
    url = require('url'),
    app = module.exports = express();

app.set('view engine', 'jade');

app.listen(3000, function() {
  console.log('Listening on http://localhost:3000');
});

app.get('/boss', function(req, res) {
  // Tell the request that we want to fetch the indicated uri send the results to a callback function.
  request({
    uri: 'http://www.larioja.org/npRioja/default/defaultpage.jsp?idtab=449882'
  }, function(err, response, body) {
    var self = this;
    self.items = new Array();

    if (err && response.statusCode !== 200) {
      console.log('Request error.');
    }

    // Send the body param as the HTML code we will parse in jsdom, also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com.
    jsdom.env({
      html: body,
      scripts: ['http://code.jquery.com/jquery-1.6.min.js']
    }, function(err, window) {
      // Use jQuery just as in any regular HTML page.
      var $ = window.jQuery,
          $body = $('body'),
          $titulo = $body.find('.header_title_boletin').text().trim(),
          $fecha = $body.find('.divbor > div.div_center > div.div_tercio_label').first().text(),
          $numero = $body.find('.divbor > div.div_center > div.div_tercio_label').last().text().trim(),
          $apartados = $body.find('.divbor > ul.lista > li');

      $apartados.each(function (i, item) {
        var $apartado = $(item).children('.disposicion').text().split('. '),
            $letra = $apartado[0],
            $titulo = $apartado[1];

        self.items[i] = {
          letra: $letra,
          titulo: $titulo.trim()
        };
      });

      $numero = $numero.substring($numero.indexOf(". ") + 2);

      // Let's see what we've got.
      console.log($titulo);
      console.log($fecha);
      console.log($numero);
      console.log(self.items);

      // We have all we came for, now let's render our view.
      res.render('list', {
        title: 'Sobbot',
        date: $fecha,
        items: self.items
      });
    });
  });
});
