/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiObject from './RuiObject.js';
import RuiGrid from './RuiGrid.js';
import RuiContainer from './RuiContainer.js';
import RuiEmbeddedContainer from './RuiEmbeddedContainer.js';
import RuiIndexContainer from './RuiIndexContainer.js';
export {RuiVisibleControl};

rui.registerClass(RuiVisibleControl);

export default function RuiVisibleControl(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiVisibleControl);
  RuiObject.call(this, wOParent, name, wOptions, designTime);
  let self = this;
  let html = this.html;
  if (wOParent !== window && wOParent._base.includes(RuiGrid)) {
    html.style["grid-area"] = name;
  }
  html.setAttribute("data-name", name);
  if(wOptions.classList && Array.isArray(wOptions.classList)){
    wOptions.classList.forEach(val => html.classList.add(val))
    delete wOptions.classList;
  }
  
  html.classList.add("RuiVisibleControl");
  let visible = true;
  let moveable = false;
  let htmlStyle = window.getComputedStyle(html);
  
  function createGetDimension(dim){
    return {
      get: function(){
        return parseInt(htmlStyle.getPropertyValue(dim));
      },
      category: "const",
      enumerable: true,
      type: Number,
    };
  }
  
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
  
  let props = {
    tooltip: rui.createAttributeProperty("data-tooltip", html),
    tooltipPosition: rui.createAttributeProperty("data-tooltip-position", html),
    css: {
      set: function setCss(val){
        if(typeof val != "object") return;
        Object.keys(val).forEach( (name) => {
          html.style[name] = val[name];
        });
      },
      category: "const",
      enumerable: true,
      default: undefined,
      type: Object,
    },
    getLeft: createGetDimension("left"),
    getTop: createGetDimension("top"),
    getHeight: createGetDimension("height"),
    getWidth: createGetDimension("width"),
    getRight: createGetDimension("right"),
    getBottom: createGetDimension("bottom"),
    enabled: rui.createVariable({
      get: () => html.getAttribute("disabled") == "true",
      set: val => val ? html.removeAttribute("disabled") 
                      : html.setAttribute("disabled", ""),
    }),
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
      enumerable: true,
      configurable: true,
      type: Boolean,
    },
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

    left: rui.createStyle(this, "left", true, "resize"),
    right: rui.createStyle(this, "right", true, "resize"),
    top: rui.createStyle(this, "top", true, "resize"),
    bottom: rui.createStyle(this, "bottom", true, "resize"),
    height: rui.createStyle(this, "height", true, "resize"),
    width: rui.createStyle(this, "width", true, "resize"),
    position: rui.createStyle(this, "position", false),
    font: rui.createStyle(this, "font", false),
    border: rui.createStyle(this, "border", false),
    overflowX: rui.createStyle(this, "overflow-x", false),
    overflowY: rui.createStyle(this, "overflow-y", false),
    overflow: rui.createStyle(this, "overflow", false),
    padding: rui.createStyle(this, "padding", false),
    backgroundColor: rui.createStyle(this, "backgroundColor", false),
    color: rui.createStyle(this, "color", false),
    classList: rui.createConstant(html.classList),
    gridArea: rui.createStyle(this, "gridArea", false),
    zIndex: rui.createStyle(this, "zIndex", false),
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
  this.props.RuiVisibleControl = props;
  // and join them to the all object
  Object.assign(this.props.all, props);
  this.appendNow.push(
    function(){
      if (!self.isRoot) {
        if (self._base.includes(RuiEmbeddedContainer)) {
          wOParent.html.appendChild(html);
        }
      } else {
        document.body.appendChild(html);
      }
      html.dispatchEvent(new Event("append"));
    });
  if(designTime && !this.isEmbedded){
    html.classList.add("RuiIdeInLayoutWindow");
    rui.moveable.addMoveable(html, html);
    var nonDesignParent = this.parent;
    while(nonDesignParent && nonDesignParent.designTime)
      nonDesignParent = nonDesignParent.parent;
    rui.resizeable.makeResizable(this, true, nonDesignParent.html);
  }
  if (!self.isRoot) {
    if (wOParent !== window && (wOParent._base.includes(RuiContainer) ||
        wOParent._base.includes(RuiIndexContainer) ||
        wOParent._base.includes(RuiEmbeddedContainer))) {
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
}
