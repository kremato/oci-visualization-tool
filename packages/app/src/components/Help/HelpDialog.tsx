import * as React from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ReactMarkdown from "react-markdown";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const HelpDialog = ({ open, handleClose }: Props) => {
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Help</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {/* {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")} */}
            {/* <div>
              <h1>LIMITS FETCH</h1>
              <div>
                There are two options for limit fetch.
                <ol>
                  <li>
                    Fill out the compartment, region, and service dropdown. This
                    option will retrieve all limits for every combination of
                    compartment, region, and service.
                  </li>
                  <li>
                    Fill out the compartment, region, service, and limit
                    dropdown. This option will retrieve limit values for the
                    chosen limits in every combination of compartment, region,
                    and service(if the chosen limits belong to the chosen
                    services). Any other combination will result in an empty
                    response.
                  </li>
                </ol>
                There is also a possibility to invalidate the limit cache. This
                option deletes all cached limits, and every new request must
                fetch the limits from the OCI API.
              </div>
            </div>
            ACCORDION DISPLAY There are two hierarchical options to display
            limit tables, "Limits Per Compartment" and "Limits Per Service".
            TABLE CONFIGURATION Options: Sum AD resources: if checked, sums
            resources for every limit in multiple Availability Domains. Show
            deprecated limits: if checked, deprecated limits will also be
            displayed. Hide limits with no service
            limit/availability/used/quota: limit with no service
            limit/availability/used/quota is a limit with "0" or "n/a" in the
            place of service limit/availability/used/quota. These options work
            together like a logical "and" statement. So, for example, if the
            limit has no quota and availability and "Hide limits with no quota"
            and "Hide limits with no availability" are checked, the limit will
            hide. However, if for the same limit, only "Hide limits with no
            quota" is checked out of the four options, the limits will not hide
            because "Hide limits with no availability" remains unchecked. */}
            <ReactMarkdown>**LIMITS FETCH**</ReactMarkdown>
            <ReactMarkdown>
              There are two options for limit fetch.
            </ReactMarkdown>
            <ReactMarkdown>1. Ja 2. TY</ReactMarkdown>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
