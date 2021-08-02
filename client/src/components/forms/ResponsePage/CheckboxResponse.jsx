import { Checkbox, FormControlLabel, FormControl, FormLabel } from "@material-ui/core";

function CheckboxResponse(props) {
  const { id, value, handleCheckboxChange, classes } = props;

  return (
    <div className={"box" + (classes ? classes : "")}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{value.title ? value.title : "Untitled checkbox"}</FormLabel>
        {value.options.map((el, index) => (
          <div key={el.id}>
            <FormControlLabel control={<Checkbox checked={el.checked} onChange={() => handleCheckboxChange(id, el.id)} color="primary" />} label={el.name ? el.name : "Untitled checkbox " + (index + 1)} />
          </div>
        ))}
      </FormControl>
    </div>
  );
}

export default CheckboxResponse;
