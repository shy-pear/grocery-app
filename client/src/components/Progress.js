import React from 'react'

export default function Progress({list}) {
  let percent;
  if (list.numitems > 0){
    percent = (list.totalcomplete / list.numitems ) * 100;
  } else {
    percent = 0;
  }
  
  return (
    <div className="outer">
      <div 
      className="inner"
      style={{
        width: `${percent}%`,
        backgroundColor: percent <= 50 ? '#ea5f6a' :
        'rgb(98, 157, 100)'
      }}
      >
      </div>
    </div>
  )
}
