/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiInvisibleControl from './RuiInvisibleControl.js';
export {RuiTimer};

rui.registerClass(RuiTimer);

export default function RuiTimer(wOParent, name, wOptions = {}, designTime = false) {

  // add to class list
  rui.lib.addBaseTree(this, RuiTimer);

  // call base class
  RuiInvisibleControl.call(this, wOParent, name, wOptions, designTime);

  // initial values
  // interval time in ms until the event handler will be called
  let interval = 1000;
  // will this event be fired periodically
  let periodic = false;
  // is the timer currently running
  let running = false;
  // id of the window timer (used to stop the timer again)
  let intervalId = 0;
  // callback on the timer event
  let callback = cb_dummy; 
  // times the periodic event occours until start
  let times = 0;
  // reference to this class, is needed to switch the event handler context
  let self = this;


  function start() {
    times = 0;
    if (running) stop();
    if (periodic) {
      intervalId = setInterval(self.onTimeOut, interval);
    } else {
      intervalId = setTimeout(self.onTimeOut, interval);
    }
    running = true;
  }
  
  function stop() {
    if (running) {
      if (periodic) {
        clearInterval(intervalId);
      } else {
        clearTimeout(intervalId);
      }
      running = false;
    }
  }
      
  // define object properties
  let props = {
    interval: rui.createVariable({
      get: () => interval,
      set: val => {
        if (running) throw new ReferenceError("Cannot chance interval:" + val + " while running. Use stop to cancel current timer");
        interval = val;
      }, 
    }),
    periodic: rui.createVariable({
      get: () => periodic,
      set: val => {
        if (running) throw new ReferenceError("Cannot chance to periodic:" + val + " while running. Use stop to cancel current timer");
        periodic = val;
      }, 
    }),
    running: rui.createReadOnly( () =>running),
    start: rui.createMethod(start),
    stop: rui.createMethod(stop),
    onTimeOut: rui.createEvent.call(this, "onTimeOut"),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTimer = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    
  
  // this function changes the this context to the timer
  function changeEventContext() {
    // increase number of events since start
    times++;
    // if not perodic it is no longer running
    if (!periodic) running = false;
    // call the callback with this context on this timer
    callback.call(self, times, periodic, interval);
  }
  
  // this function will be called, if the onTimeOut is never set before
  function cb_dummy(fn) {
    if(typeof(fn) == "function")
      callback = fn;
  }
  
  // add to the destructor chain ...
  this.destroy.push(
    function destroy() {
      // stop this timer
      stop();
    }
  );
  
  // if in preview mode create a preview for the timer
  if(wOptions.preview){
    wOptions =  {
      top: 0,
      left: 0,
      height: "29px",
      width: "29px",
      designTime: true
    };
  }
  if (designTime || (typeof wOptions == "object" && wOptions.designTime === true)) {
    let html = this.html;
    html.innerHTML = "&#x23F1;";
  }
  
  // apply options given in wOptions
  rui.lib.applyOwnOptions(this, wOptions);
}
