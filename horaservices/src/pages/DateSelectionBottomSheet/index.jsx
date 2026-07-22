import DateSelectionBottomSheet from "@/components/DateSelectionBottomSheet";
import { useState } from "react";


export default function App() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {!open && <button onClick={() => setOpen(true)}>Open Date Sheet</button>}
      <DateSelectionBottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={(date) => console.log("Confirmed date:", date)}
      />
    </>
  );
}