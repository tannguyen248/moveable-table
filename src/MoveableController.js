import Moveable from "moveable";

const convertPxToFloat = (px) => {
  if (typeof px !== 'string') {
    return px
  }
  return parseFloat(px.replace("px", "" ))
}

const init = () => {
  const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: document.querySelector(".target"),
    snappable: true,
    draggable: true,
    throttleDrag: 0,
    startDragRotate: 0,
    throttleDragRotate: 0,
    zoom: 1,
    origin: true,
    padding: { left: 0, top: 0, right: 0, bottom: 0 },

    resizable: true,
    keepRatio: true,
    throttleResize: 0,

    rotatable: true,
    throttleRotate: 0,
    rotationPosition: "top",
  });

  let frame = {
    translate: [0, 0],
    rotate: 0,
    clipStyle: "inset",
  };

  moveable
    .on("dragStart", (e) => {
      e.set(frame.translate);
    })
    .on("drag", (e) => {
      console.log("top: ", e.top, "left: ", e.left);
      console.log(e.clientX, e.clientY);

      const rowIndex = e.target.dataset["row"];
      frame.translate = e.beforeTranslate;
      e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
      console.log("delta", e.delta)
      
      const table = document.getElementById("table")
      if (table) {
        const rowBeforeDivs = table.querySelectorAll(`div[data-row="${rowIndex - 1}"]`)
        const rowDivs = table.querySelectorAll(`div[data-row="${rowIndex}"]`)

        rowBeforeDivs.forEach(div => {
          div.style.height = `${convertPxToFloat(div.style.height) + e.delta[1]}px`
        })

        rowDivs.forEach(div => {
          div.style.height = `${convertPxToFloat(div.style.height) - e.delta[1]}px`
        })
      }

    })
    .on("clip", (e) => {
      if (e.clipType === "rect") {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      frame.clipStyle = e.clipStyle;
    })
    .on("resizeStart", (e) => {
      e.setOrigin(["%", "%"]);
      e.dragStart && e.dragStart.set(frame.translate);
    })
    .on("resize", (e) => {
      const beforeTranslate = e.drag.beforeTranslate;

      frame.translate = beforeTranslate;
      e.target.style.width = `${e.width}px`;
      e.target.style.height = `${e.height}px`;
      e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    })
    .on("rotateStart", (e) => {
      e.set(frame.rotate);
      e.dragStart && e.dragStart.set(frame.translate);
    })
    .on("rotate", (e) => {
      frame.rotate = e.beforeRotate;
      e.target.style.transform = `rotate(${e.beforeRotate}deg)`;
    });

  return moveable;
};

export default init;
