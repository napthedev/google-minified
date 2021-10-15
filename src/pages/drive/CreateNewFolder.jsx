import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";

import { CreateNewFolder as CreateNewFolderIcon } from "@material-ui/icons";
import axios from "axios";
import { useState } from "react";

function CreateNewFolder({ path, permission }) {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [dialogTextField, setDialogTextField] = useState("");
  const [dialogTextFieldError, setDialogTextFieldError] = useState("");

  const createNewFolder = async (name) => {
    await axios.post("drive/create-folder", {
      name,
      path,
    });
  };

  const handleDialogFormSubmit = (e) => {
    e.preventDefault();
    if (!dialogTextField.trim()) {
      setDialogTextFieldError("Please enter folder name");
    } else {
      setDialogTextField("");
      setDialogTextFieldError("");
      createNewFolder(dialogTextField);
      setDialogOpened(false);
    }
  };

  return (
    <>
      <div className="center-div">
        <Button
          disabled={!permission}
          onClick={() => {
            setDialogOpened(true);
          }}
        >
          <CreateNewFolderIcon style={{ marginRight: 10 }} />
          <span>New Folder</span>
        </Button>
      </div>
      <Dialog open={dialogOpened} onClose={() => setDialogOpened(false)}>
        <form onSubmit={handleDialogFormSubmit}>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogContent>
            <TextField error={Boolean(dialogTextFieldError)} helperText={dialogTextFieldError} value={dialogTextField} onChange={(e) => setDialogTextField(e.target.value)} type="text" autoFocus margin="dense" label="Folder name" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setDialogOpened(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default CreateNewFolder;
