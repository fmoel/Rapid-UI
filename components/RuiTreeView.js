/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiTreeView};

rui.registerClass(RuiTreeView);

export default function RuiTreeView(wOParent, name, wOptions = {}, designTime = false) {
  
  // add to class list
  rui.lib.addBaseTree(this, RuiTreeView);
  
  // call base class
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  
  // html is used to address the HTML root node for this control
  let html = this.html;
  
  // add the class to the root node
  html.classList.add("RuiTreeView");
  
  // variables are used to store the last selected element from the tree
  let selPath = "", selKey = "", selValue = null;

  // depthFilter is a possiblity to reject further traversing the object
  let depthFilter = null;
  
  // propertyFilter allows to select or deselect object properties from beeing
  // viewed in the tree view
  let propertyFilter = null;
  
  // event that is called when a element in the tree is clicked
  function elementClick(e){
    // check if the click is with in the expansion part of the element
    if(e.offsetX < 20 && e.offsetY < 20){
      this.classList.toggle("RuiTreeCollapsed");
    }else if(e.offsetY < 20){
      // check if the click is in the element itself
      let all = html.querySelectorAll(".RuiSelected");
      for(let i = 0; i < all.length; i++){
        all[i].classList.remove("RuiSelected");
      }
      this.classList.add("RuiSelected");
    }
    // store the current selection
    selKey = this.getAttribute("data-caption");
    selPath = this.selPath;
    selValue = this.selValue;
    e.stopImmediatePropagation();
    // raise the click event at the control root element
    html.click();
    return false;
  }


  // recursionArray holds all object references that are already passed
  //   this allows to check for cyclic references and avoid endless object
  //   parsing
  // object is the object to be parsed
  let recursionArray = []; 
  let defaultObject = {}, object = defaultObject;
  let currentDepth = 0;

  // this function is called to render the tree in to the html dom
  function renderObject(object, root, depth, path = ""){
    depth++;
    // push the object reference
    recursionArray.push(object);
    // loop throug all properties of the object
    for(let prop in object){
      // Filter by hasOwnProperty and, if set, by the propertyFilter function
      if(object.hasOwnProperty(prop)){
        if(typeof propertyFilter == "function" && !propertyFilter(object, prop))
          continue;
        // create the html element, append it and set the attributes/ callback
        let el = document.createElement("div");
        el.setAttribute("data-caption", prop);
        el.selPath = path;
        el.selValue = object[prop];
        root.append(el);
        el.addEventListener("click", elementClick);
        //el.addEventListener("dblclick", elementClick);
        // check if parsing is needed; filtered by depthFilter function, if 
        //   present
        if(typeof object[prop] == "object"){
          if(typeof depthFilter == "function" && 
              !depthFilter(object, prop, recursionArray, depth))
            continue;
          let found = false;
          // check for cyclic references and skip if found
          for(let i = 0; i < recursionArray.length; i++){
            if(recursionArray[i] === object[prop]) found = true;
          }
          if(!found) {
            let thisPath;
            if(path != "") 
              thisPath = path + "." + prop;
            else
              thisPath = prop;
            renderObject(object[prop], el, depth, thisPath);
          }
        }
      }
    }
    // remove current reference from cyclic reference list
    recursionArray.pop();
  }

  // function to empty the current view and rerender the new object or settings
  function updateView(){
    html.innerHTML = "";
    selPath = "";
    renderObject(object, html, 0);
  }

  // set the object public object properties 
  let props = {
    depthFilter: rui.createVariable({
      get: () => depthFilter,
      set: val => depthFilter = val, 
    }),
    propertyFilter: rui.createVariable({
      get: () => propertyFilter,
      set: val => propertyFilter = val,
    }),
    object: rui.createVariable({
      get: () => object,
      set: val => {
        object = val;
        updateView();
      }, 
    }),
    selectedPath: rui.createVariable({
      get: () => selPath,
      set: val => {
        console.warn("TODO: RuiTreeView.selectedPath implementation missing");
        updateView();
      }, 
    }),
    selectedKey: rui.createReadOnly( () => selKey),
    selectedValue: rui.createReadOnly( () => selValue),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTreeView = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  // if in preview mode create a preview for the timer
  if(wOptions.preview){
    wOptions = {
      top: 0,
      left: 0,
      height: 80,
      width: 80,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5)"
      },
      object: {
        test: {test: []},
        test1:{gag: {hal:[]}}
      }
    };
  }

  // apply options given in wOptions
  rui.lib.applyOwnOptions(this, wOptions);
}
