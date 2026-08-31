import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FolderUp,
  FileText,
  Check,
  AlertCircle,
  Terminal,
  Key,
  Copy,
  Layers,
} from "lucide-react";
import { EmailAccount, EmailItem } from "../types";
import { parseEmailFile } from "../utils/mailParser";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: EmailAccount[];
  onImportComplete: (newItems: EmailItem[]) => void;
  defaultTab?: "files" | "guide" | "imap";
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onImportComplete,
  defaultTab = "files",
}) => {
  const [activeTab, setActiveTab] = useState<"files" | "guide" | "imap">(defaultTab);
  const [targetAccountId, setTargetAccountId] = useState<string>(accounts[0]?.id || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const targetAccount = accounts.find((a) => a.id === targetAccountId) || accounts[0];

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);
    setProgress({ current: 0, total: fileList.length });
    const parsedItems: EmailItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const item = await parseEmailFile(file, targetAccount.id, targetAccount.name);
        parsedItems.push(item);
      } catch (err) {
        console.error("Failed to parse file:", file.name, err);
      }
      setProgress({ current: i + 1, total: fileList.length });
    }

    setIsProcessing(false);
    setImportedCount(parsedItems.length);
    onImportComplete(parsedItems);
    setTimeout(() => {
      setImportedCount(null);
      setProgress(null);
      onClose();
    }, 2000);
  };

  const macOsAppleScript = `# Copy and paste into Terminal on your Mac to export Apple Mail messages & attachments:
mkdir -p ~/Desktop/AppleMailExport
osascript << 'EOF'
tell application "Mail"
    set outFolder to (POSIX file ((POSIX path of (path to desktop folder)) & "AppleMailExport:")) as string
    set allMessages to messages of inbox
    set counter to 0
    repeat with msg in allMessages
        set counter to counter + 1
        if counter > 50 then exit repeat
        try
            set msgSub to subject of msg
            set cleanSub to do shell script "echo " & quoted form of msgSub & " | tr -cd '[:alnum:]_-' | cut -c 1-30"
            set filePath to outFolder & "Email_" & counter & "_" & cleanSub & ".eml"
            set emlSource to source of msg
            set fp to open for access file filePath with write permission
            write emlSource to fp
            close access fp
        end try
    end repeat
    display dialog "Exported " & counter & " messages to Desktop/AppleMailExport folder!" buttons {"OK"} default button 1
end tell
EOF
echo "Done! Drag the files from ~/Desktop/AppleMailExport into the dashboard."`;

  const copyScript = () => {
    navigator.clipboard.writeText(macOsAppleScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Import Apple Mail Data
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Index your emails, invoices, and attachments across multiple mailboxes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/40">
          <button
            onClick={() => setActiveTab("files")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "files"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Files / MBOX</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "guide"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>macOS 1-Click Script</span>
          </button>

          <button
            onClick={() => setActiveTab("imap")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "imap"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>iCloud & IMAP Guide</span>
          </button>
        </div>

        {/* Tab 1: File Upload / Drag & Drop */}
        {activeTab === "files" && (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Account Selector */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-700">Assign imported mail to:</span>
              <select
                value={targetAccountId}
                onChange={(e) => setTargetAccountId(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-sky-50/30 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".eml,.emlx,.mbox,.txt"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-bold text-slate-900">
                Drag & Drop Apple Mail .eml or .mbox files here
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Or click to browse files on your Mac. Supports individual exported emails or Apple Mail mailbox archives.
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-xs"
                >
                  Select .EML Files
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    folderInputRef.current?.click();
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs flex items-center gap-1.5"
                >
                  <FolderUp className="w-3.5 h-3.5 text-slate-500" />
                  <span>Select Folder</span>
                </button>
                <input
                  ref={folderInputRef}
                  type="file"
                  // @ts-ignore
                  webkitdirectory=""
                  directory=""
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>

            {/* Progress / Status */}
            {isProcessing && progress && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs">
                <div className="flex justify-between font-semibold text-sky-800 mb-1.5">
                  <span>Parsing and extracting invoice metadata...</span>
                  <span>
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <div className="w-full bg-sky-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-sky-600 h-2 transition-all duration-200"
                    style={{
                      width: `${(progress.current / progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {importedCount !== null && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Successfully imported and indexed {importedCount} new emails and attachments!</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: macOS Script Helper */}
        {activeTab === "guide" && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3.5 text-xs text-sky-800">
              <strong>Native Apple Mail Sync:</strong> Apple Mail stores messages in{" "}
              <code className="bg-sky-100/80 px-1 py-0.5 rounded font-mono">~/Library/Mail/V10/</code>. You can easily export invoices and attachments using this copyable Terminal command.
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Terminal 1-Liner (macOS AppleScript):
                </span>
                <button
                  onClick={copyScript}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-60 leading-relaxed">
                {macOsAppleScript}
              </pre>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 pl-1">
              <li>Open <strong>Terminal</strong> on your Mac (⌘ + Space, type Terminal).</li>
              <li>Paste the command above and press Return.</li>
              <li>A folder <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">~/Desktop/AppleMailExport</code> will be created with your emails.</li>
              <li>Drag the folder into the <strong>Upload Files</strong> tab.</li>
            </ol>
          </div>
        )}

        {/* Tab 3: iCloud & IMAP Guide */}
        {activeTab === "imap" && (
          <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Apple iCloud Mail IMAP Settings
              </h4>
              <p className="text-slate-600">
                To connect an iCloud account directly, Apple requires an <strong>App-Specific Password</strong> rather than your primary Apple ID password.
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200 mt-2">
                <div>IMAP Server: <strong>imap.mail.me.com</strong></div>
                <div>Port: <strong>993 (SSL)</strong></div>
                <div>Username: <strong>your-name@icloud.com</strong></div>
                <div>Password: <strong>xxxx-xxxx-xxxx-xxxx</strong></div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-semibold text-slate-900">How to generate an App-Specific Password:</h5>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                <li>Sign in to <a href="https://appleid.apple.com" target="_blank" rel="noreferrer" className="text-sky-600 underline">appleid.apple.com</a>.</li>
                <li>In the <strong>Sign-In and Security</strong> section, select <strong>App-Specific Passwords</strong>.</li>
                <li>Select <strong>Generate an app-specific password</strong>, label it "Mail Dashboard", and copy the 16-character code.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
