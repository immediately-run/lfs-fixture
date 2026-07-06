import { useEffect, useState } from "react";
import { openAppFs } from "@immediately-run/sdk";

// Renders /app/hello.txt (LFS-tracked). Authed LFS mount → real content; else the git-lfs pointer.
export default function App() {
  const [txt, setTxt] = useState("(loading)");
  useEffect(() => {
    (async () => {
      try {
        const appFs = openAppFs();
        const data = await appFs.readFile("hello.txt", "utf8");
        setTxt(typeof data === "string" ? data : new TextDecoder().decode(data));
      } catch (e: any) {
        setTxt("ERR: " + (e?.message ?? String(e)));
      }
    })();
  }, []);
  const isPointer = /git-lfs\.github\.com\/spec|oid sha256:/.test(txt);
  return (
    <div style={{ fontFamily: "monospace", padding: 24 }}>
      <h2 data-testid="lfs-verdict" style={{ color: isPointer ? "crimson" : "green" }}>
        {txt.startsWith("ERR") ? txt : isPointer ? "POINTER — LFS NOT resolved" : "REAL BYTES — LFS resolved ✓"}
      </h2>
      <div>length: <b data-testid="lfs-len">{txt.length}</b></div>
      <pre data-testid="lfs-content" style={{ whiteSpace: "pre-wrap" }}>{txt.slice(0, 160)}</pre>
    </div>
  );
}
