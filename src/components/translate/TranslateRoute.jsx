import { useState, useEffect, useRef } from "react";

import { IconButton, FormControl, Select, MenuItem, Snackbar, TextareaAutosize, Typography } from "@material-ui/core";
import { SwapHoriz, FileCopy, Close } from "@material-ui/icons";

import { copyToClipboard } from "../Functions";

import Navbar, { allApps } from "../Navbar";

const languages = { en: "English", vi: "Vietnamese", ar: "Arabic", zh: "Chinese", fr: "French", de: "German", hi: "Hindi", id: "Indonesian", ga: "Irish", it: "Italian", ja: "Japanese", ko: "Korean", pl: "Polish", pt: "Portuguese", ru: "Russian", es: "Spanish", tr: "Turkish" };

function TranslateRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = allApps.find((e) => e.name === "Translate").icon;
    document.title = "Google Translate Minified";
  }, []);

  const [languageFrom, setLanguageFrom] = useState(localStorage.getItem("languageFrom") ? localStorage.getItem("languageFrom") : "en");
  const [languageTo, setLanguageTo] = useState(localStorage.getItem("languageTo") ? localStorage.getItem("languageTo") : "vi");
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState("");

  const valueDidUpdate = useRef(false);
  const timeOutRef = useRef(null);

  const [snackbarOpened, setSnackbarOpened] = useState(false);

  const handleCopy = () => {
    copyToClipboard(data)
      .then((res) => {
        setSnackbarOpened(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(async () => {
    localStorage.setItem("languageFrom", languageFrom);
    localStorage.setItem("languageTo", languageTo);

    if (valueDidUpdate.current) {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);

      if (!inputValue.trim()) {
        setData("");
        return;
      }

      setData(null);

      timeOutRef.current = setTimeout(() => {
        if (!inputValue.trim()) {
          setData("");
          return;
        }

        fetch("https://libretranslate.de/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: inputValue.trim(),
            source: languageFrom,
            target: languageTo,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (inputValue.trim()) setData(data.translatedText);
          })
          .catch((err) => {
            console.log(err);
            setData("");
          });
      }, 500);
    }
    valueDidUpdate.current = true;
  }, [languageFrom, languageTo, inputValue]);

  return (
    <div>
      <Navbar name="Translate" />

      <div className="translate-container">
        <div className="translate-header">
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <p className="responsive-label">Translate from: </p>
            <FormControl>
              <Select
                value={languageFrom}
                onChange={(e) => {
                  if (e.target.value === languageTo) setLanguageTo(languageFrom);
                  setLanguageFrom(e.target.value);
                }}
              >
                {Object.keys(languages).map((e) => (
                  <MenuItem key={e} value={e}>
                    {languages[e]}
                  </MenuItem>
                ))}
                <MenuItem value={"auto"}>Auto Detect</MenuItem>
              </Select>
            </FormControl>
          </div>
          <IconButton
            onClick={() => {
              setLanguageFrom(languageTo);
              setLanguageTo(languageFrom);
              setInputValue(data ? data : "");
              setData("");
            }}
            className="swap-button"
            disabled={languageFrom === "auto"}
          >
            <SwapHoriz />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <p className="responsive-label">Translate to: </p>
            <FormControl>
              <Select
                value={languageTo}
                onChange={(e) => {
                  if (e.target.value === languageFrom) setLanguageFrom(languageTo);
                  setLanguageTo(e.target.value);
                }}
              >
                {Object.keys(languages).map((e) => (
                  <MenuItem key={e} value={e}>
                    {languages[e]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="translate-flex">
          <div className="translate-box-container">
            <TextareaAutosize
              className="translate-box"
              placeholder="Text..."
              value={inputValue}
              onChange={(e) => {
                if (e.target.value.length <= 1000) setInputValue(e.target.value);
              }}
            />
            {inputValue.trim() && (
              <IconButton style={{ position: "absolute", top: 12, right: 7 }} onClick={() => setInputValue("")}>
                <Close />
              </IconButton>
            )}
            <Typography style={{ position: "absolute", bottom: 5, right: 10 }}>{inputValue.length} / 1000</Typography>
          </div>
          <div className="translate-box-container">
            <div className="translate-box">{data === null ? "Translating..." : data}</div>
            {data && (
              <IconButton style={{ position: "absolute", bottom: 7, right: 7 }} onClick={handleCopy}>
                <FileCopy />
              </IconButton>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpened}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpened(false)}
        message="Text copied to clipboard!"
      />
    </div>
  );
}

export default TranslateRoute;