import { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import HomeGrid from "../../components/HomeGrid";

function SheetsHome() {
  useEffect(() => (document.title = "My Sheets - Google Sheets Minified"), []);

  const [allSheets, setAllSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllSheets = () => {
    axios
      .get("sheets")
      .then((res) => {
        setAllSheets(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err, err.response));
  };

  useEffect(fetchAllSheets, []);

  const deleteSheet = async (_id) => {
    let clone = [...allSheets];
    let document = clone.find((e) => e._id === _id);
    document.deleting = true;
    setAllSheets(clone);

    await axios.delete("sheets", { data: { _id } }).catch((err) => console.log(err, err.response));
    fetchAllSheets();
  };

  return (
    <>
      {!loading ? (
        <HomeGrid allData={allSheets} pushRoute="/sheets/" name="sheet" thumbnail="https://i.imgur.com/f8WI9O0.png" deleteItem={deleteSheet} createRoute="/sheets/create" />
      ) : (
        <div className="center-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default SheetsHome;
