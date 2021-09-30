/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiIndexContainer from './RuiIndexContainer.js';
import RuiTableCell from './RuiTableCell.js';
import RuiTableRow from './RuiTableRow.js';
export {RuiTable};

rui.registerClass(RuiTable);

export default function RuiTable(wOParent, name, wOptions = {}, designTime = false) {

  // add to class list
  rui.lib.addBaseTree(this, RuiTable);
  
  // change html root node to input
  wOptions.nodeName = "table";

  // call base class constructor
  RuiIndexContainer.call(this, wOParent, name, wOptions, designTime);

  // html root node as local variable    
  let html = this.html;

  // create table groups
  let head = document.createElement("thead");
  let body = document.createElement("tbody");
  let foot = document.createElement("tfoot");

  // append the table groups
  html.appendChild(head);
  html.appendChild(body);
  html.appendChild(foot);

  // add CSS class to html node element
  html.classList.add("RuiTable");

  // set the object public object properties 
  let props = {
    head: rui.createConstant(head),
    body: rui.createConstant(body),
    foot: rui.createConstant(foot),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTable = props;
  // and join them to the all object
  Object.assign(this.props.all, props);

  // if in preview mode create a preview 
  if(wOptions.preview){
    wOptions = {
      height: 32,
      width: 32,
      top: 0,
      left: 0,
      css: {
        border: "1px solid darkgray",
        "border-collapse": "collapse",
      },
    };
    // create example rows and cells
    for(let y = 0; y < 3; y++){
      let tr = new RuiTableRow(this);
      for(let x = 0; x < 3; x++){
        new RuiTableCell(tr, undefined, {
          css:{
            border: "1px solid darkgray",
            height: "7px",
            width: "8px",
          }
        });
      }
    }
  }
  
  // apply options given in wOptions
  rui.lib.applyOwnOptions(this, wOptions);
}
