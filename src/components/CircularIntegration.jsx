import { Button, CircularProgress } from "@material-ui/core";

function CircularIntegration(props) {
  const { text, loading, onClick } = props;

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div style={{ position: "relative", width: "100%" }}>
        <Button onClick={onClick} type="submit" style={{ width: "100%" }} variant="contained" color="primary" disabled={loading}>
          {text}
        </Button>
        {loading && <CircularProgress size={24} style={{ position: "absolute", top: "50%", left: "50%", marginTop: -12, marginLeft: -12 }} />}
      </div>
    </div>
  );
}

export default CircularIntegration;
