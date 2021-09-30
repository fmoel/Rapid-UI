/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiObject from './RuiObject.js';
import RuiSvg from './RuiSvg.js';
import RuiSvgGroup from './RuiSvgGroup.js';
export {RuiSvgControl};

rui.registerClass(RuiSvgControl);

export default function RuiSvgControl(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiSvgControl);
  RuiObject.call(this, wOParent, name, wOptions, designTime);
  let self = this;
  let html = this.html;

  html.setAttribute("data-name", name);
  if(wOptions.classList && Array.isArray(wOptions.classList)){
    wOptions.classList.forEach(val => html.classList.add(val))
    delete wOptions.classList;
  }
  
  html.classList.add("RuiSvgControl");
  let visible = true;
  let moveable = false;
  
  function addCssClass(className){
    html.classList.add(className);
  }

  function removeCssClass(className){
    html.classList.remove(className);
  }

  function toggleCssClass(className){
    return html.classList.toggle(className);
  }
  
  function hasCssClass(className){
    return html.classList.contains(className);
  }
  
  function getTranslation(){
    var transform = html.style["transform"];
    if(transform != null && transform.length > 11){
      let parts = transform.replaceAll("translate(","").replaceAll(")","").replaceAll(" ","").split(",");
      parts = parts.map((val, idx) => parseFloat(val));
    return {x: parts[0], y: parts[1]};
    }else
      return {x: 0, y: 0};    
  }

  function getLeft(){
    var left = 0;
    if(self.x != undefined) left += parseFloat(self.x);
    if(self.x1 != undefined) left += parseFloat(self.x1);
    left += getTranslation().x;
    var parent = self.parent;
    while(parent._base[0] != RuiSvg && parent.getTranslation){
      left += parent.getTranslation().x;
      parent = parent.parent;
    }
    return left;
  }

  function getTop(){
    var top = 0;
    if(self.y != undefined) top += parseFloat(self.y);
    if(self.y1 != undefined) top += parseFloat(self.y1);
    top += getTranslation().y;
    var parent = self.parent;
    while(parent._base[0] != RuiSvg && parent.getTranslation){
      top += parent.getTranslation().y;
      parent = parent.parent;
    }
    return top;
  }

  function getBoundingBox(forDimension){
    var bBox = html.getBoundingClientRect();
    if(forDimension == "width")
      return bBox.right - bBox.left;
    if(forDimension == "height")
      return bBox.bottom - bBox.top;
    return bBox[forDimension];    
  }

  let props = {
    getTranslation: rui.createMethod(getTranslation),
    getBoundingBox: rui.createMethod(getBoundingBox),
    tooltip: rui.createAttributeProperty("data-tooltip", html),
    tooltipPosition: rui.createAttributeProperty("data-tooltip-position", html),
    enabled: rui.createVariable({
      get: () => html.getAttribute("disabled") == "true",
      set: val => val ? html.removeAttribute("disabled") 
                      : html.setAttribute("disabled", ""),
    }),
    visible: {
      default: true,
      get: function() {
        return visible;
      },
      set: function(val) {
        visible = rui.lib.getBool(val);
        html.style.display = (visible || designTime) ? "" : "none";
        html.style.opacity = (!visible && designTime) ? 0.5 : 1;
      },
      category: "variable",
      enumerable: true,
      type: Boolean,
    },
    moveable: {
      default: false,
      get: function() {
        return moveable;
      },
      set: function(val) {
        var valBool = rui.lib.getBool(val);
        if(moveable != valBool) {
          moveable = valBool;
          if(moveable)
            rui.moveable.addMoveable(this);
          else
            rui.moveable.removeMoveable(this);          
        }
      },
      category: "variable",
      configurable: true,
      enumerable: true,
      type: Boolean,
    },

    getLeft: rui.createReadOnly(() => getLeft()),
    getRight: rui.createReadOnly(() => getLeft() + getBoundingBox("width")),
    getTop: rui.createReadOnly(() => getTop()),
    getBottom: rui.createReadOnly(() => getTop() + getBoundingBox("height")),
    getWidth: rui.createReadOnly(() => getBoundingBox("width")),
    getHeight: rui.createReadOnly(() => getBoundingBox("height")),
    
    stroke: rui.createAttributeProperty("stroke", html),
    strokeOpacity: rui.createAttributeProperty("stroke-opacity", html),
    strokeWidth: rui.createAttributeProperty("stroke-width", html),
    strokeLinecap: rui.createAttributeProperty("stroke-linecap", html),
    strokeLinejoin: rui.createAttributeProperty("stroke-linejoin", html),
    strokedashArray: rui.createAttributeProperty("stroke-dasharraay", html),

    fill: rui.createAttributeProperty("fill", html),
    fillOpacity: rui.createAttributeProperty("fill-opacity", html),
    vectorEffect: rui.createAttributeProperty("vector-effect", html),
    transform: rui.createAttributeProperty("transform", html),

    classList: rui.createConstant(html.classList),
    onAppend: rui.createEvent.call(this, "onAppend", true),
    onBlur: rui.createEvent.call(this, "onBlur", true),
    onClick: rui.createEvent.call(this, "onClick", true),
    onChange: rui.createEvent.call(this, "onChange", true),
    onChangeRelease: rui.createEvent.call(this, "onChangeRelease", true),
    onDblClick: rui.createEvent.call(this, "onDblClick", true),
    onDrag: rui.createEvent.call(this, "onDrag", true),
    onDragEnd: rui.createEvent.call(this, "onDragEnd", true),
    onDragEnter: rui.createEvent.call(this, "onDragEnter", true),
    onDragLeave: rui.createEvent.call(this, "onDragLeave", true),
    onDragOver: rui.createEvent.call(this, "onDragOver", true),
    onDragStart: rui.createEvent.call(this, "onDragStart", true),
    onDrop: rui.createEvent.call(this, "onDrop", true),
    onFocus: rui.createEvent.call(this, "onFocus", true),
    onFocusIn: rui.createEvent.call(this, "onFocusIn", true),
    onFocusOut: rui.createEvent.call(this, "onFocusOut", true),
    onKeyDown: rui.createEvent.call(this, "onKeyDown", true),
    onKeyPress: rui.createEvent.call(this, "onKeyPress", true),
    onKeyUp: rui.createEvent.call(this, "onKeyUp", true),
    onLoad: rui.createEvent.call(this, "onLoad", true),
    onMouseDown: rui.createEvent.call(this, "onMouseDown", true),
    onMouseEnter: rui.createEvent.call(this, "onMouseEnter", true),
    onMouseLeave: rui.createEvent.call(this, "onMouseLeave", true),
    onMouseMove: rui.createEvent.call(this, "onMouseMove", true),
    onMouseOut: rui.createEvent.call(this, "onMouseOut", true),
    onMouseOver: rui.createEvent.call(this, "onMouseOver", true),
    onMouseUp: rui.createEvent.call(this, "onMouseUp", true),
    onSelect: rui.createEvent.call(this, "onSelect", true),
    onSubmit: rui.createEvent.call(this, "onSubmit", true),
    onTouchend: rui.createEvent.call(this, "onTouchend", true),
    onTouchenter: rui.createEvent.call(this, "onTouchenter", true),
    onTouchleave: rui.createEvent.call(this, "onTouchleave", true),
    onTouchMove: rui.createEvent.call(this, "onTouchMove", true),
    onTouchStart: rui.createEvent.call(this, "onTouchStart", true),
    onWheel: rui.createEvent.call(this, "onWheel", true),
  };
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiSvgControl = props;
  // and join them to the all object
  Object.assign(this.props.all, props);
  /*this.appendNow.push(
    function(){
      if (!self.isRoot) {
        if (self._base.includes(RuiEmbeddedContainer)) {
          wOParent.html.appendChild(html);
        }
      } else {
        document.body.appendChild(html);
      }
      html.dispatchEvent(new Event("append"));
    });*/
    
  // Fake drag and drop
  let dragStarted = false;

  this.onMouseDown = function(e){
    if(e.which == 1 && e.target == html){
      if(e.target.getAttributeNS(null, "draggable") == "true"){
        dragStarted = false;
        document.body.addEventListener("mouseup", dragMouseUp);
        document.body.addEventListener("mousemove", dragMouseMove);
        rui.currentDragObject = self;
      }
    }
  }
  
  function dragMouseUp(e){
    document.body.removeEventListener("mouseup", dragMouseUp);
    document.body.removeEventListener("mousemove", dragMouseMove);
    if(dragStarted){
      var dragEvent = document.createEvent("DragEvent");
      dragEvent.initEvent("drop", true, true);
      dragEvent.initMouseEvent("drop", e.bubbles, e.cancelable, e.view, e.screenX, e.screenY, 
        e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, html.ruiRepresentation)
      e.target.dispatchEvent(dragEvent);
      
      var dragEvent = document.createEvent("DragEvent");
      dragEvent.initEvent("dragend", true, true);
      if(rui.currentDragObject.html)
        rui.currentDragObject.html.dispatchEvent(dragEvent);
      else
        rui.currentDragObject.dispatchEvent(dragEvent);
      rui.currentDragObject = undefined;
      dragStarted = false;
    }
  }
  
  function dragMouseMove(e){
    
    if(rui.currentDragObject != undefined){
      if(!dragStarted){
        var dragEvent = document.createEvent("DragEvent");
        dragEvent.initEvent("dragstart", true, true);
        dragEvent.initMouseEvent("dragstart", e.bubbles, e.cancelable, e.view, e.screenX, e.screenY, 
          e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, html.ruiRepresentation)
        html.dispatchEvent(dragEvent);
        dragStarted = true;
      }else{
        var dragEvent = document.createEvent("DragEvent");
        dragEvent.initEvent("drag", true, true);
        dragEvent.initMouseEvent("drag", e.bubbles, e.cancelable, e.view, 0, e.screenX, e.screenY, 
          e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button)
        html.dispatchEvent(dragEvent);
      }
    }
  }
    
  if(designTime && !this.isEmbedded){
    html.classList.add("RuiIdeInLayoutWindow");
    rui.lib.makeMeMovableXY.call(this, html, html);
    rui.lib.makeMeResizable(this, true);
  }
  
  if (!self.isRoot) {
    if (wOParent !== window && (wOParent._base.includes(RuiSvg) ||
        wOParent._base.includes(RuiSvgGroup))) {
      wOParent.add(self, name);
    }
  }
  rui.lib.applyOwnOptions(this, wOptions);
  this.destroy.push(
    function destroy() {
      try{
        self.html.parentNode.removeChild(self.html);
      }catch(e){
        console.error(this.path + "(" + name +"): Removing of html node failed. ");
      }
    });
  this.appendNow();
}
