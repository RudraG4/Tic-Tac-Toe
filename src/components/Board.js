import Square from "./Square";

export default function Board(props) {
  function renderSquare(_props) {
    const { id, rowId, columnId } = _props;
    _props.ref = props.refs[rowId][columnId];
    if (props.data.stroke.includes(id)) {
      _props.stroke = "stroke";
    }
    _props.onClick = () => props.onClick(id);

    return <Square key={id} {..._props} />;
  }

  return (
    <div className="board">
      {props.data.squares.map((row, rowId) => {
        return (
          <div key={rowId} className="board-row">
            {row.map((value, columnId) => {
              const id = `${rowId}-${columnId}`;
              const squareProps = { id, value, rowId, columnId };
              return renderSquare(squareProps);
            })}
          </div>
        );
      })}
    </div>
  );
}
