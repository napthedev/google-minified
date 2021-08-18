import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider, CssBaseline } from "@material-ui/core";

function Document() {
  const { id } = useParams();

  const [editorValue, setEditorValue] = useState(id);

  const theme = createTheme({
    palette: {
      type: "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactQuill style={{ flexGrow: 1, display: "flex", flexDirection: "column" }} theme="snow" value={editorValue} onChange={setEditorValue} />
    </ThemeProvider>
  );
}

export default Document;
