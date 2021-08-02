import { useState, useEffect, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Button, Card, CardActionArea, CardMedia, CardContent, CardActions, Typography, Tooltip, IconButton, CircularProgress } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { userContext } from "../../App";
import axios from "axios";

function FormsHome() {
  const { currentUser } = useContext(userContext);

  const history = useHistory();

  const [allForms, setAllForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllForms = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "forms")
      .then((res) => {
        setAllForms(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err, err.response));
  };

  useEffect(fetchAllForms, []);

  const deleteForm = async (formId) => {
    await axios.delete(process.env.REACT_APP_SERVER_URL + "forms", { data: { formId } }).catch((err) => console.log(err, err.response));
    fetchAllForms();
  };

  return (
    <>
      {currentUser ? (
        <>
          {!loading ? (
            <div className="container">
              {allForms?.length > 0 && (
                <>
                  {allForms.map((e) => (
                    <Card className="card" key={e.formId}>
                      <CardActionArea onClick={() => history.push("/forms/edit/" + e.formId)}>
                        <CardMedia component="img" src="https://i.imgur.com/MklVMV5.png" />
                        <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <Typography gutterBottom variant="h6" component="h2">
                              {e.title ? e.title : "Untitled form"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                              {e.description ? e.description : "No description"}
                            </Typography>
                          </div>
                          <Tooltip title="Delete form">
                            <Delete
                              className="delete-form-button"
                              color="secondary"
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteForm(e.formId);
                              }}
                            />
                          </Tooltip>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                </>
              )}
              <Tooltip title="Create new form" className="create-form-button" style={{ aspectRatio: allForms.length === 0 ? "1 / 1" : "" }}>
                <Button variant="outlined" onClick={() => history.push("/forms/create")}>
                  +
                </Button>
              </Tooltip>
            </div>
          ) : (
            <div className="center-container">
              <CircularProgress />
            </div>
          )}
        </>
      ) : (
        <Redirect to="/signup" />
      )}
    </>
  );
}

export default FormsHome;
