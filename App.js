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
	}finally {
		await client.close();
	}
}

// Call DB
run().catch(console.dir);

// insert data to database
const insertData = async (data,client,res) =>{
	try{
		await client.connect();

		const db = client.db('blog');
		const collection = db.collection('users');

		await collection.insertOne(data);
		const newData = await collection.find({}).toArray();

		users = await newData;
	} finally{
		res.redirect('/users');
		await client.close();
	}
}


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
app.use(bodyParser.urlencoded({ extended: true }));

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


app.post('/send-user',(req,res)=>{
	const newUser = req.body;

	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

	if(newUser){
		insertData(newUser,client,res).catch(console.dir);
	}
})


app.listen(1234,()=>{
	console.log(`Server is running in port 1234`);
})

