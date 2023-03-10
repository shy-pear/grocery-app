import React from 'react'
import Progress from './Progress';

export default function GroceryCard({list, setShowListPage, setListData, getGroceryLists}) {
  const numRemaining = list.numitems - list.totalcomplete;

  const deleteList = async () => {
    const id = list.id;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/groceryLists/${id}`, {
          method: 'DELETE'
        }
      );

      if (response.status === 200){
        getGroceryLists();
      }


    } catch (err){
      console.error(err);
    }
  };



  return (
    <div 
    className = "grocerycard"
    style = {{
      backgroundColor: numRemaining === 0 && list.numitems !== 0 ? "rgb(154, 187, 155)" : "white" 
    }}
    >

      <div className="grocerycard-info">

          <p className="top-info">
            <span className="listname">{list.name}</span>
            <span className="dot">&#183;</span>
            {list.numitems > 0 ?
             <span 
             className="num-info"
             style = {{
              color: numRemaining === 0 && list.numitems !== 0 ? "green" : "red" 
            }}
            >{list.totalcomplete} / {list.numitems}</span> : 
             <span className="num-info">{list.numitems}</span>
            }
          </p>

          <p className="store-info">{list.store}</p>

          <p className="date-info">Complete by: {list.date}</p>
      </div>
      
      <Progress list={list}/>

      <div className="grocerycard-buttons">
          {/* Button to edit the list - sets showlistpage to true */}
          <button 
          className="editlist-button" 
          onClick={() => {
            setShowListPage(true);
            setListData(list);
          }}
          >EDIT ITEMS</button>

          {/* button to delete the list */}
          <button className="deletelist-button" onClick={deleteList}>
            DELETE
          </button>
      </div>
      


    </div>
  )
}
