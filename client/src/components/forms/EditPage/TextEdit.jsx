import { TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

function TextEdit(props) {
  const { id, updateTextField, removeBox, value } = props;

  return (
    <div className="box">
      <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Question" onChange={(event) => updateTextField(id, event.target.value)} value={value.title} inputProps={{ style: { fontSize: 20 } }} />
      <TextField fullWidth disabled defaultValue="Answer" />
      <div className="more-option" style={{ flexDirection: "row-reverse" }}>
        <div className="remove-box" onClick={() => removeBox(id)}>
          <Delete color="error" />
          <p>Remove</p>
        </div>
      </div>
    </div>
  );
}

export default TextEdit;
