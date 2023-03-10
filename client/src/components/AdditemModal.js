import React from 'react'
import {useState} from 'react';

export default function AdditemModal({setShowAdditemModal, listData, getListItems, getGroceryLists}) {

  //set up data object to contain the data set by user for new item
  const [itemData, setItemData] = useState({
    grocerylistid: listData.id,
    categoryid: 1,
    name: "",
    quantity: 1,
    details: "" //MIGHT WANT TO CHANGE TO NULL
  });

  //method to set any input changes to item data
  const handleChange = (e) => {
    const {name, value} = e.target;

    const newItemData = {...itemData};
    newItemData[name] = value;
    setItemData(newItemData);
  }

  //method to post item data to database
  const postData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/listItems`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(itemData)
      })

      if (response.status === 200){
        console.log("worked!!");
        setShowAdditemModal(false);
        getListItems();
      }

    } catch (err) {
      console.error(err);
    }
  }

  //when adding items update the num items for the grocerylist
  const updateGroceryData = async (e) => {
    e.preventDefault();

    const id = listData.id;
    
    const newNumItems = listData.numitems += 1;
    console.log(newNumItems);

    try {
      const response = await fetch (
        `${process.env.REACT_APP_SERVER}/groceryLists/${id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({numitems: newNumItems})
        });

        if (response.status === 200){
          console.log("grocery lists updated!!");
          getGroceryLists();
        }

    } catch (err) {
      console.error(err);
    }

  };


  return (
    <div className="additem-modal">

      {/* Header of additem form */}
      <div className ="additem-form-header">

        <h3>Let's Add an Item!</h3>

        {/* Exit button */}
        <button 
          className="additem-exit"
          onClick={() => setShowAdditemModal(false)}>X
        </button>

      </div>

      {/* Additem form */}
      <form>
         {/* input for item name */}
         <input required maxLength={50} placeholder="Item name" className="itemname-input" id="itemname-input" name="name" type="text" onChange={handleChange}>
        </input>

        {/* Input for quantity of item */}
        <label htmlFor='quantity-input'>Choose quantity of item</label>
        <input required className="quantity-input" id="quantity-input" name="quantity" type="number" min="1" max="100" onChange={handleChange}></input>

        {/* input for category */}
        <label htmlFor='category-input'>Choose category of item</label>
        <select required className="category-input" id="category-input" name="categoryid" onChange={handleChange}>
          <option value={1}>Produce/Deli</option>
          <option value={2}>Meat/Seafood</option>
          <option value={3}>Frozen</option>
          <option value={4}>Packaged/Canned Goods</option>
          <option value={5}>Bakery</option>
          <option value={6}>Other</option>
        </select>

        {/* optional input for additional details */}
        <label htmlFor='details-input'>Optional: enter additional details</label>
        <textarea className="details-input" id="details-input" name="details" rows="3" cols="30" onChange={handleChange}></textarea>

       
        <input className = "additem-submit" type="submit" onClick={(e) => {
          postData(e);
          updateGroceryData(e);
        }}></input>

      </form>
      
    </div>
  )
}
