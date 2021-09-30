/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiContainer};

rui.registerClass(RuiContainer);

export default function RuiContainer (wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiContainer);
  let children = {};
  let self = this;
      
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;

  let container = wOptions.container;
  if(wOptions.htmlIsContainer === true){
    container = html;
    wOptions.container = html;
  }

  if(!(container instanceof HTMLElement || container instanceof SVGElement)){
    container = document.createElement("div");
    wOptions.container = container;
    html.append(container);
  }    
  container.ruiRepresentation = this;
  
  html.classList.add("RuiContainer");

  let props = {
    children: rui.createConstant(children),
    add: rui.createMethod(add),
    removeByObject: rui.createMethod(removeByObject),
    removeByName: rui.createMethod(removeByName),
    _deleteChildReference: rui.createMethod(_deleteChildReference),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiContainer = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    
  
  function add(wOChild, name, invisible) {
    children[name] = wOChild;
    if (invisible !== true) container.appendChild(wOChild.html);
    if (wOChild.parent !== this && wOChild.parent._base.includes(RuiObject)) wOChild.parent._deleteChildReference(wOChild);
  }

  function removeByName(nameToRemove, noDestroy) {
    if (!children.hasOwnProperty(nameToRemove)) throw new ReferenceError("RuiContainer.removeByName(nameToRemove): child with '" + nameToRemove + "' not found");
    if(!noDestroy) children[nameToRemove].destroy();
    delete children[nameToRemove];
  }

  function removeByObject(wOChild, noDestroy) {
    let found = false;
    for (let childName in children) {
      if (children[childName] === wOChild) {
        if(!noDestroy) children[childName].destroy();
        delete children[childName];
        found = true;
        break;
      }
    }
    if (!found) throw new ReferenceError("RuiContainer.removeByObject(wOChild) child with name '" + wOChild.name + "' not found");
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
  this.getLayout.push(
    function getLayout(obj = {}) {
      Object.keys(children).forEach( (name) => {
        let o = {}
        children[name].getLayout(o);
        obj[name] = o;
      });
      return obj;
    });            

  this.destroy.push(
    function destroy() {
      for (let childName in self.children) {
        self.children[childName].destroy();
      }
    });

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      width: 60,
      height: 60,
      css: {
        // grid points:
        "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" +
        "AAAFCAYAAACNbyblAAAAGklEQVQYV2PcsG7D/4CgAEYGJIDCgYlTKAgAl+cEBtbxWZ" +
        "sAAAAASUVORK5CYII=)"
      }
    });
  }else{
    if(wOptions.designTime || designTime){
      this.css = {
          "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" +
          "AAAFCAYAAACNbyblAAAAGklEQVQYV2PcsG7D/4CgAEYGJIDCgYlTKAgAl+cEBtbxWZ" +
          "sAAAAASUVORK5CYII=)"
      };
    }
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
