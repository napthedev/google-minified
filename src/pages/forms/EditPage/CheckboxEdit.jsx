import { AddCircle, Delete } from "@material-ui/icons";
import { Checkbox, TextField } from "@material-ui/core";

function CheckboxEdit(props) {
  const { id, value, updateTextField, updateOptionText, addOption, removeBox, removeOption } = props;

  return (
    <div className="box">
      <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Checkbox question" onChange={(event) => updateTextField(id, event.target.value)} value={value.title} inputProps={{ style: { fontSize: 20 } }} />
      {value.options.map((el, index) => (
        <div key={el.id} style={{ display: "flex", alignItems: "center" }}>
          <Checkbox color="primary" disabled></Checkbox>
          <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Checkbox value" onChange={(event) => updateOptionText(id, el.id, event.target.value)} value={value.options[index].name} />
          {value.options.length > 1 && <Delete onClick={() => removeOption(id, el.id)} />}
        </div>
      ))}
      <div className="more-option">
        <div className="add-option" onClick={() => addOption(id, "checkbox")}>
          <AddCircle color="primary" />
          <p>Add option</p>
        </div>
        <div className="remove-box" onClick={() => removeBox(id)}>
          <Delete color="error" />
          <p>Remove</p>
        </div>
      </div>
    </div>
  );
}

export default CheckboxEdit;
