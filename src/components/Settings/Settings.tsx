import CloseIcon from "@mui/icons-material/Close";
import {
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from "@mui/material";
import "./Settings.css";

interface SettingsProps {
  isDrawerOpen: boolean;
  showExplanation: boolean;
  fastCheck: boolean;
  handleClose: () => void;
  toggleExplanation: () => void;
  toggleFastCheck: () => void;
}

export const Settings = (props: SettingsProps) => {
  const {
    isDrawerOpen,
    handleClose,
    toggleExplanation,
    toggleFastCheck,
    showExplanation,
    fastCheck,
  } = props;
  return (
    <Drawer open={isDrawerOpen} anchor="right" onClose={handleClose}>
      <div className="drawer-row">
        <IconButton onClick={handleClose} aria-label="close" color="primary">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="drawer-row desc-row">
        <h3>Ustawienia</h3>
      </div>
      <FormGroup>
        <div className="drawer-row">
          <FormControlLabel
            label="Pokazuj tylko odpowiedzi, nie chcę zgadywać"
            labelPlacement="end"
            control={
              <Switch checked={showExplanation} onChange={toggleExplanation} />
            }
          />
        </div>
        <div className="drawer-row">
          <FormControlLabel
            disabled={showExplanation}
            label="Jeśli zgadłem, od razu przetasuj"
            labelPlacement="end"
            control={<Switch checked={fastCheck} onChange={toggleFastCheck} />}
          />
        </div>
      </FormGroup>
    </Drawer>
  );
};
