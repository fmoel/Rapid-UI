/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js'; 
import RuiContainer from './RuiContainer.js';
import RuiFrame from './RuiFrame.js';
export {RuiGrid};

rui.registerClass(RuiGrid);

export default function RuiGrid (wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiGrid);
  RuiContainer.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;

  html.classList.add("RuiGrid");

  let props = {
    gridTemplateColumns: rui.createStyle(this, "gridTemplateColumns", 
      false, undefined, wOptions.container),
    gridTemplateRows: rui.createStyle(this, "gridTemplateRows", 
      false, undefined, wOptions.container),
    gridTemplateAreas: rui.createStyle(this, "gridTemplateAreas", 
      false, undefined, wOptions.container),      
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiGrid = props;
  // and join them to the all object
  Object.assign(this.props.all, props);        
  
  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      height: 60,
      width: 60,
      top: 0,
      left: 0,
      border: "2px dashed gray",
      gridTemplateColumns: "auto",
      gridTemplateRows: "30px auto",
      gridTemplateAreas: '"frame1" "frame2"',
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5)"
      },
    });
    new RuiFrame(this, "frame1",{
      caption: "Frm1",
      height: "calc(100% - 2px)",
      css:{
        "border-bottom": "2px dashed gray"          
      }
    });
    new RuiFrame(this, "frame2",{
      caption: "Frm2"
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
