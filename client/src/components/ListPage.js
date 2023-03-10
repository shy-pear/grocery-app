import React from 'react'
import Accordion from './Accordion'
import AdditemModal from './AdditemModal'
import Progress from './Progress'
import {useState} from 'react';

export default function ListPage({listData, setShowListPage, listItems, getListItems, getGroceryLists}) {
  const cat1list = [];
  const cat2list = [];
  const cat3list = [];
  const cat4list = [];
  const cat5list = [];
  const cat6list = [];

  const catlists = [cat1list, cat2list, cat3list, cat4list, cat5list, cat6list];
  const categories = ['Produce/Deli', 'Meat/Seafood', 'Frozen', 'Packaged/Canned Goods', 'Bakery', 'Other'];

  const [showAdditemModal, setShowAdditemModal] = useState(false);

  let uniqueID = 0;



  return (
    <div className="listpage">

      <div className = "listpage-header">
        {/* Exit button */}
        <button 
        className="listpage-exit"
        onClick={() => setShowListPage(false)}
        >{"<< Back to Home"}</button>

        
        <div className="listpage-header-text">
          <h1>{listData.name}</h1>
          <h5>{listData.store}</h5>
        </div>

        <div className="listpage-header-bottom">

            {/* Add new list item button */}
            <button className = "additem-button" onClick={() => setShowAdditemModal(true)}>
              <svg className ="addnew-icon" viewBox="0 0 20 20">
                    <path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
              </svg>
              ADD ITEM
            </button>

            <Progress className="listpage-progress" list={listData}/>

        </div>
      
      

        {/* Additem Modal */}
        {showAdditemModal && <AdditemModal 
        setShowAdditemModal={setShowAdditemModal}
        listData={listData}
        getListItems={getListItems}
        getGroceryLists={getGroceryLists}
        />}

      </div>

      {/* listpage body */}

      <div className="listpage-body">

          {/* For each item in listItems
          - MUST SORT IN CORRECT ORDER - ALPHABETICALLY
          - sort it to correct category list
          - print the lists with at least one item to screen
          */}
          {listItems.forEach(listItem => {

            switch (listItem.categoryid) {
              case 1:
                cat1list.push(listItem);
                break;
              case 2:
                cat2list.push(listItem);
                break;
              case 3:
                cat3list.push(listItem);
                break;
              case 4:
                cat4list.push(listItem);
                break;
              case 5:
                cat5list.push(listItem);
                break;
              case 6:
                cat6list.push(listItem);
            }
          })}


          {/* For each category list
          - create accordian for list if length > 0
          - set title to correct index of categories array MIGHT CHANGE LATER TO ACTUAL DATABASE CALL
          - send catlist to the accordian */}
          {catlists.map(catlist => {

            if (catlist.length > 0){
              uniqueID += 1;
              return <Accordion 
              key = {uniqueID}
              title={categories[catlists.indexOf(catlist)]} 
              catListItems={catlist} 
              getListItems={getListItems}
              listData={listData}
              getGroceryLists={getGroceryLists}
              />
            }
            
          })}

      </div>
    
    </div>
  )
}

