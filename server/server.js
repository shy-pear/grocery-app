const PORT = process.env.PORT ?? 8000;

//get the express package
const express = require('express');
const app = express();
app.use(express.json());

//cors
const cors = require('cors');
app.use(cors());

//database js file
const pool = require('./db');

//password encryption and token packages
const {v4: uuidv4} = require('uuid');
const bcyrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --------- get data requests ----------
app.get('/categories', async (req, res) => {
  try{
    const categories = await pool.query(`SELECT * FROM Category`);
    res.json(categories.rows);

  } catch(err){
    console.error(err);
  }
})

//get all rows from grocerylists as array
app.get('/groceryLists/:userEmail', async(req, res) => {
  const {userEmail} = req.params;

  try{
    const groceryLists = await pool.query(
      `SELECT * FROM grocerylist WHERE useremail = $1`, [userEmail]);
    res.json(groceryLists.rows);


  } catch (err){
    console.error(err);
  }
})

//get the list items from specified grocery list
app.get('/listItems/:listId', async(req, res) => {
  const {listId} = req.params;

  try{
    const listItems = await pool.query(
      `SELECT * FROM listitem WHERE grocerylistid = $1`, [listId]);
    
    res.json(listItems.rows);

  } catch (err){
    console.error(err);
  }

})

// --------- post data requests ----------

//post new row in grocerylist
app.post('/groceryLists', async(req, res) => {
  const {name, store, date, numitems, useremail} = req.body;
  const id = uuidv4();

  try {
    const newGroceryList = await pool.query(
      `INSERT INTO grocerylist (id, name, store, date, numitems, useremail) VALUES ($1, $2, $3, $4, $5, $6)`, 
      [id, name, store, date, numitems, useremail]
    );

    res.json(newGroceryList);

  } catch (err) {
    console.error(err);
  }
})


//post new row in itemlist
app.post('/listItems', async(req, res) => {
  const {grocerylistid, categoryid, name, quantity, details} = req.body;

  const id = uuidv4();

  try {
    const newListItem = await pool.query(
      `INSERT INTO listitem (id, grocerylistid, categoryid, name, quantity, details) VALUES ($1, $2, $3, $4, $5, $6)`, 
      [id, grocerylistid, categoryid, name, quantity, details]
    );

    res.json(newListItem);

  } catch (err) {
    console.error(err);
  }
})

// --------- put data requests ----------

//update complete column in listitem
app.put('/listItems/:itemId', async(req, res) => {
  const {itemId} = req.params;
  const {complete} = req.body;

  try {
    const updatedListItem = await pool.query(
      `UPDATE listitem SET complete = $1 WHERE id = $2`, 
      [complete, itemId]
    );

    res.json(updatedListItem);


  } catch (err) {
    console.error(err);
  }

})

app.put('/groceryLists/:listId', async(req, res) => {
  const {listId} = req.params;
  const {numitems} = req.body;

  try {
    const updatedGroceryList = await pool.query(
      `UPDATE grocerylist SET numitems = $1 WHERE id = $2`, 
      [numitems, listId]
    );

    res.json(updatedGroceryList);


  } catch (err) {
    console.error(err);
  }

})

//update totalcomplete in grocerylist when listitem is checked
app.put('/groceryListsComplete/:listId', async(req, res) => {
  const {listId} = req.params;
  const {totalcomplete} = req.body;

  console.log('listid: ' + listId);
  console.log('totalcomplete: ' + totalcomplete);

  try {
    const updatedGroceryList = await pool.query(
      `UPDATE grocerylist SET totalcomplete = $1 WHERE id = $2`, 
      [totalcomplete, listId]
    );

    res.json(updatedGroceryList);


  } catch (err) {
    console.error(err);
  }

})

//update numitems and totalcomplete when listitem is deleted
app.put('/groceryListsDelete/:listId', async(req, res) => {
  const {listId} = req.params;
  const {numitems, totalcomplete} = req.body;

  try {
    const updatedGroceryList = await pool.query(
      `UPDATE grocerylist SET numitems = $1, totalcomplete = $2 WHERE id = $3`, 
      [numitems, totalcomplete, listId]
    );

    res.json(updatedGroceryList);


  } catch (err) {
    console.error(err);
  }

})

//------------- delete data requests ------------
app.delete('/groceryLists/:listId', async(req, res) => {
  const {listId} = req.params;

  try {
    await pool.query(
      `DELETE FROM listitem WHERE grocerylistid = $1`, [listId]
    );

    const deletedGroceryList = await pool.query(
      `DELETE FROM grocerylist WHERE id = $1`, [listId]
    );

    res.json(deletedGroceryList);

  } catch (err){
    console.error(err);
  }

})

app.delete('/itemLists/:itemId', async(req, res) => {
  const {itemId} = req.params;

  try {
    const deletedListItem = await pool.query(
      `DELETE FROM listitem WHERE id = $1`, [itemId]
    );

    res.json(deletedListItem);

  } catch (err){
    console.error(err);
  }

})

//---------------- sign up and log in post requests ----------------
app.post('/signup', async (req, res) => {
  const {email, username, password} = req.body;
  console.log('email: ' + email+ " username: " + username + " password: " + password);

  // create hashed password
  const salt = bcyrpt.genSaltSync(10);
  const hashedpassword = bcyrpt.hashSync(password, salt);

  try {
    const signUp = await pool.query(
        `INSERT INTO users (email, hashedpassword, username) VALUES($1, $2, $3)`,
        [email, hashedpassword, username]);

    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'});
    res.json({email, token, username});

  } catch (err) {
    console.error(err);
    res.json({detail: err.detail});
  }
})

app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try {
    const users =
        await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (users.rows.length <= 0) return res.json({detail: 'Email or password do not match. Please try again.'});

    // compare the password with hashed password in user row
    const passwordmatch =
        await bcyrpt.compare(password, users.rows[0].hashedpassword);

    if (passwordmatch) {
      const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'});
      res.json({
        'email': users.rows[0].email,
        'username': users.rows[0].username,
        token})
    } else {
      res.json({detail: 'Email or password do not match. Please try again.'});
    }

  } catch (err) {
    console.error(err);
  }
});



app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));