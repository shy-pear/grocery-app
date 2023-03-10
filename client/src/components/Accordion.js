import React from 'react'
import {useState} from 'react';
import ListItem from './ListItem'

export default function Accordion({title, catListItems, getListItems, listData, getGroceryLists}) {
  const [isActive, setIsActive] = useState(false);

  const numCatItems = catListItems.length;
  const numCatItemsComplete = catListItems.filter(item => item.complete).length;

  const sortedCatListItems = catListItems.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="accordion">

      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>{title}</div>
        &#183;
        <div>
         {numCatItemsComplete} / {numCatItems}
        </div>

        <div class="active-button">{isActive ? '-' : '+'}</div>
      </div>

      {isActive && <div className="accordion-content">
        {sortedCatListItems.map(catListItem => {
          return <ListItem 
          key={catListItem.id} 
          item={catListItem} 
          getListItems={getListItems} 
          listData={listData}
          getGroceryLists={getGroceryLists}
          />
        })}
      </div>}
      <></>

    </div>
    
  )
}
