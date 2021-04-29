const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;

var db
const url = 'mongodb://localhost:27017'
const dbName = 'book_inventory'
MongoClient.connect(url,  {useUnifiedTopology: true}, (err, client) =>{
	if(err) return console.log(err)
	db = client.db(dbName)
	app.listen(5000, () => console.log('listening on port 5000...'))
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', async (req, res) => {
	try{
		const result = await db.collection('book').find().toArray()
		res.render('homepage.ejs', {data: result})
	}catch(err){}
})

app.get('/add', (req, res) => {
	res.render('add.ejs') 
})

app.get('/update', (req, res) => {
	res.render('update.ejs')
})

app.get('/delete', (req, res) => {
	res.render('delete.ejs')
})



app.post('/add', async (req, res) => {
	try{
		const result = await db.collection('book').insertOne(req.body)
	}catch(err){}
	res.redirect('/')
})

app.post('/update', async (req, res) => {
	try{
		const product = await db.collection('book').findOne({id: req.body.id})
		const new_value = parseInt(product.stock) + parseInt(req.body.stock)
		const result = await db.collection('book').updateOne(
			{id: req.body.id}, 
			{$set: {stock: new_value}},
			{sort: {id: -1}}, (err, result) => {
		})
	}catch(err){}	
	res.redirect('/')	
})

app.post('/delete', async (req, res) => {
	try{
		const id = req.body.id
		const result = await db.collection('book').remove({id: id})
	}catch(err){}
	res.redirect('/')
})