import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

// prosta heurystyka "czy to wygląda jak kod"
function looksLikeCode(text) {
  const t = (text || "").trim();
  if (!t) return false;

  const lines = t.split("\n").filter((l) => l.trim() !== "");
  if (lines.length < 2) return false;

  const codeLineRegexes = [
    /^\s*(def|class|import|from)\b/, // Python
    /^\s*(const|let|var|function|export)\b/, // JS
    /^\s*(if|for|while|return)\b/,
    /^\s*(SELECT|INSERT|UPDATE|DELETE)\b/i, // SQL
    /^\s*#include\b/, // C/C++
    /=>/,
    /;$/,
    /\{|\}/,
    /^\s{2,}\S/, // wcięcia
  ];

  const codeLikeLines = lines.filter((line) =>
    codeLineRegexes.some((r) => r.test(line))
  );

  // co najmniej 50% linii wygląda jak kod
  return codeLikeLines.length / lines.length >= 0.5;
}

function CopyableCodeBlock({ children, className, rawCode }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // fallback dla starszych przeglądarek
      try {
        const ta = document.createElement("textarea");
        ta.value = rawCode;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);

        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch (_) {}
    }
  };

  return (
    <div className="codeBlock">
      <button
        type="button"
        className={"copyCodeBtn" + (copied ? " copied" : "")}
        onClick={copy}
        title="Kopiuj kod"
      >
        {copied ? "✓ Skopiowano" : "Kopiuj"}
      </button>

      <pre className="codePre">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function PlainCodeBlock({ children, className }) {
  return (
    <pre className="codePre">
      <code className={className}>{children}</code>
    </pre>
  );
}

export default function NoteContent({ text, mode = "text", enableCopy = false }) {
  const t = (text ?? "").trim();

  const markdown = useMemo(() => {
    if (!t) return "";

    // TRYB: Kod → zawsze blok kodu
    if (mode === "code") return `\`\`\`\n${t}\n\`\`\``;

    // TRYB: Auto → jeśli wygląda jak kod, opakuj w blok kodu
    if (mode === "auto" && !t.includes("```") && looksLikeCode(t)) {
      return `\`\`\`\n${t}\n\`\`\``;
    }

    // jeśli user sam wkleił ``` ... ``` to zostaw jak jest
    return t;
  }, [t, mode]);

  // TRYB: Tekst → zwykły tekst
  if (mode === "text") {
    return <div style={{ whiteSpace: "pre-wrap" }}>{t}</div>;
  }

  // Auto / Code → markdown + highlight + (opcjonalnie) kopiowanie
  return (
    <ReactMarkdown
      rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      components={{
        code({ inline, className, children, ...props }) {
          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          // blok kodu: kopiowanie tylko gdy enableCopy=true
          return enableCopy ? (
            <CopyableCodeBlock className={className} rawCode={t}>
              {children}
            </CopyableCodeBlock>
          ) : (
            <PlainCodeBlock className={className}>{children}</PlainCodeBlock>
          );
        },
        // wyłączamy zewnętrzny <pre> generowany przez markdown
        pre({ children }) {
          return <>{children}</>;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
