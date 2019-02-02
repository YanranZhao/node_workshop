// import built-in Node packages
var http = require('http');
var express = require('express'); // import express
var server = express();
var body_parser = require('body-parser');
var methodOverride = require('method-override');

// import server modules
var data = require('./data');
// console.log(`song: ${data.list[0].title} by ${data.list[0].artist}`);

var port = 4000;

// set the view engine to ejs
server.set('view engine', 'ejs');


// method override to allow PUT, DELETE in EJS forms
server.use(methodOverride('_method'))

server.use(body_parser.urlencoded({ extended: false })); // parse form data
server.use(body_parser.json()); // parse JSON (application/json content-type)

server.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
 });

server.get("/json", function(req, res) {
    res.send((JSON.stringify({ name: "Lenny" })));
});

// template pages
server.get("/about", function(req, res) {
    res.render('about');
 });

 server.get("/info", function(req, res) {
    res.render('info', { message: 'Hello world' });
 });

 // API CRUD routes

 // get all items
server.get("/items", function(req, res) {
    res.json(data.list);
});

// get an item identified by id
server.get("/items/:id", function(req, res) {
    var item_id = req.params.id;
    var item = data.list.find(function(_item) {
        return _item.id === item_id;
    });
    res.json(item);
});

// create/post new item
server.post("/items", function(req, res) {
    var item = req.body;
    console.log('Adding new item: ', item);

    // add new item to array
    data.list.push(item)
    
    if (item.mode === "form") {
        // redirect to /playlist page
        res.redirect('/playlist');
    } else {
        // return updated list
        res.json(data.list);
    }
});

// update an item
server.put("/items/:id", function(req, res) {
    var item_id = req.params.id;
    var item = req.body;

    console.log("Editing item: ", item_id, " to be ", item);

    // init new list that will hold new items
    var updated_list_items = [];
    /*
        loop through all items
        if old_item matches id of the updated one, replace it
        else keep old_item
    */
    data.list.forEach(function (old_item) {
        if (old_item.id === item_id) {
            updated_list_items.push(item);
        } else {
            updated_list_items.push(old_item);
        }
    });

    // replace old list with new one
    data.list = updated_list_items;

    if (item.mode === "form") {
        // redirect to /playlist page
        res.redirect('/playlist');
    } else {
        res.json(data.list);
    }
});

// delete item from list
server.delete("/items/:id", function(req, res) {
    var item_id = req.params.id;
    console.log("Delete item with id: ", item_id);

    // filter list copy, by excluding item to delete
    var filtered_list = data.list.filter(function(item) {
        return item.id !== item_id;
    });

    // replace old list with new one
    data.list = filtered_list; 

    res.json(data.list);
});

// PLAYLIST ROUTES
server.get("/playlist", function(req, res) {
    res.render("playlist", { items: data.list });
});

server.get("/create", function(req, res) {
    res.render("create");
});

server.get("/edit/:id", function(req, res) {
    var item_id = req.params.id;
    var item = data.list.find(function(_item) {
        return _item.id === item_id;
    });

    res.render("edit", { item: item });
});

server.listen(port, function () { // Callback function
    console.log(`Server listening at ${port}`);
});
