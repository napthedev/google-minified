import { Redirect } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import { io } from "socket.io-client";

import { userContext } from "../../App";

import { Container, TextField, Tab, Tabs, Accordion, AccordionSummary, Typography, AccordionDetails, Badge, Checkbox, FormControlLabel, ListItem, List, Radio, RadioGroup, Tooltip, CircularProgress, Snackbar, IconButton } from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import { CheckBox, RadioButtonChecked, Description, DateRange, Timer, ExpandMore, AllInbox, InsertLink, Close, Edit as EditIcon } from "@material-ui/icons";

import { useParams } from "react-router-dom";

import TextEdit from "./EditPage/TextEdit";
import CheckboxEdit from "./EditPage/CheckboxEdit";
import RadioEdit from "./EditPage/RadioEdit";
import DateEdit from "./EditPage/DateEdit";
import TimeEdit from "./EditPage/TimeEdit";
import Forbidden from "../Forbidden";
import NotFound from "../NotFound";

import { calculateCreatedTime, copyToClipboard } from "../Functions";

function Edit() {
  const { currentUser } = useContext(userContext);

  const [view, setView] = useState("");

  const { id: _id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);

  const [allSubmits, setAllSubmits] = useState([]);

  const [loading, setLoading] = useState(true);

  const [socket, setSocket] = useState();

  useEffect(() => (document.title = title + (title ? " - " : "") + "Editing - Google Forms Minified"), [title]);

  useEffect(() => {
    socket?.disconnect();
    let mySocket = io((process.env.REACT_APP_SERVER_URL || "http://localhost:5000/") + "submits");
    mySocket.emit("join-room", _id);
    mySocket.on("new-data", (data) => {
      console.log("new-data");
      getSubmits();
    });

    setSocket(mySocket);
  }, []);

  const getPreviousFormData = () => {
    axios
      .post("forms/form", { _id })
      .then((res) => {
        setTitle(res.data.form.title);
        setDescription(res.data.form.description);
        setData(JSON.parse(res.data.form.content));
        setView(200);
        setLoading(false);
        formDidUpdate.current = true;
      })
      .catch((err) => {
        console.log(err, err.response);
        setView(err.response.status);
        setLoading(false);
      });
  };

  const getSubmits = () => {
    axios.post("submits/get", { id: _id }).then((res) => setAllSubmits(res.data.reverse()));
  };

  const formTimeout = useRef(null);
  const formDidUpdate = useRef(false);

  useEffect(() => {
    if (!formDidUpdate.current) {
      getPreviousFormData();
    } else {
      if (formTimeout.current) {
        clearTimeout(formTimeout.current);
      }

      formTimeout.current = setTimeout(() => {
        postFormData(title, description, data);
      }, 500);
    }
  }, [data, title, description]);

  const postFormData = async (title, description, data) => {
    await axios
      .post("forms/update", {
        _id,
        title,
        description,
        content: JSON.stringify(data),
      })
      .catch((err) => console.log(err, err.message));
  };

  const updateTextField = (id, value) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    item.value.title = value;
    setData(clone);
  };

  const updateOptionText = (id, childId, value) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    let child = item.value.options.find((e) => e.id === childId);
    child.name = value;
    setData(clone);
  };

  const removeOption = (id, childId) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    let child = item.value.options.filter((e) => e.id !== childId);
    item.value.options = child;
    setData(clone);
  };

  const addOption = (id, type) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    if (type === "checkbox") item.value.options.push({ id: nanoid(), name: "Checkbox " + (item.value.options.length + 1), checked: false });
    else if (type === "radio") item.value.options.push({ id: nanoid(), name: "Radio " + (item.value.options.length + 1) });

    setData(clone);
  };

  const removeBox = (id) => {
    let clone = [...data];
    setData(clone.filter((e) => e.id !== id));
  };

  const addBox = (type) => {
    let clone = [...data];
    if (type === "text") {
      clone.push({ id: nanoid(), type: "text", value: { title: "Untitled question", answer: "" } });
    } else if (type === "checkbox") {
      clone.push({
        id: nanoid(),
        type: "checkbox",
        value: {
          title: "Untitled checkbox",
          options: [
            { id: nanoid(), name: "Checkbox 1", checked: false },
            { id: nanoid(), name: "Checkbox 2", checked: false },
          ],
        },
      });
    } else if (type === "radio") {
      clone.push({
        id: nanoid(),
        type: "radio",
        value: {
          title: "Untitled radio",
          current: "",
          options: [
            {
              id: nanoid(),
              name: "Radio 1",
            },
            {
              id: nanoid(),
              name: "Radio 2",
            },
          ],
        },
      });
    } else if (type === "date") {
      clone.push({ id: nanoid(), type: "date", value: { title: "Untitled date", answer: "" } });
    } else if (type === "time") {
      clone.push({ id: nanoid(), type: "time", value: { title: "Untitled time", answer: "" } });
    }

    setData(clone);
    setOpen(false);
  };

  const [tabValue, setTabValue] = useState(0);

  useEffect(getSubmits, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const copyResponseUrl = (url) => {
    copyToClipboard(url).then(() => {
      setSnackbarOpened(true);
    });
  };

  const [snackbarOpened, setSnackbarOpened] = useState(false);

  return (
    <>
      {currentUser ? (
        <>
          {!loading ? (
            <>
              {view === 404 ? (
                <NotFound />
              ) : view === 403 ? (
                <Forbidden />
              ) : view === 200 ? (
                <>
                  <Tabs centered value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                    <Tab
                      label={
                        <div style={{ display: "flex", gap: 10 }}>
                          <EditIcon />
                          Edit
                        </div>
                      }
                    />
                    <Tab
                      label={
                        <Badge style={{ display: "flex", gap: 10 }} badgeContent={allSubmits.length} color="primary" showZero max={99}>
                          <AllInbox />
                          submits
                        </Badge>
                      }
                    ></Tab>
                  </Tabs>
                  {tabValue === 0 ? (
                    <div className="edit-page" style={{ display: "flex", flexDirection: "column" }}>
                      <Container style={{ maxWidth: 700, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <div className="edit-form-container" style={{ flexGrow: 1 }}>
                          <div className="box" style={{ borderTop: "8px solid #673ab7" }}>
                            <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Form name" onChange={(e) => setTitle(e.target.value)} value={title} inputProps={{ style: { fontSize: 35 } }} />
                            <TextField onFocus={(e) => e.target.select()} fullWidth placeholder="Form description" onChange={(e) => setDescription(e.target.value)} value={description} />
                          </div>

                          {data.map((e) => {
                            if (e.type === "text") {
                              return <TextEdit key={e.id} id={e.id} updateTextField={updateTextField} removeBox={removeBox} value={e.value} />;
                            } else if (e.type === "checkbox") {
                              return <CheckboxEdit key={e.id} id={e.id} value={e.value} updateTextField={updateTextField} updateOptionText={updateOptionText} addOption={addOption} removeBox={removeBox} removeOption={removeOption} />;
                            } else if (e.type === "radio") {
                              return <RadioEdit key={e.id} id={e.id} value={e.value} updateTextField={updateTextField} updateOptionText={updateOptionText} addOption={addOption} removeBox={removeBox} removeOption={removeOption} />;
                            } else if (e.type === "date") {
                              return <DateEdit key={e.id} id={e.id} value={e.value} updateTextField={updateTextField} removeBox={removeBox} />;
                            } else if (e.type === "time") {
                              return <TimeEdit key={e.id} id={e.id} value={e.value} updateTextField={updateTextField} removeBox={removeBox} />;
                            }
                          })}
                          <SpeedDial className="add-box-button" ariaLabel="Add box" icon={<SpeedDialIcon />} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
                            <SpeedDialAction icon={<Description />} tooltipTitle="Text input" onClick={() => addBox("text")} />
                            <SpeedDialAction icon={<CheckBox />} tooltipTitle="Checkbox" onClick={() => addBox("checkbox")} />
                            <SpeedDialAction icon={<RadioButtonChecked />} tooltipTitle="Radio button" onClick={() => addBox("radio")} />
                            <SpeedDialAction icon={<DateRange />} tooltipTitle="Date picker" onClick={() => addBox("date")} />
                            <SpeedDialAction icon={<Timer />} tooltipTitle="Time picker" onClick={() => addBox("time")} />
                          </SpeedDial>
                          <Tooltip title="Copy response url">
                            <SpeedDial open={false} onClick={() => copyResponseUrl(window.location.href.replace("edit", "response"))} className="copy-link-button" ariaLabel="Copy response link" icon={<InsertLink />}></SpeedDial>
                          </Tooltip>
                        </div>
                      </Container>
                      <Snackbar anchorOrigin={{ horizontal: "left", vertical: "top" }} open={snackbarOpened} autoHideDuration={2000} onClose={() => setSnackbarOpened(false)} message="Response URL copied!" />
                    </div>
                  ) : (
                    <div className="edit-page">
                      <Container style={{ maxWidth: 700, paddingTop: 20 }}>
                        {allSubmits.map((e, index) => (
                          <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Typography>
                                Submit {allSubmits.length - index} ({calculateCreatedTime(new Date(e.time))})
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List style={{ width: "100%" }}>
                                {JSON.parse(e.content).map((el, childIndex) => {
                                  if (el.type === "text" || el.type === "date" || el.type === "time") {
                                    return (
                                      <ListItem key={el.id} divider={childIndex + 1 < JSON.parse(e.content).length ? true : false}>
                                        <div>
                                          <Typography variant="subtitle1">
                                            {childIndex + 1}
                                            {". "}
                                            {el.value.title}
                                          </Typography>
                                          <Typography variant="h6">{el.value.answer}</Typography>
                                        </div>
                                      </ListItem>
                                    );
                                  } else if (el.type === "checkbox") {
                                    return (
                                      <ListItem key={el.id} divider={childIndex + 1 < JSON.parse(e.content).length ? true : false}>
                                        <div>
                                          <Typography variant="subtitle1">
                                            {childIndex + 1}
                                            {". "}
                                            {el.value.title}
                                          </Typography>
                                          {el.value.options.map((check, index) => (
                                            <div key={check.id}>
                                              <FormControlLabel control={<Checkbox checked={check.checked} color="primary" />} label={check.name ? check.name : "Untitled checkbox " + (index + 1)} />
                                            </div>
                                          ))}
                                        </div>
                                      </ListItem>
                                    );
                                  } else if (el.type === "radio") {
                                    return (
                                      <ListItem key={el.id} divider={childIndex + 1 < JSON.parse(e.content).length ? true : false}>
                                        <div>
                                          <Typography variant="subtitle1">
                                            {childIndex + 1}
                                            {". "}
                                            {el.value.title}
                                          </Typography>
                                          <RadioGroup value={el.value.current}>
                                            {el.value.options.map((radio, index) => (
                                              <FormControlLabel key={radio.id} value={radio.id} control={<Radio color="primary" />} label={radio.name ? radio.name : "Untitled radio " + (index + 1)} />
                                            ))}
                                          </RadioGroup>
                                        </div>
                                      </ListItem>
                                    );
                                  }
                                })}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Container>
                    </div>
                  )}
                </>
              ) : (
                ""
              )}
            </>
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

export default Edit;
