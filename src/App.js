import React, { useEffect, useRef } from "react";
import "./App.css";
import init from "./MoveableController";

const noOfRow = 5;
const noOfCol = 4;

const height = 50;
const width = 100;

const rows = new Array(noOfRow).fill(1);
const cols = new Array(noOfCol).fill(1);
const cells = new Array(noOfCol * noOfRow).fill(1);

function App() {
  const moveableRef = useRef(init());

  const handleHoverBorderRow = (e) => {
    const moveable = moveableRef.current;
    moveable.target = e.target;
  };

  const handleMouseOutBorderRow = (e) => {
    const moveable = moveableRef.current;
    const rowIndex = e.target.dataset["row"];
    console.log("out row", rowIndex);
    moveable.target = null;
  };

  return (
    <div
      className="container"
      style={{
        // border: "1px solid black",
        width: `${width * noOfCol}px`,
        height: `${height * noOfRow}px`,
        position: "relative",
      }}
    >
      <table
        id="table"
        style={{
          bordeCollapse: "collapse",
          border: "1px solid",
          pointerEvents: "none",
          zIndex: 1,
          padding: 0
        }}
      >
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr data-row={rowIndex}>
              {cols.map((col, colIndex) => (
                <td style={{ border: '1px solid' }}>
                  <div data-row={rowIndex} data-col={colIndex} style={{ display: "flex", justifyContent: "center", height: height, width: width }}>
                    1
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.4,
          width: `${width * noOfCol}px`,
          height: `${height * noOfRow}px`,
          zIndex: 2,
        }}
      >
        {cells.map((cell, index) => {
          const inx = index;
          const rowIndex = Math.floor(inx / noOfCol);
          const colIndex = inx % noOfCol;
          console.log(rowIndex, colIndex);
          return (
            <React.Fragment key={`${rowIndex}-${colIndex}`}>
              <div
                data-index={index}
                className={`row-${rowIndex}-col-${colIndex}`}
                style={{
                  height,
                  width,
                  position: "absolute",
                  //border: "1px solid black",
                  transformOrigin: "0 0",
                  transform: `translate(${colIndex * width}px, ${
                    rowIndex * height
                  }px)`,
                }}
              ></div>
              {colIndex === 0 && rowIndex !== 0 && (
                <div
                  data-row={rowIndex}
                  onMouseEnter={handleHoverBorderRow}
                  style={{
                    height: "10px",
                    width: noOfCol * width + "px",
                    background: "red",
                    position: "absolute",
                    transformOrigin: "0 0",
                    transform: `translate(0, ${rowIndex * height}px)`,
                    touchAction: "pan-x pan-y pinch-zoom",
                    //cursor: 'url(https://static.canva.com/web/images/a3609c7d7315d7301c3832d7e76e7974.png), move'
                  }}
                  className="border-row"
                ></div>
              )}
              {colIndex < noOfCol && colIndex !== 0 && (
                <div
                  data-col={colIndex}
                  style={{
                    height: noOfRow * height + "px",
                    width: "10px",
                    background: "red",
                    position: "absolute",
                    transformOrigin: "0 0",
                    transform: `translate(${colIndex * width}px, 0px)`,
                    touchAction: "pan-x pan-y pinch-zoom",
                    //cursor: 'url(https://static.canva.com/web/images/4ecfddb1ae830056cfa9144f81c83295.png), move'
                  }}
                  className="border-col"
                ></div>
              )}
            </React.Fragment>
          );
        })}
        {/* {rows.map((row, index) => (
        <div
          data-index={index}
          className={`row-${index}`}
          style={{
            height,
            width: noOfCol * width,
            position: "absolute",
            // border: "1px solid black",
            transformOrigin: "0 0",
            transform: `translate(0, ${index * height}px)`,
          }}
          data
        ></div>
      ))}
      {cols.map((col, index) => (
        <div
          data-index={index}
          className={`row-${index}`}
          style={{
            height: noOfRow * height,
            width: width,
            position: "absolute",
            // border: "1px solid black",
            transformOrigin: "0 0",
            transform: `translate(${index * width}px, 0px)`,
          }}
          data
        ></div>
      ))} */}
      </div>
    </div>
  );
}

export default App;
