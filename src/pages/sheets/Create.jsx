import { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";

function CreateForm() {
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await axios
        .get("sheets/create")
        .then((res) => {
          history.push("/sheets/" + res.data._id);
        })
        .catch((err) => {
          console.log(err, err.response);
        });
    })();
  }, [history]);

  return (
    <div className="center-container">
      <CircularProgress />
    </div>
  );
}

export default CreateForm;
