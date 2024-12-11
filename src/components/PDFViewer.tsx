import { useEffect, useState } from "react";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pour le moment, on affiche un message indiquant qu'aucun PDF n'est disponible
    setError("Aucun document n'est disponible pour le moment. Veuillez contacter l'administrateur.");
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-center p-4">{error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Chargement du document...</p>
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