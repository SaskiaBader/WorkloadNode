var express = require('express');
var bodyParser = require("body-parser");
var storage = require('node-persist');
var app = express();
app.set('views', './views');
app.set('view engine', 'jade');
storage.initSync();

var fil = 
storage.setItem('blockedDays',fil)

if(storage.getItem('blockedDays'))
{
    var blockedDays = storage.getItem('blockedDays');
}
else
{
    var blockedDays = [];
}

//Die Übersicht
app.get('/', function (req, res) {
  res.render('index');
});

//Das Formular
app.get('/blockieren/', function (req, res) {
  var developer = req.query.ma;
  res.render('blocking', { devId: developer});
});
app.use(bodyParser.urlencoded({ extended: false }));


//Verarbeiten der Formulareingaben
app.post('/blockieren/pruefen/', function(req, res) {
  var start = new Date(req.body.von);
  var end = new Date(req.body.bis);
  var blocks = req.body.bloecke;
  var dev = req.body.dev;
  var result = [];

    
    //Für jeden Tag in der Zeitspanne prüfen, ob noch Blöcke frei sind
    while(start < end){
        var starts = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
        
        blockedDays[dev] = [];

        if(blockedDays[dev] != undefined && blockedDays[dev][starts]<4)
        {
            var available = 4 - blockedDays[dev][starts];
            if(blocks>0)
            {
                if(available>blocks)
                {
                    available = blocks;
                }
                result[start] = lockedDays[dev][starts] + available;
                blocks = blocks - available;
            }
        } 
        else
        {
          result[start] = 4; 
          blocks = blocks-4;
        } 
        if(blocks>0)
        {
            res.send("Leider sind nicht genügend freie Blöcke verfügbar");
        }
        else 
        {
            res.send("Es sind genügend Blöche frei");
            //Blockierte Blöche speickern
            for (var key in result) {
                blockedDays[dev][key] = result[key];
            }
            storage.setItem('blockedDays',blockedDays);
            console.log(blockedDays);
        }
        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }


});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Die Webanwendung "Workload-Manager" wird gestartet...');
});

