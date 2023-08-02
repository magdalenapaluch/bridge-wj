import { Button, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

interface UIProps {
  reshuffle: () => void;
  openSettings: (b: boolean) => void;
}

export const Interface = (props: UIProps) => {
  const { reshuffle, openSettings } = props;
  return (
    <div className="interface">
      <Button variant="outlined" onClick={reshuffle}>
        Przetasuj
      </Button>
      <IconButton
        style={{ position: "absolute", right: 0, top: 0 }}
        onClick={openSettings}
        aria-label="settings"
        color="primary"
      >
        <SettingsIcon />
      </IconButton>
    </div>
  );
};
