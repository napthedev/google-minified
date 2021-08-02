function CenterContainer(props) {
  return <div style={{ ...props.style, display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1, height: "100%" }}>{props.children}</div>;
}

export default CenterContainer;
