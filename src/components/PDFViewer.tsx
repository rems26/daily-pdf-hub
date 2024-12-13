import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const pdfData = searchParams.get('data');
      
      if (pdfData) {
        const decodedPdfData = decodeURIComponent(pdfData);
        setPdfUrl(decodedPdfData);
        const pathParts = location.pathname.split('/');
        const encodedFileName = pathParts[pathParts.length - 1];
        setFileName(decodeURIComponent(encodedFileName));
      } else {
        setError("Aucun document n'est disponible. Le lien semble invalide.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement du PDF:", err);
      setError("Erreur lors du chargement du PDF. Le lien semble invalide.");
    }
  }, [location]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-center p-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="p-2 bg-gray-100">
        {fileName && (
          <p className="text-sm text-gray-600 font-medium">
            Document : {fileName}
          </p>
        )}
      </div>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full flex-grow border-none"
          title="PDF Viewer"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Chargement du document...</p>
        </div>
      )}
    </div>
  );
};