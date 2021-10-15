import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";

function RadioResponse(props) {
  const { id, value, handleRadioChange, classes } = props;

  return (
    <div className={"box" + (classes ? classes : "")}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{value.title ? value.title : "Untitled radio"}</FormLabel>
        <RadioGroup value={value.options.current} onChange={(e) => handleRadioChange(id, e.target.value)}>
          {value.options.map((el, index) => (
            <FormControlLabel key={el.id} value={el.id} control={<Radio color="primary" />} label={el.name} />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default RadioResponse;
