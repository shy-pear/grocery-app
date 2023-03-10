import React from 'react'
import {useState} from 'react';
import {useCookies} from 'react-cookie'

import GroceryCard from './GroceryCard';
import AddlistModal from './AddlistModal';

export default function HomePage({groceryLists, getGroceryLists, showListPage, setShowListPage, setListData}) {
  //set up cookies for welcome user header and sign out
  const [cookies, setCookie, removeCookie] = useCookies(null);

  //allow rerendering when showAddlistModal is t or f
  const [showAddlistModal, setShowAddlistModal] = useState(false);
  const username = cookies.Username;

  //sign out by removing cookies
  const signOut = () => {
    removeCookie('Email');
    removeCookie('Username');
    removeCookie('AuthToken');

    window.location.reload();
  }

  const sortedGroceryLists =
    groceryLists?.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className = "homepage">
      {/* div to extend over the page */}
      <div 
      className="expand-div"
      style={{
        position: showListPage === true? 'absolute' : 'static',
        backgroundColor: 'white',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }}
      >
      </div>
      {/* List header for the signout/header text/add button/add modal */}
      <div className = "homepage-header">

        <button className="signout-button" onClick={signOut}>SIGN OUT</button>
        <h1>
          Welcome {username}!

          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path d="M19.029 13h2.971l-.266 1h-2.992l.287-1zm.863-3h2.812l.296-1h-2.821l-.287 1zm-.576 2h4.387l.297-1h-4.396l-.288 1zm2.684-9l-.743 2h-1.929l-3.474 12h-11.239l-4.615-11h14.812l-.564 2h-11.24l2.938 7h8.428l3.432-12h4.194zm-14.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm5.9-7-.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z"/></svg>
        </h1>

        <button className = "addlist-button" onClick={() => setShowAddlistModal(true)}>

        <svg className ="addnew-icon" viewBox="0 0 20 20">
							<path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
				</svg>
        ADD LIST
        </button>

        {showAddlistModal && <AddlistModal setShowAddlistModal={setShowAddlistModal} getGroceryLists={getGroceryLists}/> }

      </div>

      {/* The body to contain the grocery list cards */}
      <div className = "homepage-body">

        {/* If there are grocery lists,
        - map them to grocerycard classes */}

        {sortedGroceryLists?.map(list => {

         return <GroceryCard 
         key={list.id} 
         list={list} 
         setShowListPage={setShowListPage}
         setListData = {setListData}
         getGroceryLists={getGroceryLists}
         />;

        })}

      </div>
      
    </div>
  )
}

