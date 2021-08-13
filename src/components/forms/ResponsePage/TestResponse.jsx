import { TextField, FormControl, FormLabel } from "@material-ui/core";

function TextResponse(props) {
  const { id, updateTextField, value, classes } = props;

  return (
    <div className={"box" + (classes ? classes : "")}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{value.title ? value.title : "Untitled question"}</FormLabel>
        <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Answer" onChange={(event) => updateTextField(id, event.target.value)} value={value.answer} inputProps={{ style: { fontSize: 20 } }} />
      </FormControl>
    </div>
  );
}

export default TextResponse;
