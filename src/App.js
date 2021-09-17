import React, { useEffect } from "react";
import "./App.css";
import init from "./MoveableController";

function App() {
  useEffect(() => {
    const moveable = init();
    const inner = document.querySelector(".inner");
    const bound = inner.getBoundingClientRect();
    moveable.innerBounds = {
      left: bound.left,
      top: bound.top,
      width: bound.width,
      height: bound.height,
    };
    // const target = document.querySelector(".target");
    // const bound = target.getBoundingClientRect();
    // moveable.target = document.querySelector(".target");
    // moveable.innerBounds = {
    //   left: bound.x,
    //   top: bound.y,
    //   width: 10,
    //   height: 10,
    // };
  }, []);

  return (
    <div className="container">
      <div className="target"></div>
      <div
        className="inner"
        style={{
          width: 50,
          height: 50,
          border: "1px solid",
          top: 150,
          left: 150,
          position: "absolute",
        }}
      >
        bound
      </div>
    </div>
  );
}

export default App;
