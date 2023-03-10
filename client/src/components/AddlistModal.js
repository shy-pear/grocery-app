import React from 'react'
import {useState} from 'react'
import {useCookies} from 'react-cookie';

export default function AddlistModal({setShowAddlistModal, getGroceryLists}) {

  //set up cookies for user email
  const [cookies, setCookie, removeCookie] = useCookies(null);

  //set up data object to contain the data set by user for new grocery list
  const [data, setData] = useState({
    name: "",
    store: "",
    date: "",
    numitems: 0,
    useremail: cookies.Email //CHANGE LATER - set to cookies.email
  });

  //Handle change function - set the data object to the new data in the input
  const handleChange = (e) => {
    const {name, value} = e.target;

    const newData = {...data};
    newData[name] = value;
    setData(newData);
  };

  //Post data to the database once user hits submit
  //rerender everything by calling getGroceryLists again
  //close out of window
  const postData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/groceryLists`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })

      if (response.status === 200){
        console.log("worked!!");
        setShowAddlistModal(false);
        getGroceryLists();
      }

    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className = "addlist-modal">

      {/* Header of the modal form */}
      <div className = "addlist-form-header">
        <h3>Let's create your grocery list!</h3>

        <button 
        className="addlist-exit"
        onClick = {() => setShowAddlistModal(false)}
        >X</button>
      </div>

      {/* Addlist modal form */}
      <form>
        {/* input for grocery name */}
        <input required maxLength={50} placeholder="list name" className="listname-input" id="itemname-input" name="name" type="text" onChange={handleChange}>
        </input>

        {/* input for grocery store */}
        <input required maxLength={50} placeholder="store(s)" className = "store-input" id="store-input" name="store" type="text" onChange={handleChange}></input>

        {/* input for date */}
        <label htmlFor='date-input'>Choose date to be completed</label>
        <input required className= "date-input" id="date-input" name="date" type="date" onChange={handleChange}></input>


        <input className = "addlist-submit" type="submit" onClick={postData}></input>
      </form>


      
    </div>
  )
}
