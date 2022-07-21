import Moveable from "moveable";

// private
const convertPxToFloat = (stringPx) => {
  if (!stringPx) {
    return stringPx
  }

  const temp = stringPx + ''
  return temp ? parseFloat(temp.replace('px', '')) : stringPx
}

const getTransform = (props) => {
  let result = ''
  if (Array.isArray(props.translate) && props.translate.length >= 2) {
    result += `translate(${props.translate[0]}px, ${props.translate[1]}px)`
  }
  if (props.rotate) {
    result += ` rotate(${props.rotate}deg)`
  }
  if (Array.isArray(props.scale) && props.scale.length === 2) {
    result += ` scale(${props.scale[0]}, ${props.scale[1]})`
  }
  return result.trim()
}


const getComputedScaleXY = (el) => {
  if (!window.getComputedStyle || !el) {
    return null
  }

  const style = getComputedStyle(el)
  const transform =
    style.transform || style.webkitTransform || style.mozTransform

  let mat = transform.match(/^matrix3d\((.+)\)$/)

  if (mat) {
    return parseFloat(mat[1].split(', ')[13])
  }

  mat = transform.match(/^matrix\((.+)\)$/)

  let angle = 0
  // rotate, scale
  let values = transform.split('(')[1] || ''
  values = values.split(')')[0] || ''
  values = values.split(',')

  if (values) {
    const a = values[0]
    const b = values[1]

    angle = Math.atan2(b, a) * (180 / Math.PI)
  }

  const data = {}

  data.scale = mat ? parseFloat(mat[1].split(', ')[3]) : 0

  data.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0
  data.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0

  data.xPercent = data.x === 0 ? 0 : data.x / (el.offsetWidth / 100)
  data.yPercent = data.y === 0 ? 0 : data.y / (el.offsetHeight / 100)
  data.width = convertPxToFloat(style.width)
  data.height = convertPxToFloat(style.height)
  data.rotate = angle

  return data
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
      //console.log("top: ", e.top, "left: ", e.left);
      //console.log(e.clientX, e.clientY);
      const subDraggableItem = document.getElementById("subDraggableItem");
      const delta = e.delta;

      if (subDraggableItem) {
        const spec = getComputedScaleXY(subDraggableItem)
        const transform = getTransform({ translate: [spec.x + delta[0], spec.y + delta[1]], rotate: spec.rotate, scale: [1, 1] })
        subDraggableItem.style.transform = transform
        console.log({ transform, spec, delta });
      }


      frame.translate = e.beforeTranslate;
      e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
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
