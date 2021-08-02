import { TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
function TimeEdit(props) {
  const { id, value, updateTextField, removeBox } = props;

  return (
    <div className="box">
      <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Date picker question" onChange={(event) => updateTextField(id, event.target.value)} value={value.title} inputProps={{ style: { fontSize: 20 } }} />
      <TextField id="time" type="time" disabled InputLabelProps={{ shrink: true }} />
      <div className="more-option" style={{ flexDirection: "row-reverse" }}>
        <div className="remove-box" onClick={() => removeBox(id)}>
          <Delete color="error" />
          <p>Remove</p>
        </div>
      </div>
    </div>
  );
}

export default TimeEdit;
