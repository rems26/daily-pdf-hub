import { useEffect, useState } from "react";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Dans une vraie application, récupérez l'URL du PDF depuis le serveur
    setPdfUrl("/sample.pdf");
  }, []);

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement du document...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
};