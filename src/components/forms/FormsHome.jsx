import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import HomeGrid from "../HomeGrid";

function FormsHome() {
  useEffect(() => (document.title = "My Forms - Google Forms Minified"), []);

  const history = useHistory();

  const [allForms, setAllForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllForms = () => {
    axios
      .get("forms")
      .then((res) => {
        setAllForms(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err, err.response));
  };

  useEffect(fetchAllForms, []);

  const deleteForm = async (_id) => {
    let clone = [...allForms];
    let form = clone.find((e) => e._id === _id);
    form.deleting = true;
    setAllForms(clone);

    await axios.delete("forms", { data: { _id } }).catch((err) => console.log(err, err.response));
    fetchAllForms();
  };

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

  return (
    <>
      {!loading ? (
        <HomeGrid allData={allForms} pushRoute="/forms/edit/" name="form" thumbnail="https://i.imgur.com/2gWPRjt.png" deleteItem={deleteForm} createItem={createForm} />
      ) : (
        <div className="center-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default FormsHome;
