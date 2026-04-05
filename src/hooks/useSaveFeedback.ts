import { useState, useRef } from "react";

type Message = { type: "success" | "error"; text: string };

export function useSaveFeedback() {
  const [saving, setSaving] = useState(false);
  const [message, setMessageRaw] = useState<Message | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setMessage(msg: Message | null) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessageRaw(msg);
    if (msg?.type === "success") {
      timerRef.current = setTimeout(() => setMessageRaw(null), 3000);
    }
  }

  return { saving, setSaving, message, setMessage };
}
