import { fabric } from "fabric";
import { ICanvasObject } from "../core/models/CanvasObject";
import Stitch, { StitchControl, IsColorControl, getColorIndex } from "../core/models/Stitch";
import { ICanvasDimensions } from "./Canvas";

export class CanvasStitches implements ICanvasObject {
  protected staticPalette = [
    'red',
    'yellow',
    'green',
    'blue',
    'purple',
    'maroon',
    'olive',
    'black',
    'navy',
    'teal',
    'yellow',
    'green',
    'blue',
    'purple',
    'maroon',
  ]

  constructor(
    private canvasDimensions: ICanvasDimensions,
    private stitches: Stitch[]
  ) {}
  
  sendToBack(): void {
    throw new Error("Method not implemented.");
  }
  parseObject() {
    const center = {
      x: this.canvasDimensions.width / 2, //0.0
      y: this.canvasDimensions.height / 2 //0.0
    };

    const lines: fabric.Line[] = [];
    const lineOption = {stroke: this.staticPalette[0], strokeWidth: 1, selectable: false}; //rgba(0,0,0,1)
    const currentPoint = {...center};
    let firstStitch = true;
    

    for (let index = 0; index < this.stitches.length; index++) {
      const stitch = this.stitches[index];

      if(IsColorControl(stitch.control)) {
        firstStitch = true;
        lineOption.stroke = this.staticPalette[getColorIndex(stitch.control)];
      } else if(stitch.control === StitchControl.Cut) {
        firstStitch = true;
      } else if(stitch.control === StitchControl.Stitch) {
        if(firstStitch) {
          firstStitch = false;
        } else {
          lines.push(new fabric.Line([
            currentPoint.x, 
            currentPoint.y, 
            currentPoint.x + stitch.x, 
            currentPoint.y + -stitch.y
          ], lineOption));
           
        }    
      }

      currentPoint.x = currentPoint.x + stitch.x;
      currentPoint.y = currentPoint.y + -stitch.y;    
    }

    const oGridGroup = new fabric.Group(lines, {left: 0, top: 0, selectable: true, hoverCursor: 'grab'});
    return oGridGroup;
  }
    
}