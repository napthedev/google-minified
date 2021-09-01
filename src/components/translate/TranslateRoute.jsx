import { useState, useEffect, useRef } from "react";

import { IconButton, FormControl, Select, MenuItem, TextareaAutosize, Typography, CircularProgress } from "@material-ui/core";
import { SwapHoriz, FileCopy, Close } from "@material-ui/icons";

import ClipboardSnackbar from "../ClipboardSnackbar";

import Navbar, { allApps } from "../Navbar";

function TranslateRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = allApps.find((e) => e.name === "Translate").icon;
    document.title = "Google Translate Minified";
  }, []);

  const [languageFrom, setLanguageFrom] = useState(localStorage.getItem("languageFrom") ? localStorage.getItem("languageFrom") : "en");
  const [languageTo, setLanguageTo] = useState(localStorage.getItem("languageTo") ? localStorage.getItem("languageTo") : "vi");
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState("");
  const [languages, setLanguages] = useState([]);

  const [ellipsis, setEllipsis] = useState(0);

  const valueDidUpdate = useRef(false);
  const timeOutRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setEllipsis((prev) => ++prev % 3);
    }, 300);

    fetch("https://libretranslate.de/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data))
      .catch((err) => {
        console.log(err);
        setLanguages([
          { code: "en", name: "English" },
          { code: "ar", name: "Arabic" },
          { code: "zh", name: "Chinese" },
          { code: "fr", name: "French" },
          { code: "de", name: "German" },
          { code: "hi", name: "Hindi" },
          { code: "id", name: "Indonesian" },
          { code: "ga", name: "Irish" },
          { code: "it", name: "Italian" },
          { code: "ja", name: "Japanese" },
          { code: "ko", name: "Korean" },
          { code: "pl", name: "Polish" },
          { code: "pt", name: "Portuguese" },
          { code: "ru", name: "Russian" },
          { code: "es", name: "Spanish" },
          { code: "tr", name: "Turkish" },
          { code: "vi", name: "Vietnamese" },
        ]);
      });

    return () => clearInterval(interval);
  }, []);

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
    <>
      <Navbar name="Translate" />

      {languages.length > 0 ? (
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
                  {languages.map((e) => (
                    <MenuItem key={e.code} value={e.code}>
                      {e.name}
                    </MenuItem>
                  ))}
                  <MenuItem value="auto">Auto Detect</MenuItem>
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
                  {languages.map((e) => (
                    <MenuItem key={e.code} value={e.code}>
                      {e.name}
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
              <div className="translate-box">{data === null ? "Translating" + ".".repeat(ellipsis + 1) : data}</div>
              {data && (
                <ClipboardSnackbar content={data} message="Text copied to clipboard!">
                  <IconButton style={{ position: "absolute", bottom: 7, right: 7 }}>
                    <FileCopy />
                  </IconButton>
                </ClipboardSnackbar>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="center-container">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default TranslateRoute;
