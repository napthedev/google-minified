import { TextField, Radio } from "@material-ui/core";
import { Delete, AddCircle } from "@material-ui/icons";

function RadioEdit(props) {
  const { id, value, updateTextField, updateOptionText, addOption, removeBox, removeOption } = props;

  return (
    <div className="box">
      <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Radio question" onChange={(event) => updateTextField(id, event.target.value)} value={value.title} inputProps={{ style: { fontSize: 20 } }} />
      {value.options.map((el, index) => (
        <div key={el.id} style={{ display: "flex", alignItems: "center" }}>
          <Radio color="primary" disabled></Radio>
          <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Radio value" onChange={(event) => updateOptionText(id, el.id, event.target.value)} value={value.options[index].name} />
          {value.options.length > 1 && <Delete onClick={() => removeOption(id, el.id)} />}
        </div>
      ))}
      <div className="more-option">
        <div className="add-option" onClick={() => addOption(id, "radio")}>
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

export default RadioEdit;
