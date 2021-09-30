/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
export {RuiTableCell};

rui.registerClass(RuiTableCell);

export default function RuiTableCell(wOParent, name, wOptions = {}, designTime = false) {

  // add to class list
  rui.lib.addBaseTree(this, RuiTableCell);

  // alias stores the name provided and creates later on a reference to this
  // object within the parent object
  let alias;
  if (typeof name == "string") alias = name;

  // if an alias is presented or name is unset, the column number will be used
  if (typeof name == "undefined" || typeof name == "string") 
    alias = wOParent.children.length;
  
  // change html root element to th or tr, dependend on the table section    
  if (wOParent.html.parentNode.nodeName == "THEAD")
    wOptions.nodeName = "th";
  else
    wOptions.nodeName = "td";
  
  wOptions.isEmbedded = true;
  
  // call base class
  RuiContainer.call(this, wOParent, name, wOptions, designTime);

  // check the arguments give to the constructor (needs this context)
  if(designTime){
    this.html.style.backgroundImage = "";
  }
  
  // create the alias reference
  if(typeof alias == "string") wOParent[alias] = this;

  // html root element as local variable    
  let html = this.html;

  // set the object public object properties 
  let props = {
    caption: rui.createVariable({
      get: () => html.innerHTML,
      set: val => html.innerHTML = rui.xlat.getTranslated(val), 
    }),
    rowSpan: rui.createVariable({
      get: () => html.getAttribute("rowspan"),
      set: val => html.setAttribute("rowspan", val), 
    }),
    colSpan: rui.createVariable({
      get: () => html.getAttribute("colspan"),
      set: val => html.setAttribute("colspan", val), 
    }),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTableCell = props;
  // and join them to the all object
  Object.assign(this.props.all, props);

  rui.lib.applyOwnOptions(this, wOptions);
}
