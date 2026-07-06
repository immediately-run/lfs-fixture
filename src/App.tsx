import { useEffect, useState } from "react";
import { fs } from "@immediately-run/sdk";

// Renders /app/hello.txt — an LFS-tracked file. If the authed LFS mount resolves the
// pointer, this shows the real content (HELLO_LFS_REAL_CONTENT…); if not, the git-lfs pointer.
export default function App() {
  const [txt, setTxt] = useState("(loading)");
  useEffect(() => {
    fs.readFile("/app/hello.txt", "utf8").then(setTxt).catch((e) => setTxt("ERR: " + e.message));
  }, []);
  const isPointer = /git-lfs\.github\.com\/spec|oid sha256:/.test(txt);
  return (
    <div style={{ fontFamily: "monospace", padding: 24 }}>
      <h3 data-testid="lfs-verdict">{isPointer ? "POINTER (LFS not resolved)" : "REAL BYTES"}</h3>
      <pre data-testid="lfs-content" style={{ whiteSpace: "pre-wrap" }}>{txt.slice(0, 200)}</pre>
      <div>len: <span data-testid="lfs-len">{txt.length}</span></div>
    </div>
  );
}
