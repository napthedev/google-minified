import { TextField, FormControl, FormLabel } from "@material-ui/core";

function DateResponse(props) {
  const { id, value, handleDateTimeChange, classes } = props;

  return (
    <div className={"box" + (classes ? classes : "")}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{value.title ? value.title : "Untitled date picker"}</FormLabel>
        <TextField type="date" id="date" onChange={(e) => handleDateTimeChange(id, e.target.value)} />
      </FormControl>
    </div>
  );
}

export default DateResponse;
