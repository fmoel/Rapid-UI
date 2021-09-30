/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
import RuiEmbeddedContainer from './RuiEmbeddedContainer.js';
import RuiButton from './RuiButton.js';
export {RuiScrollBar};

rui.registerClass(RuiScrollBar);

export default function RuiScrollBar(wOParent, name, wOptions = {}, designTime = false) {

  // add to class list
  rui.lib.addBaseTree(this, RuiScrollBar);
  
  // call base class constructor
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);

  // direction is the scroll direction of the scrollbar
  let direction = "horizontal"; 
  // size is this width (horizontal mode) or height (vertical mode) of the 
  // slider
  let size = 22;
  // min is the minimum value of the scrollbar
  let min = 0; 
  // max is the maximum value of the scrollbar
  let max = 100; 
  // value is the current value of the scrollbar
  let value = 10;
  // store refernce to this
  let self = this;
  
  // html root node as local variable
  let html = this.html;
  
  // add CSS class to html node element
  html.classList.add("RuiScrollBar");

  html.addEventListener("resize", updateView);
  html.addEventListener("append", updateView);
  
  // TODO: change implemation of append-event, running after everything is 
  // appended
  setTimeout(updateView, 1);

  // create container for the additional buttons
  let container = new RuiEmbeddedContainer(
    this, "container", {
      skipMeInPath: true,
    }
  );
  container.appendNow();
  let down = new RuiButton(container, "down", {
    caption: "\u2BC6", 
    left: 0, 
    top: 0, 
    width: 20, 
    height: 20,
    skipMeInPath: true,
    appendNow: [],
  });
  let up = new RuiButton(container, "up", {
    caption: "\u2BC5", 
    right: 0, 
    bottom: 0, 
    width: 20, 
    height: 20,
    skipMeInPath: true,
    appendNow: [],
  });
  let slider = new RuiButton(container, "slider", {
    caption: "", 
    left: 0, 
    bottom: 0, 
    width: size, 
    height: size,
    skipMeInPath: true,
    appendNow: [],
  });

  let props = {
    min: rui.createVariable({
      get: () => min,
      set: val => {
        if (value < min)
          self.value = val;
        min = val;
        updateView();
      },
    }),
    max: rui.createVariable({
      get: () => max,
      set: val=> {
        if (value > max)
          self.value = val;
        max = val;
        updateView();
      }, 
    }),
    value: rui.createVariable({
      get: () => value,
      set: function(val) {
        if (val < min) val = min;
        if (val > max)  val = max;
        value = val; updateView();
        if(document.body.contains(html)){
          let event = new Event('change');
          html.dispatchEvent(event);
        }
      },         
    }),
    size: rui.createVariable({
      get: () => size,
      set: val => {
        size = val; updateView()
      }, 
    }),
    direction: rui.createVariable({
      get: () => direction,
      set: val => {
        if (val == "horizontal" || val == "vertical") direction = val; updateView()
      },         
    }),
  }

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiScrollBar = props;
  // and join them to the all object
  Object.assign(this.props.all, props);
  
  function updateView() {
    if (direction == "horizontal") {
      down.width = up.width = 20;
      down.height = up.height = slider.height = "100%";
      slider.width = size;
      slider.top = 0;
      slider.left = (self.getWidth - size - down.getWidth - up.getWidth) * (value - min) / (max - min) + down.getWidth;
      down.caption = "\u2BC7";
      up.caption = "\u2BC8";
    } else {
      down.width = up.width = slider.width = "100%";
      down.height = up.height = 20;
      slider.height = size;
      slider.left = 0;
      slider.top = (self.getHeight - size - down.getHeight - up.getHeight) * (value - min) / (max - min) + down.getHeight;
      down.caption = "\u2BC5";
      up.caption = "\u2BC6";
    }
  }

  // dragging the slider
  let startPos, startOff, dragging = null;
  slider.html.addEventListener("mousedown", function(e) {
    if (self.direction == "horizontal") {
      startOff = e.clientX;
      startPos = slider.getLeft;
    } else {
      startOff = e.clientY;
      startPos = slider.getTop;
    }
    dragging = self;
  });
  document.body.addEventListener("mousemove", mousemove);
  slider.html.addEventListener("mousemove", mousemove);
  function mousemove(e) {
    if (dragging === self) {
      if (self.direction == "horizontal") {
        let newLeft = startPos + e.clientX - startOff;
        self.value = (newLeft - down.getWidth) / (self.getWidth - size - down.getWidth - up.getWidth) * (max - min) + min;
        updateView();
      } else {
        let newTop = startPos + e.clientY - startOff;
        self.value = (newTop - down.getHeight) / (self.getHeight - size - down.getHeight - up.getHeight) * (max - min) + min;
        updateView();
      }
    }
  }
  document.body.addEventListener("mouseup", mouseup);
  slider.html.addEventListener("mouseup", mouseup);
  function mouseup(e) {
    if (dragging === self) {
      dragging = null;
      let event = new Event('changerelease');
      html.dispatchEvent(event);
    }
  }
  
  up.onClick = function(){
    self.value += 1;
  }
  down.onClick = function(){
    self.value -= 1;
  }

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      width: 60,
      height: 25,
      size: 10,
      direction: "horizontal",
      top: 0,
      left: 0,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5) translateY(16px)"
      }
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
