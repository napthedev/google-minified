import { Button, CircularProgress, Container, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";

import CheckboxResponse from "./ResponsePage/CheckboxResponse";
import DateResponse from "./ResponsePage/DateResponse";
import FormSubmitted from "./ResponsePage/FormSubmitted";
import NotFound from "../../components/NotFound";
import RadioResponse from "./ResponsePage/RadioResponse";
import TextResponse from "./ResponsePage/TestResponse";
import TimeResponse from "./ResponsePage/TimeResponse";
import Title from "../../components/Title";
import axios from "axios";
import { useParams } from "react-router-dom";

function Response() {
  const [view, setView] = useState("");

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("forms/form-response", { _id: id })
      .then((res) => {
        setTitle(res.data.form.title);
        setDescription(res.data.form.description);
        setData(JSON.parse(res.data.form.content));
        setView("200");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, err.response);
        setView("404");
        setLoading(false);
      });
  }, [id]);

  const updateTextField = (id, value) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    item.value.answer = value;
    setData(clone);
  };

  const handleCheckboxChange = (id, childId) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    let checkboxChild = item.value.options.find((e) => e.id === childId);
    checkboxChild.checked = !checkboxChild.checked;
    setData(clone);
  };

  const handleRadioChange = (id, value) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    item.value.current = value;
    setData(clone);
  };

  const handleDateTimeChange = (id, value) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    item.value.answer = value;
    setData(clone);
  };

  const changeClasses = (id, classes) => {
    let clone = [...data];
    let item = clone.find((e) => e.id === id);
    if (classes) {
      item.classes = classes;
    } else {
      delete item.classes;
    }
    setData(clone);
  };

  const validateForm = () => {
    var valid = true;

    data.forEach((e) => {
      if (e.type === "text" || e.type === "date" || e.type === "time") {
        if (!e.value.answer) {
          valid = false;
          changeClasses(e.id, " invalid-box");
        } else {
          changeClasses(e.id, "");
        }
      } else if (e.type === "radio") {
        if (!e.value.current) {
          valid = false;
          changeClasses(e.id, " invalid-box");
        } else {
          changeClasses(e.id, "");
        }
      }
    });

    return valid;
  };

  const postFormData = () => {
    axios
      .post("forms/create-submit", { id, content: JSON.stringify(data) })
      .then((res) => setView("submitted"))
      .catch((err) => console.log(err, err.response));
  };

  const submitForm = (e) => {
    e.preventDefault();
    let valid = validateForm();
    if (valid) {
      postFormData();
    }
  };

  return (
    <>
      <Title title={title + (title ? " - " : "") + "Editing - Google Forms Minified"} />
      {!loading ? (
        <>
          {view === "404" ? (
            <NotFound />
          ) : view === "submitted" ? (
            <FormSubmitted />
          ) : view === "200" ? (
            <div className="response-page">
              <Container style={{ maxWidth: 700 }}>
                <form onSubmit={submitForm} className="form-container">
                  <div className="box" style={{ borderTop: "8px solid #673ab7" }}>
                    <Typography variant="h4">{title ? title : "Untitled form"}</Typography>
                    {description ? <Typography variant="h6">{description}</Typography> : <Typography variant="h6">No description</Typography>}
                  </div>

                  {data.map((e) => {
                    if (e.type === "text") {
                      return <TextResponse classes={e.classes} key={e.id} id={e.id} updateTextField={updateTextField} value={e.value} />;
                    } else if (e.type === "checkbox") {
                      return <CheckboxResponse classes={e.classes} key={e.id} id={e.id} value={e.value} handleCheckboxChange={handleCheckboxChange} />;
                    } else if (e.type === "radio") {
                      return <RadioResponse classes={e.classes} key={e.id} id={e.id} value={e.value} handleRadioChange={handleRadioChange} />;
                    } else if (e.type === "date") {
                      return <DateResponse classes={e.classes} key={e.id} id={e.id} value={e.value} handleDateTimeChange={handleDateTimeChange} />;
                    } else if (e.type === "time") {
                      return <TimeResponse classes={e.classes} key={e.id} id={e.id} value={e.value} handleDateTimeChange={handleDateTimeChange} />;
                    }
                    return <></>;
                  })}
                  <div className="submit-button-container">
                    <Button type="submit" variant="contained" color="primary" disabled={data.length === 0}>
                      Submit
                    </Button>
                  </div>
                </form>
              </Container>
            </div>
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

export default Response;
