import { cloneElement, useState } from "react";

import { Snackbar } from "@material-ui/core";
import { copyToClipboard } from "../shared/utils";

function ClipboardSnackbar({ content, message, vertical = "bottom", horizontal = "right", children, duration = 3000 }) {
  const [snackbarOpened, setSnackbarOpened] = useState(false);

  const handleCopy = () => {
    copyToClipboard(content).then(() => setSnackbarOpened(true));
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: vertical,
          horizontal: horizontal,
        }}
        open={snackbarOpened}
        autoHideDuration={duration}
        onClose={() => setSnackbarOpened(false)}
        message={message}
      />
      {cloneElement(children, { onClick: handleCopy })}
    </>
  );
}

export default ClipboardSnackbar;
