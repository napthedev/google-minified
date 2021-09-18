import { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";

function CreateForm() {
  const history = useHistory();

  const createSheet = async () => {
    await axios
      .get("sheets/create")
      .then((res) => {
        history.push("/sheets/" + res.data._id);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };

  useEffect(() => {
    createSheet();
  }, []);

  return (
    <div className="center-container">
      <CircularProgress />
    </div>
  );
}

export default CreateForm;
