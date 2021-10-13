import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { Container, TextField, Tab, Tabs, Badge, Tooltip, CircularProgress } from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import { CheckBox, RadioButtonChecked, Description, DateRange, Timer, AllInbox, InsertLink, Edit as EditIcon } from "@material-ui/icons";

import { useParams } from "react-router-dom";

import TextEdit from "./EditPage/TextEdit";
import CheckboxEdit from "./EditPage/CheckboxEdit";
import RadioEdit from "./EditPage/RadioEdit";
import DateEdit from "./EditPage/DateEdit";
import TimeEdit from "./EditPage/TimeEdit";
import Forbidden from "../../components/Forbidden";
import NotFound from "../../components/NotFound";

import ClipboardSnackbar from "../../components/ClipboardSnackbar";
import SubmitsSummary from "./SubmitsSummary";

import useFormData from "./useFormData";
import Title from "../../components/Title";

function Edit() {
  const { id: _id } = useParams();

  const { data, title, description, setTitle, setDescription, getPreviousFormData, postFormData, updateTextField, updateOptionText, removeOption, addOption, removeBox, addBox, view, loading, allSubmits, getSubmits } = useFormData();

  const [speedDialOpened, setSpeedDialOpened] = useState(false);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    getPreviousFormData();
    getSubmits();

    const socket = io(process.env.REACT_APP_SERVER_URL + "submits");
    socket.emit("join-room", _id);
    socket.on("new-data", () => {
      getSubmits();
    });

    return () => socket.disconnect();
  }, [_id]);

  const formTimeout = useRef(null);
  const formUpdated = useRef(false);

  useEffect(() => {
    if (!formUpdated.current) {
      formUpdated.current = true;
      return;
    }

    if (formTimeout.current) {
      clearTimeout(formTimeout.current);
    }

    formTimeout.current = setTimeout(() => {
      postFormData(title, description, data);
    }, 400);
  }, [data, title, description]);

  return (
    <>
      <Title title={`${title}${title ? " - " : ""}Editing - Google Forms Minified`} />
      {!loading ? (
        <>
          {view === 404 ? (
            <NotFound />
          ) : view === 403 ? (
            <Forbidden />
          ) : view === 200 ? (
            <>
              <Tabs
                centered
                value={tabValue}
                onChange={(event, newValue) => {
                  setTabValue(newValue);
                }}
                indicatorColor="primary"
                textColor="primary"
              >
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
                        return <></>;
                      })}
                      <SpeedDial className="add-box-button" ariaLabel="Add box" icon={<SpeedDialIcon />} onClose={() => setSpeedDialOpened(false)} onOpen={() => setSpeedDialOpened(true)} open={speedDialOpened}>
                        <SpeedDialAction icon={<Description />} tooltipTitle="Text input" onClick={() => addBox("text")} />
                        <SpeedDialAction icon={<CheckBox />} tooltipTitle="Checkbox" onClick={() => addBox("checkbox")} />
                        <SpeedDialAction icon={<RadioButtonChecked />} tooltipTitle="Radio button" onClick={() => addBox("radio")} />
                        <SpeedDialAction icon={<DateRange />} tooltipTitle="Date picker" onClick={() => addBox("date")} />
                        <SpeedDialAction icon={<Timer />} tooltipTitle="Time picker" onClick={() => addBox("time")} />
                      </SpeedDial>

                      <ClipboardSnackbar content={window.location.href.replace("edit", "response")} message="Response URL copied!" horizontal="left" vertical="top">
                        <Tooltip title="Copy response url">
                          <SpeedDial open={false} className="copy-link-button" ariaLabel="Copy response link" icon={<InsertLink />}></SpeedDial>
                        </Tooltip>
                      </ClipboardSnackbar>
                    </div>
                  </Container>
                </div>
              ) : (
                <div className="edit-page">
                  <Container style={{ maxWidth: 700, paddingTop: 20 }}>
                    <SubmitsSummary allSubmits={allSubmits} />
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
  );
}

export default Edit;
