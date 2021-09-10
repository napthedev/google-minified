import { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";

function CreateForm() {
  const history = useHistory();

  const createForm = async () => {
    await axios
      .get("forms/create")
      .then((res) => {
        history.push("/forms/edit/" + res.data._id);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };

  useEffect(() => {
    createForm();
  }, []);

  return (
    <div className="center-container">
      <CircularProgress />
    </div>
  );
}

export default CreateForm;
