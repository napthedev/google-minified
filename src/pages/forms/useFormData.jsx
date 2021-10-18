import axios from "axios";
import { generate } from "shortid";
import { useParams } from "react-router-dom";
import { useState } from "react";

function useFormData() {
  const { id: _id } = useParams();

  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [view, setView] = useState("");
  const [loading, setLoading] = useState(true);
  const [allSubmits, setAllSubmits] = useState([]);

  const getSubmits = () => {
    axios.post("forms/get-submits", { id: _id }).then((res) => setAllSubmits(res.data.reverse()));
  };

  const getPreviousFormData = () => {
    axios
      .post("forms/form", { _id })
      .then((res) => {
        setTitle(res.data.form.title);
        setDescription(res.data.form.description);
        setData(JSON.parse(res.data.form.content));
        setView(200);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, err.response);
        setView(err.response.status);
        setLoading(false);
      });
  };

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
    if (type === "checkbox") item.value.options.push({ id: generate(), name: "Checkbox " + (item.value.options.length + 1), checked: false });
    else if (type === "radio") item.value.options.push({ id: generate(), name: "Radio " + (item.value.options.length + 1) });

    setData(clone);
  };

  const removeBox = (id) => {
    let clone = [...data];
    setData(clone.filter((e) => e.id !== id));
  };

  const addBox = (type) => {
    let clone = [...data];
    if (type === "text") {
      clone.push({ id: generate(), type: "text", value: { title: "Untitled question", answer: "" } });
    } else if (type === "checkbox") {
      clone.push({
        id: generate(),
        type: "checkbox",
        value: {
          title: "Untitled checkbox",
          options: [
            { id: generate(), name: "Checkbox 1", checked: false },
            { id: generate(), name: "Checkbox 2", checked: false },
          ],
        },
      });
    } else if (type === "radio") {
      clone.push({
        id: generate(),
        type: "radio",
        value: {
          title: "Untitled radio",
          current: "",
          options: [
            {
              id: generate(),
              name: "Radio 1",
            },
            {
              id: generate(),
              name: "Radio 2",
            },
          ],
        },
      });
    } else if (type === "date") {
      clone.push({ id: generate(), type: "date", value: { title: "Untitled date", answer: "" } });
    } else if (type === "time") {
      clone.push({ id: generate(), type: "time", value: { title: "Untitled time", answer: "" } });
    }

    setData(clone);
  };

  return { data, title, description, setTitle, setDescription, getPreviousFormData, postFormData, updateTextField, updateOptionText, removeOption, addOption, removeBox, addBox, view, loading, allSubmits, getSubmits };
}

export default useFormData;
