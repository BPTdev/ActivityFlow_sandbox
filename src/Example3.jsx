import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";
import "./styles.css";

const arrowsPath = "smooth";

//Style for the connector
const connectPointStyle = {
  position: "absolute",
  width: 15,
  height: 15,
  background: "black",
};
//cards data
export const cardsData = [
  { id: 2, title: "Carte 2", completionLevel: 100 },
  { id: 1, color: "#4caf50", title: "Carte 1", completionLevel: 100 },
  { id: 3, title: "Carte 3.1", completionLevel: 90 },
  { id: 4, color: "#ff9800", title: "Carte 3.2", completionLevel: 80 },
  { id: 5, color: "#e51c23", title: "Carte 3.3", completionLevel: 70 },
  { id: 6, color: "#4caf50", title: "Carte 4", completionLevel: 70 },
  { id: 7, title: "Carte 5", completionLevel: 10 },
  { id: 8, color: "#50BFD5", title: "Carte 6.1", completionLevel: 25 },
  { id: 9, color: "#FFE527", title: "Carte 6.2", completionLevel: 0 },
  { id: 10, color: "#e51c23", title: "Carte de fin", completionLevel: 0 },
];
//Position of the connector
const connectPointOffset = {
  left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
  right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
  bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
  topRight: { right: 0, top: 0 },
};

//TODO: Change that function

const ConnectPointsWrapper = ({ boxId, handler, dragRef, boxRef }) => {
  const ref1 = useRef();

  const [position, setPosition] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);
  return (
    <React.Fragment>
      <div
        className="connectPoint"
        style={{
          ...connectPointStyle,
          ...connectPointOffset[handler],
          ...position,
        }}
        draggable
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={(e) => {
          setBeingDragged(true);
          e.dataTransfer.setData("arrow", boxId);
        }}
        onDrag={(e) => {
          const { offsetTop, offsetLeft } = boxRef.current;
          const { x, y } = dragRef.current.state;
          setPosition({
            position: "fixed",
            left: e.clientX - x - offsetLeft,
            top: e.clientY - y - offsetTop,
            transform: "none",
            opacity: 0,
          });
        }}
        ref={ref1}
        onDragEnd={(e) => {
          setPosition({});
          setBeingDragged(false);
        }}
      />
      {beingDragged ? (
        <Xarrow path="straight" start={boxId} end={ref1} />
      ) : null}
    </React.Fragment>
  );
};

const boxStyle = {
  border: "1px solid black",
  position: "relative",
  padding: "20px 10px",
};

const Box = ({ text, handler, addArrow, setArrows, boxId }) => {
  const dragRef = useRef();
  const boxRef = useRef();
  return (
    <Draggable
      ref={dragRef}
      onDrag={(e) => {
        // console.log(e);
        setArrows((arrows) => [...arrows]);
      }}
    >
      <div
        id={boxId}
        ref={boxRef}
        style={boxStyle}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          if (e.dataTransfer.getData("arrow") === boxId) {
            console.log(e.dataTransfer.getData("arrow"), boxId);
            boxId = 0;
          } else {
            const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
            addArrow(refs);
            console.log("droped!", refs);
          }
        }}
      >
        {text}
        <ConnectPointsWrapper {...{ boxId, handler, dragRef, boxRef }} />
      </div>
    </Draggable>
  );
};


export default function App() {
  const [arrows, setArrows] = useState([]);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };
  const removeArrow = ({ start, end }) => {
    const deleteArrowArray = arrows;
    const deleteArrow = deleteArrowArray.filter(
      (items) => items.start === start && items.end === end
    );

    console.log(deleteArrow);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      {/* map the data */}
      {cardsData.map((id) => (
        <Box
          text={id.title}
          {...{ addArrow, setArrows, handler: "topRight" }}
          boxId={"" + id.id}
        />
      ))}
      
      {arrows.map((ar) => (
        <Xarrow
          className="arrow"
          path={arrowsPath}
          start={ar.start}
          end={ar.end}
          key={ar.start + "." + ar.end}
          labels={""}
        />
      ))}
      {<button onclick={removeArrow(2, 1)}>sdfsdf</button>}
    </div>
  );
}
