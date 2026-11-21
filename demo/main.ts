import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/700.css";
import "@fontsource/inter-tight/800.css";
import "../src/theme.css";
import { toast } from "../src/index.ts";
import "./demo.css";

for (const region of document.querySelectorAll("cl-toast-region")) {
  (region as HTMLElement & { toaster?: typeof toast }).toaster = toast;
}
