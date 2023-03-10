import React from 'react'

export default function ListItem({item, getListItems, listData, getGroceryLists}) {
  //set up complete so that it changes when value of checkbox changes
  let completeStatus = item.complete;
  let endingCompleteStatus;

  //save new complete status to database when checkbox is changed
  //run getListItems() again to get updated list
  const updateData = async () => {

    try{
      const id = item.id;

      const response = await fetch(`${process.env.REACT_APP_SERVER}/listItems/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({complete: completeStatus})
      });

      if (response.status === 200){
        console.log("it worked!!");
        getListItems();
      }


    } catch (err) {
      console.error(err);
    }
  };

  //Update total complete count of grocerylist 
  //when something is checked or unchecked
  const updateGroceryData = async () => {
    const id = listData.id;
    let newTotalComplete;

    if (completeStatus === false){
      newTotalComplete = listData.totalcomplete -= 1;
    } else {
      newTotalComplete = listData.totalcomplete += 1;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/groceryListsComplete/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({totalcomplete: newTotalComplete})
      })

      if (response.status === 200){
        console.log("total complete updated!!");
        getGroceryLists();
      }

    } catch (err){
      console.error(err);
    }

  };

  //------------ delete list item methods -------------
  //delete the listitem itseld
  const deleteItem = async () => {
    const id = item.id;
    endingCompleteStatus = item.complete;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/itemLists/${id}`, {
          method: 'DELETE'
        }
      );

      if (response.status === 200){
        getListItems();
      }

    } catch (err){
      console.error(err);
    }
  };

  //update grocerylist numitems and totalcomplete
  const updateGroceryDataDelete = async () => {
    const id = listData.id;

    const newNumItems = listData.numitems -= 1;
    let newTotalComplete;

    if (endingCompleteStatus === true){
      newTotalComplete = listData.totalcomplete -= 1;
    } else {
      newTotalComplete = listData.totalcomplete;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/groceryListsDelete/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          numitems: newNumItems,
          totalcomplete: newTotalComplete
        })
      });

      if (response.status === 200){
        console.log("when item deleted grocery list is updated!!");
        getGroceryLists();
      }

    } catch (err){
      console.error(err);
    }

  }


  //handle change when checkbox is clicked
  const handleChange = () => {
    completeStatus = !completeStatus;
    updateData();
    updateGroceryData();
  }



  return (
    <div className = "list-item">

      <input 
      className="item-check-input" 
      id="item-check-input" 
      name="item-check" 
      type="checkbox"
      checked={item.complete}

      onChange={handleChange}

      ></input>

      {/* <label htmlFor="item-check-input">{item.name}</label>  */}
      <div className="list-item-info">
        <div class="top-item-info">
          <span className="list-item-name">{item.name}</span>
          <span className="list-item-quantity"> 	&#40; {item.quantity} &#41; </span>
        </div>
       
        {item.details !== "" ? <div className="list-item-details"> 
        <span>Details: </span> 
        {item.details}
        </div> : ""}
      </div>

      <button className="deleteitem-button" onClick={() => {
        deleteItem();
        updateGroceryDataDelete();
      }}>DELETE</button>  

    </div>
  )
}
