import { FormControl, FormLabel, TextField } from "@material-ui/core";

function TimeResponse(props) {
  const { id, value, handleDateTimeChange, classes } = props;

  return (
    <div className={"box" + (classes ? classes : "")}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{value.title ? value.title : "Untitled time picker"}</FormLabel>
        <TextField type="time" id="time" onChange={(e) => handleDateTimeChange(id, e.target.value)} />
      </FormControl>
    </div>
  );
}

export default TimeResponse;
