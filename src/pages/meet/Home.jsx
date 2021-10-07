import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import { userContext } from "../../App";

function Home() {
  const { currentUser } = useContext(userContext);
  const history = useHistory();
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="center-container" style={{ flexDirection: "column" }}>
      <div>
        <img src="https://cdn.iconscout.com/icon/free/png-256/google-meet-2923654-2416657.png" alt="" />
      </div>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", alignItems: "flex-end", gap: 20 }}>
        <Link to={`/meet/${currentUser.id}`}>
          <Button color="primary" variant="contained">
            New Meeting
          </Button>
        </Link>
        <p style={{ margin: "5px 0" }}>OR</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!inputValue.trim()) return;
            history.push(`/meet/${inputValue}`);
          }}
          style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
        >
          <TextField value={inputValue} onChange={(e) => setInputValue(e.target.value)} variant="standard" label="Room ID" />
          <Button variant="contained" color="primary">
            Join
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Home;
