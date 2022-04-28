import { Button, TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

import { useState } from "react";
import { useStore } from "../../shared/store";

function Home() {
  const currentUser = useStore((state) => state.currentUser);
  const history = useHistory();
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="center-container" style={{ flexDirection: "column" }}>
      <div>
        <img
          src="https://ik.imagekit.io/nap/google-minified/meet-big_g9JIMN6DJgA.webp"
          alt=""
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: 20,
        }}
      >
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
          <TextField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            variant="standard"
            label="Room ID"
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Home;
