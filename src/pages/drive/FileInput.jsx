import { Button } from "@material-ui/core";
import { useRef } from "react";

function FileInput({ className, onChange, multiple = false, disabled = false, label }) {
  const fileInput = useRef();

  return (
    <>
      <input type="file" multiple={multiple} disabled={disabled} hidden onChange={onChange} ref={fileInput} />
      <div className={className}>
        <Button onClick={() => fileInput.current.click()}>{label}</Button>
      </div>
    </>
  );
}

export default FileInput;
