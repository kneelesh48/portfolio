"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(14);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!#$%&()*+-./;<=>?@[]^_`{|}~£";

    let chars = "";
    if (useLowercase) chars += lowercase;
    if (useUppercase) chars += uppercase;
    if (useNumbers) chars += numbers;
    if (useSpecial) chars += special;

    if (chars === "") {
      setPassword("Please select at least one character type");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    setCopyMessage("");
  };

  useEffect(() => {
    generatePassword();
  }, [length, useLowercase, useUppercase, useNumbers, useSpecial]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopyMessage("Password copied!");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`h-[calc(100vh-72px)] flex flex-col items-center p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="mb-4 text-4xl font-bold">Password Generator</div>
      <div className={`p-6 rounded w-full max-w-md border-2 ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
        <div className="mb-4 relative">
          <input
            id="password"
            type="text"
            value={password}
            readOnly
            className={`w-full p-2 pr-10 border rounded ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
          />
          <div className="flex">
            <button
              onClick={copyToClipboard}
              className={`absolute right-10 top-1/2 transform -translate-y-1/2 p-1 ${darkMode ? 'text-gray-200 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}
              aria-label="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>

            <button
              onClick={generatePassword}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${darkMode ? 'text-gray-200 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}
              aria-label="Regenerate password"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          {copyMessage && (
            <div className={`absolute top-12 right-0 mb-2 text-sm p-1 rounded ${darkMode ? "text-gray-200 bg-green-600" : "text-green-600 bg-green-200"}`}>
              {copyMessage}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Length: {length}
            <input id="length" type="range" min="6" max="50" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full" />
          </label>
        </div>
        <div className="mb-4 space-y-2">
          <label className="flex items-center">
            <input id="uppercase" type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} className="mr-2" />
            Uppercase
          </label>
          <label className="flex items-center">
            <input id="lowercase" type="checkbox" checked={useLowercase} onChange={() => setUseLowercase(!useLowercase)} className="mr-2" />
            Lowercase
          </label>
          <label className="flex items-center">
            <input id="numbers" type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} className="mr-2" />
            Numbers
          </label>
          <label className="flex items-center">
            <input id="symbols" type="checkbox" checked={useSpecial} onChange={() => setUseSpecial(!useSpecial)} className="mr-2" />
            Symbols
          </label>
        </div>
      </div>
    </div>
  );
};
