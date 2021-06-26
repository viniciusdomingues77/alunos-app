import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

export default function AgendasdoAluno(props) {
  const handleClose = () => {};

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
    </Dialog>
  );
}
