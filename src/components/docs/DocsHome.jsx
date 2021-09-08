import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import HomeGrid from "../HomeGrid";

function DocsHome() {
  useEffect(() => (document.title = "My Documents - Google Docs Minified"), []);

  const history = useHistory();

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

  return (
    <>
      {!loading ? (
        <HomeGrid allData={allDocs} pushRoute="/docs/" name="document" thumbnail="https://i.imgur.com/2gWPRjt.png" deleteItem={deleteDocument} createItem={createDocument} />
      ) : (
        <div className="center-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default DocsHome;
