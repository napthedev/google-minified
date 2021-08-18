import { useState, useEffect, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Button, Card, CardActionArea, CardMedia, CardContent, Typography, Tooltip, CircularProgress, Backdrop } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { userContext } from "../../App";
import axios from "axios";

function DocsHome() {
  useEffect(() => (document.title = "My Documents - Google Docs Minified"), []);

  const { currentUser } = useContext(userContext);

  const history = useHistory();

  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backdropOpened, setBackdropOpened] = useState(false);

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

  const getThumbnail = (_id) => {
    let parsed = parseInt(_id, 36);
    let srcList = ["https://i.imgur.com/MklVMV5.png", "https://i.imgur.com/2gWPRjt.png", "https://i.imgur.com/A38RAbj.png"];
    return srcList[parsed % srcList.length];
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
    setBackdropOpened(false);
  };

  return (
    <>
      {currentUser ? (
        <>
          {!loading ? (
            <div className="home-grid">
              {allDocs?.length > 0 && (
                <>
                  {allDocs.map((e) =>
                    e.deleting ? (
                      <Button key={e._id} variant="outlined" color="default" className={allDocs.length <= 1 ? "square-button" : ""}>
                        <CircularProgress color="secondary" />
                      </Button>
                    ) : (
                      <Card className="card" key={e._id}>
                        <CardActionArea onClick={() => history.push("/docs/" + e._id)}>
                          <CardMedia draggable="false" component="img" src={getThumbnail(e._id)} />
                          <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <Typography variant="h6" component="h2">
                                {e.name ? e.name : "Untitled document"}
                              </Typography>
                            </div>
                            <Tooltip title="Delete document">
                              <Delete
                                color="secondary"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  deleteDocument(e._id);
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

              <Tooltip title="Create new document">
                <Button
                  className={allDocs.length === 0 ? "square-button" : ""}
                  style={{ fontSize: 50 }}
                  variant="outlined"
                  onClick={() => {
                    setBackdropOpened(true);
                    createDocument();
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

export default DocsHome;
