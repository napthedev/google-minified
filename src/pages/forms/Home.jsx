import { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import HomeGrid from "../../components/HomeGrid";
import Title from "../../components/Title";

function FormsHome() {
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

  return (
    <>
      <Title title="My Forms - Google Forms Minified" />
      {!loading ? (
        <HomeGrid allData={allForms} pushRoute="/forms/edit/" name="form" thumbnail="https://ik.imagekit.io/nap/google-minified/formThumbnail_fZuXg65OK2t.png" deleteItem={deleteForm} createRoute="/forms/create" />
      ) : (
        <div className="center-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default FormsHome;
