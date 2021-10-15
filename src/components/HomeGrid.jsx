import { Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Tooltip, Typography } from "@material-ui/core";

import { Delete } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

function HomeGrid(props) {
  const { allData, pushRoute, name, thumbnail, deleteItem, createRoute } = props;
  const history = useHistory();

  return (
    <div className="home-grid">
      {allData?.length > 0 && (
        <>
          {allData?.map((e) =>
            e.deleting ? (
              <Button key={e._id} variant="outlined" color="default" className={allData.length <= 1 ? "square" : ""}>
                <CircularProgress color="secondary" />
              </Button>
            ) : (
              <Card className="card" key={e._id}>
                <CardActionArea onClick={() => history.push(pushRoute + e._id)}>
                  <CardMedia draggable="false" component="img" src={thumbnail} />
                  <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <Typography variant="h6" component="h2">
                        {e.name ? e.name : `Untitled ${name}`}
                      </Typography>
                    </div>
                    <Tooltip title={`Delete ${name}`}>
                      <Delete
                        color="secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteItem(e._id);
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

      <Tooltip title={`Create new ${name}`}>
        <Button
          className={allData.length === 0 ? "square" : ""}
          style={{ fontSize: 50 }}
          variant="outlined"
          onClick={() => {
            history.push(createRoute);
          }}
        >
          +
        </Button>
      </Tooltip>
    </div>
  );
}

export default HomeGrid;
