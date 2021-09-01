import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Tooltip } from "@material-ui/core";
import { Create } from "@material-ui/icons";
import axios from "axios";

function RenameDialog({ selected }) {
  const [currentFileToRename, setCurrentFileToRename] = useState({ id: "", type: "" });

  const [dialogOpened, setDialogOpened] = useState(false);
  const [dialogTextField, setDialogTextField] = useState("");
  const [dialogTextFieldError, setDialogTextFieldError] = useState("");

  const handleRename = (name) => {
    axios
      .post("drive/rename", {
        _id: currentFileToRename.id,
        type: currentFileToRename.type,
        name,
      })
      .catch((err) => console.log(err, err.response));
  };

  const handleDialogFormSubmit = (e) => {
    e.preventDefault();
    if (!dialogTextField.trim()) {
      setDialogTextFieldError("Please enter the name");
    } else {
      setDialogTextField("");
      setDialogTextFieldError("");
      handleRename(dialogTextField);
      setDialogOpened(false);
    }
  };

  return (
    <>
      {selected.length === 1 && (
        <Tooltip
          title="Rename"
          onClick={() => {
            setCurrentFileToRename(selected[0]);
            setDialogOpened(true);
          }}
        >
          <IconButton>
            <Create />
          </IconButton>
        </Tooltip>
      )}
      <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)}>
        <form onSubmit={handleDialogFormSubmit}>
          <DialogTitle>Rename</DialogTitle>
          <DialogContent>
            <TextField error={Boolean(dialogTextFieldError)} helperText={dialogTextFieldError} value={dialogTextField} onChange={(e) => setDialogTextField(e.target.value)} type="text" autoFocus margin="dense" label="New name" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setDialogOpened(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Rename
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default RenameDialog;
