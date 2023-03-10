/**
 * - if authToken is on, the user should see homepage code
 * - if showList if on, user should see the list they clicked on
 * 
 * to start:
 * - display the homepage
 * 
 */

import HomePage from './components/HomePage';
import ListPage from './components/ListPage';
import Auth from './components/Auth';

import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';


const App = () => {

  //-----------variables---------

  //set up cookies
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const useremail = cookies.Email;
  const authToken = cookies.AuthToken;

  //set up grocerylists for rerender upon data change
  const [groceryLists, setGroceryLists] = useState([]);

  //set up showListPage so listpage renders from grocerycard when t
  const [showListPage, setShowListPage] = useState(false);

  //set up list data so the listpage renders correct data
  const [listData, setListData] = useState([]);

  //set up list items so they rerender when listdata is changed
  const [listItems, setListItems] = useState([]);


  //----------methods -------------

  //method to retrieve an array of the grocery lists for the email
  const getGroceryLists = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/groceryLists/${useremail}`);

      const json = await response.json();
      setGroceryLists(json);

      //console.log for testing
      console.log(json);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getGroceryLists();
  }, []);


  //method to retrieve the list items for the current grocery list
  const getListItems = async () => {
    //if no list data to display on list page then return
    if (listData.length === 0) {
      return;
    };

    const id = listData.id;

    try{
      const response = await fetch(`${process.env.REACT_APP_SERVER}/listItems/${id}`);

      const json = await response.json();
      setListItems(json);

      //console.log for testing
      console.log("list items: ");
      console.log(json);


    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getListItems();
  }, [listData]);


  return (
    <div className="App">

      {authToken && 
      <>
        <HomePage 
        groceryLists={groceryLists} 
        getGroceryLists={getGroceryLists}
        showListPage={showListPage}
        setShowListPage={setShowListPage}
        setListData = {setListData}
        />

        {showListPage && <ListPage 
        listData={listData} 
        setShowListPage={setShowListPage} 
        listItems={listItems}
        getListItems={getListItems}
        getGroceryLists={getGroceryLists}
        />}
      </>
      }
      
      {!authToken && <Auth/>}


    </div>
  );
};

export default App;
