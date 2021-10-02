import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { userContext } from "../../App";

function Home() {
  const { currentUser } = useContext(userContext);

  return (
    <div>
      <Link to={`/meet/${currentUser.id}`}>
        <Button color="primary" variant="contained">
          Create room
        </Button>
      </Link>
    </div>
  );
}

export default Home;
