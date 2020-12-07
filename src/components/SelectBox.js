const SelectBox = (props) => {
  return (
    <div>
      <label htmlFor="standard-select">{props.label}</label>
      <div>
        <select value={props.value} onChange={props.onChange}>
          <option disabled value="">
            {props.info}
          </option>
          {[...Array(props.maxValue - props.minValue + 1).keys()].map(
            (value, index) => {
              return props.label !== "Goal" ? (
                <option key={index} value={props.minValue + value}>
                  {props.minValue + value}
                </option>
              ) : (
                <option key={index} value={Math.pow(2, props.minValue + value)}>
                  {Math.pow(2, props.minValue + value)}
                </option>
              );
            }
          )}
        </select>
      </div>
    </div>
  );
};

export default SelectBox;
