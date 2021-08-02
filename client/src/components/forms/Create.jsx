import { Redirect, useHistory } from "react-router-dom";
import { useEffect, useContext } from "react";
import { userContext } from "../../App";
import axios from "axios";

function Create() {
  const { currentUser } = useContext(userContext);

  const history = useHistory();

  const createForm = () => {
    if (!currentUser) return;
    axios
      .get(process.env.REACT_APP_SERVER_URL + "forms/create")
      .then((res) => {
        history.push("/forms/edit/" + res.data.formId);
      })
      .catch((err) => {
        console.log(err, err.response);
        alert("Error creating form");
      });
  };

  useEffect(createForm, []);

  return <>{currentUser ? "" : <Redirect to="/signup" />}</>;
}

export default Create;
