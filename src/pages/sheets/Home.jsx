import { useEffect, useState } from "react";

import { CircularProgress } from "@material-ui/core";
import HomeGrid from "../../components/HomeGrid";
import Title from "../../components/Title";
import axios from "axios";

function SheetsHome() {
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
      <Title title="My Sheets - Google Sheets Minified" />
      {!loading ? (
        <HomeGrid allData={allSheets} pushRoute="/sheets/" name="sheet" thumbnail="https://ik.imagekit.io/nap/google-minified/sheetsThumbnail_Paqk0hhry.png" deleteItem={deleteSheet} createRoute="/sheets/create" />
      ) : (
        <div className="center-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default SheetsHome;
