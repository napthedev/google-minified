import { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";

function CreateForm() {
  const history = useHistory();

  const createDocument = async () => {
    await axios
      .get("docs/create")
      .then((res) => {
        history.push("/docs/" + res.data._id);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
  };

  useEffect(() => {
    createDocument();
  }, []);

  return (
    <div className="center-container">
      <CircularProgress />
    </div>
  );
}

export default CreateForm;
