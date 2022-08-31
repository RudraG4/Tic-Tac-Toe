import { forwardRef } from "react";

const Square = forwardRef(function Square(props, ref) {
  const { stroke = "" } = props;
  const disabled = props.value ? true : false;
  const coordinates = `${props.rowId},${props.columnId}`;
  const onClickHandler = () => props.onClick();

  return (
    <button
      className={`btn square ${stroke}`}
      data-set={props.value}
      disabled={disabled}
      onClick={onClickHandler}
      ref={ref}
    >
      {props.value}
      {/* <div className="position-absolute bottom-0 end-0 coordinates">
        {`(${coordinates})`}
      </div> */}
    </button>
  );
});

export default Square;
