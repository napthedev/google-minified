import { Accordion, AccordionSummary, Typography, AccordionDetails, List, ListItem, FormControlLabel, Checkbox, Radio, RadioGroup } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

import { calculateCreatedTime } from "../../shared/utils";

function SubmitsSummary({ allSubmits }) {
  return (
    <>
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

                return <></>;
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export default SubmitsSummary;
