import { useState, useEffect, useContext, useRef } from "react";
import { userContext } from "../../App";

import { AppBar, Toolbar, IconButton, Typography, Tooltip, FormControl, Select, MenuItem, Snackbar } from "@material-ui/core";
import { ExitToApp, SwapHoriz, FileCopy } from "@material-ui/icons";

import ContentEditable from "react-contenteditable";

import { copyToClipboard } from "../Functions";

const languages = { en: "English", vi: "Vietnamese", ar: "Arabic", zh: "Chinese", fr: "French", de: "German", hi: "Hindi", id: "Indonesian", ga: "Irish", it: "Italian", ja: "Japanese", ko: "Korean", pl: "Polish", pt: "Portuguese", ru: "Russian", es: "Spanish", tr: "Turkish" };

function TranslateRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = "https://i.imgur.com/PAS1jhL.png";
    document.title = "Google Translate Clone";
  }, []);

  const { currentUser, handleSignOut } = useContext(userContext);

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
      if (!inputValue.trim()) {
        setData("");
      } else {
        if (timeOutRef.current) clearTimeout(timeOutRef.current);

        setData(null);

        timeOutRef.current = setTimeout(() => {
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
              setData(data.translatedText);
            })
            .catch((err) => {
              console.log(err);
              setData("");
            });
        }, 500);
      }
    }
    valueDidUpdate.current = true;
  }, [languageFrom, languageTo, inputValue]);

  return (
    <div>
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <img height={30} src="https://i.imgur.com/PAS1jhL.png" />
          </IconButton>
          <div style={{ flexGrow: 1 }}>
            <Typography variant="h6" style={{ cursor: "pointer", display: "inline" }}>
              Google Translate Clone
            </Typography>
          </div>
          {currentUser && (
            <Tooltip title="Sign out">
              <IconButton onClick={handleSignOut} color="secondary">
                <ExitToApp />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

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
            <ContentEditable
              className="translate-box"
              html={inputValue.replaceAll("\n", "<br>")}
              onChange={(e) => {
                let pre = document.createElement("pre");
                pre.innerHTML = e.target.value.replaceAll("<br>", "\\n");
                let output = pre.outerText.replaceAll("\\n", "\n");
                if (output.length <= 5000) setInputValue(output);
              }}
            />
            <Typography variant="subtitle1" className="float-right">
              {inputValue.trim().length} / 5000
            </Typography>
          </div>
          <div className="translate-box-container">
            <div className="translate-box">{data === null ? "Translating..." : data}</div>
            {data && (
              <IconButton className="float-right" onClick={handleCopy}>
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
