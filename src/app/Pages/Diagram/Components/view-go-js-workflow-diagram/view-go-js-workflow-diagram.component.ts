import { Component, Input, OnInit, Output , EventEmitter } from '@angular/core';
import * as go from 'gojs';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-view-go-js-workflow-diagram',
  templateUrl: './view-go-js-workflow-diagram.component.html',
  styleUrls: []
})
export class ViewGoJsWorkflowDiagramComponent {
  title = 'Flow Diagram';

  public diagram: go.Diagram = null;
  public palette: go.Palette = null;

  @Input()
  public model: go.Model;

  @Output()
  public nodeClicked = new EventEmitter();


  constructor() {

 }


  setModel(){
    (this.diagram.model as go.GraphLinksModel).linkDataArray = [
      {
        "__gohashid": 5211,
        "from": "Start",
        "to": "Simple",
        "points": {
          "__gohashid": 5225,
          "s": true,
          "j": [
            {
              "x": -39.99999999999999,
              "y": -353.09875293110696,
              "s": true
            },
            {
              "x": -39.99999999999999,
              "y": -343.09875293110696,
              "s": true
            },
            {
              "x": -39.99999999999999,
              "y": -340.0182386176531,
              "s": true
            },
            {
              "x": -40,
              "y": -340.0182386176531,
              "s": true
            },
            {
              "x": -40,
              "y": -336.9377243041992,
              "s": true
            },
            {
              "x": -40,
              "y": -326.9377243041992,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 5455,
        "from": "Simple",
        "to": "Decision",
        "points": {
          "__gohashid": 5469,
          "s": true,
          "j": [
            {
              "x": -40,
              "y": -293.0622756958008,
              "s": true
            },
            {
              "x": -40,
              "y": -283.0622756958008,
              "s": true
            },
            {
              "x": -40,
              "y": -262.96886215209963,
              "s": true
            },
            {
              "x": -40,
              "y": -262.96886215209963,
              "s": true
            },
            {
              "x": -40,
              "y": -242.87544860839844,
              "s": true
            },
            {
              "x": -40,
              "y": -232.87544860839844,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 5951,
        "from": "Decision",
        "to": "Fork",
        "points": {
          "__gohashid": 7588,
          "s": true,
          "j": [
            {
              "x": -83.86473083496094,
              "y": -200,
              "s": true
            },
            {
              "x": -93.86473083496094,
              "y": -200,
              "s": true
            },
            {
              "x": -250,
              "y": -200,
              "s": true
            },
            {
              "x": -250,
              "y": -162.08264847688898,
              "s": true
            },
            {
              "x": -250,
              "y": -124.16529695377794,
              "s": true
            },
            {
              "x": -250,
              "y": -114.16529695377794,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 6359,
        "from": "Decision",
        "to": "Sub Workflow",
        "points": {
          "__gohashid": 7003,
          "s": true,
          "j": [
            {
              "x": 3.8647308349609517,
              "y": -200,
              "s": true
            },
            {
              "x": 13.864730834960952,
              "y": -200,
              "s": true
            },
            {
              "x": 210,
              "y": -200,
              "s": true
            },
            {
              "x": 210,
              "y": -104.84957402667659,
              "s": true
            },
            {
              "x": 210,
              "y": -9.699148053353184,
              "s": true
            },
            {
              "x": 210,
              "y": 0.3008519466468158,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 7998,
        "from": "Fork",
        "to": "Simple2",
        "points": {
          "__gohashid": 8012,
          "s": true,
          "j": [
            {
              "x": -250,
              "y": -65.83470304622207,
              "s": true
            },
            {
              "x": -250,
              "y": -55.834703046222074,
              "s": true
            },
            {
              "x": -250,
              "y": -31.386213675210648,
              "s": true
            },
            {
              "x": -360,
              "y": -31.386213675210648,
              "s": true
            },
            {
              "x": -360,
              "y": -6.937724304199218,
              "s": true
            },
            {
              "x": -360,
              "y": 3.062275695800782,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 9080,
        "from": "Fork",
        "to": "Simple3",
        "points": {
          "__gohashid": 9094,
          "s": true,
          "j": [
            {
              "x": -250,
              "y": -65.83470304622207,
              "s": true
            },
            {
              "x": -250,
              "y": -55.834703046222074,
              "s": true
            },
            {
              "x": -250,
              "y": -31.386213675210648,
              "s": true
            },
            {
              "x": -160,
              "y": -31.386213675210648,
              "s": true
            },
            {
              "x": -160,
              "y": -6.937724304199218,
              "s": true
            },
            {
              "x": -160,
              "y": 3.062275695800782,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 9465,
        "from": "Simple3",
        "to": "Join",
        "points": {
          "__gohashid": 9479,
          "s": true,
          "j": [
            {
              "x": -210.95418548583984,
              "y": 20,
              "s": true
            },
            {
              "x": -220.95418548583984,
              "y": 20,
              "s": true
            },
            {
              "x": -220.95418548583984,
              "y": 20,
              "s": true
            },
            {
              "x": -220.95418548583984,
              "y": 109,
              "s": true
            },
            {
              "x": -250,
              "y": 109,
              "s": true
            },
            {
              "x": -260,
              "y": 109,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 10016,
        "from": "Simple2",
        "to": "Join",
        "points": {
          "__gohashid": 10030,
          "s": true,
          "j": [
            {
              "x": -309.04581451416016,
              "y": 20,
              "s": true
            },
            {
              "x": -299.04581451416016,
              "y": 20,
              "s": true
            },
            {
              "x": -299.04581451416016,
              "y": 20,
              "s": true
            },
            {
              "x": -299.04581451416016,
              "y": 109,
              "s": true
            },
            {
              "x": -272,
              "y": 109,
              "s": true
            },
            {
              "x": -262,
              "y": 109,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 10269,
        "from": "Join",
        "to": "Terminate",
        "points": {
          "__gohashid": 10283,
          "s": true,
          "j": [
            {
              "x": -261,
              "y": 110,
              "s": true
            },
            {
              "x": -261,
              "y": 120,
              "s": true
            },
            {
              "x": -261,
              "y": 120,
              "s": true
            },
            {
              "x": -261,
              "y": 120,
              "s": true
            },
            {
              "x": -261,
              "y": 208,
              "s": true
            },
            {
              "x": -261,
              "y": 218,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      },
      {
        "__gohashid": 11459,
        "from": "Sub Workflow",
        "to": "End",
        "points": {
          "__gohashid": 11653,
          "s": true,
          "j": [
            {
              "x": 149.50556691246712,
              "y": 20,
              "s": true
            },
            {
              "x": 139.50556691246712,
              "y": 20,
              "s": true
            },
            {
              "x": -39.99999999999999,
              "y": 20,
              "s": true
            },
            {
              "x": -39.99999999999999,
              "y": 98.62503198135731,
              "s": true
            },
            {
              "x": -39.99999999999999,
              "y": 177.25006396271462,
              "s": true
            },
            {
              "x": -39.99999999999999,
              "y": 187.25006396271462,
              "s": true
            }
          ],
          "Aa": 8,
          "Fa": null,
          "Zg": null
        }
      }
    ]

    this.diagram.model.nodeDataArray = [
      {
        "key": "Start",
        "text": "Start",
        "figure": "Circle",
        "fill": "#00AD5F",
        "loc": "-40 -390",
        "__gohashid": 506
      },
      {
        "key": "End",
        "text": "End",
        "figure": "Circle",
        "fill": "#CE0620",
        "loc": "-40 220",
        "__gohashid": 507
      },
      {
        "key": "Decision",
        "text": "???",
        "figure": "Diamond",
        "fill": "yellow",
        "__gohashid": 1990,
        "loc": "-40 -200"
      },
      {
        "key": "Simple",
        "text": "Simple Step",
        "__gohashid": 2449,
        "loc": "-40 -310"
      },
      {
        "key": "Fork",
        "text": "Fork",
        "figure": "Ellipse",
        "fill": "#db1bbb",
        "__gohashid": 2812,
        "loc": "-250 -90"
      },
      {
        "key": "Simple2",
        "text": "Simple Step",
        "__gohashid": 3182,
        "loc": "-360 20"
      },
      {
        "key": "Simple3",
        "text": "Simple Step",
        "__gohashid": 3595,
        "loc": "-160 20"
      },
      {
        "key": "Join",
        "text": "Join",
        "figure": "PlusLine",
        "fill": "#a9e223",
        "__gohashid": 4070,
        "loc": "-260 110"
      },
      {
        "key": "Terminate",
        "text": "Terminate",
        "figure": "XLine",
        "fill": "#CE0620",
        "__gohashid": 4497,
        "loc": "-260 220"
      },
      {
        "key": "Sub Workflow",
        "text": "Sub Workflow",
        "figure": "RoundedRectangle",
        "fill": "lightyellow",
        "__gohashid": 5090,
        "loc": "210 20"
      }
    ]
 
  }

  public async ngAfterViewInit() {
    this.diagram = await $(go.Diagram, 'myDiagramDiv',
    {
      grid: $(go.Panel, "Grid",
        $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
        $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
      ),
      "draggingTool.dragsLink": false,
      "draggingTool.isGridSnapEnabled": true,
      "linkingTool.isUnconnectedLinkValid": false,
      "linkingTool.portGravity": 20,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 20,
      "relinkingTool.fromHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
      "relinkingTool.toHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
      "linkReshapingTool.handleArchetype":
        $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
      "rotatingTool.handleAngle": 270,
      "rotatingTool.handleDistance": 30,
      "rotatingTool.snapAngleMultiple": 15,
      "rotatingTool.snapAngleEpsilon": 15,
      "undoManager.isEnabled": true
    });

    const makePort = function(name, spot, output, input) {
      // the port is basically just a small transparent square
      return $(go.Shape, "Circle",
        {
          fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
          stroke: null,
          desiredSize: new go.Size(7, 7),
          alignment: spot,  // align the port on the main Shape
          alignmentFocus: spot,  // just inside the Shape
          portId: name,  // declare this object to be a "port"
          fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
          fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
          cursor: "pointer"  // show a different cursor to indicate potential link point
        });
    }

    var nodeSelectionAdornmentTemplate =
    await $(go.Adornment, "Auto",
      $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
      $(go.Placeholder)
    );

    var nodeResizeAdornmentTemplate =
    await $(go.Adornment, "Spot",
      { locationSpot: go.Spot.Right },
      $(go.Placeholder),
      $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

      $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

      $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
    );

  var nodeRotateAdornmentTemplate =
  await $(go.Adornment,
      { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
      $(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
      $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
    );

    const showSmallPorts = function(node, show) {
      node.ports.each(function(port) {
        if (port.portId !== "") {  // don't change the default port, which is the big shape
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
    }

    var linkSelectionAdornmentTemplate =
    await $(go.Adornment, "Link",
          $(go.Shape,
            // isPanelMain declares that this Shape shares the Link.geometry
            { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
        );

    this.diagram.nodeTemplate =
    await $(go.Node, "Spot",
      { locationSpot: go.Spot.Center },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
      { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
      { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
      new go.Binding("angle").makeTwoWay(),
      // the main object is a Panel that surrounds a TextBlock with a Shape
      $(go.Panel, "Auto",
        { name: "PANEL" },
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $(go.Shape, "Rectangle",  // default figure
          {
            portId: "", // the default port: if no spot on link data, use closest side
            fromLinkable: true, toLinkable: true, cursor: "pointer",
            fill: "white",  // default color
            strokeWidth: 2
          },
          new go.Binding("figure"),
          new go.Binding("fill")),
        $(go.TextBlock,
          {
            font: "bold 11pt Helvetica, Arial, sans-serif",
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true
          },
          new go.Binding("text").makeTwoWay())
      ),
      // four small named ports, one on each side:
      makePort("T", go.Spot.Top, false, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, false),
      { // handle mouse enter/leave events to show/hide the ports
        mouseEnter: function(e, node) { showSmallPorts(node, true); },
        mouseLeave: function(e, node) { showSmallPorts(node, false); }
      }
    );

    this.diagram.linkTemplate =
    $(go.Link,  // the whole link panel
      { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
      { relinkableFrom: true, relinkableTo: true, reshapable: true },
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4
      },
      new go.Binding("points").makeTwoWay(),
      $(go.Shape,  // the link path shape
        { isPanelMain: true, strokeWidth: 2 }),
      $(go.Shape,  // the arrowhead
        { toArrow: "Standard", stroke: null }),
      $(go.Panel, "Auto",
        new go.Binding("visible", "isSelected").ofObject(),
        $(go.Shape, "RoundedRectangle",  // the link shape
          { fill: "#F8F8F8", stroke: null }),
        $(go.TextBlock,
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#919191",
            margin: 2,
            minSize: new go.Size(10, NaN),
            editable: true
          },
          new go.Binding("text").makeTwoWay())
      )
    );

    this.diagram.model = new go.GraphLinksModel(
      [ 
        {"key": "Start" , "text":"Start", "figure":"Circle", "fill":"#00AD5F", "loc":"-40 -250"},
        {"key": "End", "text":"End", "figure":"Circle", "fill":"#CE0620", "loc":"-40 100"}
      ]
    );

      this.setModel();
  }

}
