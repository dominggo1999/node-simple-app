// Connect to database  
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://arnolddominggo8:mardaup19@cluster0.jhueo.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let users = [];

const run = async () =>{
	try {
		await client.connect();

		const db = client.db('blog');
		const collection = db.collection('users');

		const data = await collection.find({}).toArray();

		users = data;
		console.log(data);
	}finally {
		await client.close();
	}
}

// Call DB
run().catch(console.dir);


// Setting up project
const express = require('express');
const app = express();
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const ejs = require('ejs');
const bodyParser = require('body-parser');

// Set the view engine 
app.set('view engine', 'ejs');

// Body parser
// create application/json parser
let jsonParser = bodyParser.json()

app.use(sassMiddleware({
    /* Options */
    src: __dirname + '/sass',
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
}));

// Tentukan folder static : public
// Server static file to client 
app.use(express.static(path.join(__dirname, '/public')));

app.get('/',(req,res)=>{
	res.render('home', {
		name : "arnold"
	});
})
app.get('/users',(req,res)=>{
	res.render('users',{
		users : users,
		tagline : "Vini Vidi Vici"
	});
})

app.get('/add-user',(req,res)=>{
	res.render('addUser');
})


app.post('/send-user',jsonParser,(req,res)=>{
	console.log(req.body);
	res.redirect('/users');
})


app.listen(1234,()=>{
	console.log(`Server is running in port 1234`);
})

