import { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import HomeGrid from "../../components/HomeGrid";
import Title from "../../components/Title";

function DocsHome() {
  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllDocuments = () => {
    axios
      .get("docs")
      .then((res) => {
        setAllDocs(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err, err.response));
  };

  useEffect(fetchAllDocuments, []);

  const deleteDocument = async (_id) => {
    let clone = [...allDocs];
    let document = clone.find((e) => e._id === _id);
    document.deleting = true;
    setAllDocs(clone);

    await axios.delete("docs", { data: { _id } }).catch((err) => console.log(err, err.response));
    fetchAllDocuments();
  };

  return (
    <>
      <Title title="My Documents - Google Docs Minified" />
      {!loading ? (
        <HomeGrid allData={allDocs} pushRoute="/docs/" name="document" thumbnail="https://ik.imagekit.io/nap/google-minified/docsThumbnail_OnDoMkkHm.png" deleteItem={deleteDocument} createRoute="/docs/create" />
      ) : (
        <div className="center-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default DocsHome;
