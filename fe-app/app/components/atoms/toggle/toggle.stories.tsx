import { useState } from "react";
import { Toggle } from "./toggle";

export default {
  title: "Atoms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
};

export const Controlled = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Toggle
      checked={checked}
      onCheckedChange={setChecked}
      label={checked ? "활성화" : "비활성"}
    />
  );
};
