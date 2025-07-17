import React from "react";

const DownloadDicoPCButton: React.FC = () => (
  <div className="my-8 flex justify-center">
    <a
      href="/download/dico-numee.exe"
      className="inline-block px-6 py-3 bg-cyan-700 text-white font-bold rounded-lg shadow hover:bg-cyan-800 transition"
      download
    >
      Télécharger le Dictionnaire PC (offline)
    </a>
  </div>
);

export default DownloadDicoPCButton;