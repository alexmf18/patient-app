import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "./FormFields";

export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <TextField {...props} type={visible ? "text" : "password"} inputClassName="pr-12" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-[1.875rem] right-0.5 flex h-10 w-11 items-center justify-center rounded-md text-ink-3 hover:text-ink"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
