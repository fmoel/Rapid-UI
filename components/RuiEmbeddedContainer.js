/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiEmbeddedContainer};

rui.registerClass(RuiEmbeddedContainer);

export default function RuiEmbeddedContainer (wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiEmbeddedContainer);
  let children = {};
  if(typeof wOptions == "undefined") wOptions = {};
  wOptions.skipMeInPath = true;
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, self = this;

  html.classList.add("RuiEmbeddedContainer");

  let props = {
    children: rui.createConstant(children),
    add: rui.createMethod(add),
    removeByName: rui.createMethod(removeByName),
    removeByObject: rui.createMethod(removeByObject),
    _deleteChildReference: rui.createMethod(_deleteChildReference),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiEmbeddedContainer = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    
  
  function add(wOChild, name, invisible) {
    children[name] = wOChild;
    wOParent[name] = wOChild;
    self[name] = wOChild;
    if (invisible !== true)
      html.appendChild(wOChild.html);
    if (wOChild.parent !== this && wOChild.parent._base.includes(RuiObject))
      wOChild.parent._deleteChildReference(wOChild);
  }

  function removeByName(nameToRemove) {
    if (!children.hasOwnProperty(nameToRemove)) throw new ReferenceError("RuiObject.removeByName(string nameToRemove) child with nameToRemove '" + nameToRemove + "' not found");
    children[nameToRemove].destroy();
    delete children[nameToRemove];
  }

  function removeByObject(wOChild) {
    let found = false;
    for (let child in children) {
      if (children[child] === wOChild) {
        children[child].destroy();
        delete children[child];
        found = true;
        break;
      }
    }
    if (!found) throw new ReferenceError("RuiObject.removeByName(string name) child with name '" + name + "' not found");
  }
  function _deleteChildReference(wOChild) {
    for (let child in children) {
      if (children[child] === wOChild) {
        delete children[child];
        delete this[child];
        break;
      }
    }
  }
  this.destroy.push(
    function destroy() {
      for (let childName in self.children){
        self.children[childName].destroy();
      } 
    }
  );
}
