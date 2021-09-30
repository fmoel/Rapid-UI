/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
import RuiGrid from './RuiGrid.js';
export {RuiIndexContainer};

rui.registerClass(RuiIndexContainer);
  
export default function RuiIndexContainer (wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiIndexContainer);
  let children = [];
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, self = this;

  if (wOParent !== window && wOParent._base.includes(RuiGrid)) {
    html.gridArea = name;
    this.caption = "";
  }

  function clear() {
    for (let child of children) {
      child.destroy();
    }
    children.length = 0;
    updateArray();  
  }
      
  html.classList.add("RuiContainer");
  
  let props = {
    children: rui.createConstant(children),
    add: rui.createMethod(add),
    removeByIndex: rui.createMethod(removeByIndex),
    removeByObject: rui.createMethod(removeByObject),
    length: rui.createReadOnly(() => children.length),
    _deleteChildReference: rui.createMethod(_deleteChildReference),
    clear: rui.createMethod(clear),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiIndexContainer = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  function updateArray() {
    let i;
    for (i = 0; i <= self.length; i++) {
      delete self[i];
    }
    for (i = 0; i < children.length; i++) {
      self[i] = children[i];
    }
  }

  function add(wOChild, position, targetHtml = html) {
    if (typeof position == "number") {
      if (position > children.length){
        throw new ReferenceError("RuiIndexContainer.add(wOChild, position) position higher than count");
      }
      children.splice(position, 0, wOChild);
      targetHtml.insertBefore(wOChild.html, targetHtml.childNodes[position]);
    } else {
      //wOParent[children.length] = wOChild;
      children.push(wOChild);
      targetHtml.appendChild(wOChild.html);
    }
    updateArray();
    if (wOChild.parent !== this && wOChild.parent._base.includes(RuiObject)) 
      wOChild.parent._deleteChildReference(wOChild);
  }

  function removeByIndex(indexToRemove) {
    if (children.length <= indexToRemove) throw new ReferenceError("RuiIndexContainer.removeByIndex(number indexToRemove) child with number indexToRemove '" + indexToRemove + "' not found");
    children[indexToRemove].destroy();
    children.splice(indexToRemove, 1);
    updateArray();
  }

  function removeByObject(wOChild) {
    let found = false;
    for (let indexToRemove in children) {
      if (children[indexToRemove] === wOChild) {
        children[indexToRemove].destroy();
        children.splice(indexToRemove, 1);
        delete this[indexToRemove];
        found = true;
        break;
      }
    }
    if (!found) throw new ReferenceError("RuiIndexContainer.removeByObject(RuiObject wOChild) child not found");
    updateArray();
  }
  function _deleteChildReference(wOChild) {
    for (let child in children) {
      if (children[child] === wOChild) {
        children.splice(child, 1);
        delete this[child];
        break;
      }
    }
  }
  this.getLayout.push(
      function getLayout(obj = {}) {
        children.forEach( (child, index) => {
          let o = {};
          child.getLayout(o);
          obj[index] = o;
        });
        return obj;
      }
    );            
  this.destroy.push(
      function destroy() {
        for (let i = 0; i < children.length; i++) {
          children[i].destroy();
        }
      }
    );
  rui.lib.applyOwnOptions(this, wOptions);
}
