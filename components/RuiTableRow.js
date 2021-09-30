/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiIndexContainer from './RuiIndexContainer.js';
export {RuiTableRow};

rui.registerClass(RuiTableRow);

export default function RuiTableRow(wOParent, name, wOptions = {}, designTime = false) {

  // add to class list
  rui.lib.addBaseTree(this, RuiTableRow);

  // name can be omitted for table rows, in this case the will be the 
  // position in the table
  if (typeof name == "undefined") name = wOParent.children.length;

  // with no options about group available, this row will be placed in the 
  // body section of the table. Otherwise the option will be used.
  let group = "body";
  if (typeof wOptions.group == "string") {
    group = wOptions.group;
    delete wOptions.group;
  }

  // change html root element to input
  wOptions.nodeName = "tr";
  wOptions.isEmbedded = true;

  // call base class constructor
  RuiIndexContainer.call(this, wOParent, name, wOptions, designTime);

  // check the arguments give to the constructor (needs this context)
  
  // html root element as local variable    
  let html = this.html;

  // use the group variable to append to the right table section
  switch (group) {
    case "body": wOParent.body.appendChild(html); break;
    case "head": wOParent.head.appendChild(html); break;
    case "foot": wOParent.foot.appendChild(html); break;
  }

  let props = {};
    
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTableRow = props;
  // and join them to the all object
  Object.assign(this.props.all, props);

  // set the object public object properties 
  rui.lib.applyOwnOptions(this, wOptions);
}
