import { useState, useEffect, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Button, Card, CardActionArea, CardMedia, CardContent, Typography, Tooltip, CircularProgress, Backdrop } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { userContext } from "../../App";
import axios from "axios";

function FormsHome() {
  useEffect(() => (document.title = "My Forms - Google Forms Minified"), []);

  const { currentUser } = useContext(userContext);

  const history = useHistory();

  const [allForms, setAllForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backdropOpened, setBackdropOpened] = useState(false);

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

  const deleteForm = async (formId) => {
    let clone = [...allForms];
    let form = clone.find((e) => e.formId === formId);
    form.deleting = true;
    setAllForms(clone);

    await axios.delete("forms", { data: { formId } }).catch((err) => console.log(err, err.response));
    fetchAllForms();
  };

  const getThumbnail = (formId) => {
    let parsed = parseInt(formId, 36);
    let srcList = ["https://i.imgur.com/MklVMV5.png", "https://i.imgur.com/2gWPRjt.png", "https://i.imgur.com/A38RAbj.png"];
    return srcList[parsed % srcList.length];
  };

  const createForm = async () => {
    await axios
      .get("forms/create")
      .then((res) => {
        history.push("/forms/edit/" + res.data.formId);
      })
      .catch((err) => {
        console.log(err, err.response);
      });
    setBackdropOpened(false);
  };

  return (
    <>
      {currentUser ? (
        <>
          {!loading ? (
            <div className="forms-grid">
              {allForms?.length > 0 && (
                <>
                  {allForms.map((e) =>
                    e.deleting ? (
                      <Button key={e.formId} variant="outlined" color="default" className={allForms.length <= 1 ? "square-button" : ""}>
                        <CircularProgress color="secondary" />
                      </Button>
                    ) : (
                      <Card className="card" key={e.formId}>
                        <CardActionArea onClick={() => history.push("/forms/edit/" + e.formId)}>
                          <CardMedia draggable="false" component="img" src={getThumbnail(e.formId)} />
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
                    )
                  )}
                </>
              )}

              <Tooltip title="Create new form">
                <Button
                  className={allForms.length === 0 ? "square-button" : ""}
                  style={{ fontSize: 50 }}
                  variant="outlined"
                  onClick={() => {
                    setBackdropOpened(true);
                    createForm();
                  }}
                >
                  +
                </Button>
              </Tooltip>
              <Backdrop style={{ zIndex: 1000 }} open={backdropOpened}>
                <CircularProgress color="primary" />
              </Backdrop>
            </div>
          ) : (
            <div className="center-container">
              <CircularProgress />
            </div>
          )}
        </>
      ) : (
        <Redirect to={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`} />
      )}
    </>
  );
}

export default FormsHome;
