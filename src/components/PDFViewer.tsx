import { useEffect, useState } from "react";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const storedPDF = localStorage.getItem('currentPDF');
    const lastUpdateDate = localStorage.getItem('pdfLastUpdate');
    const storedFileName = localStorage.getItem('pdfFileName');
    
    if (storedPDF) {
      console.log("PDF trouvé dans le localStorage");
      try {
        if (!storedPDF.startsWith('data:application/pdf')) {
          throw new Error('Format de PDF invalide');
        }
        
        setPdfUrl(storedPDF);
        setLastUpdate(lastUpdateDate);
        setFileName(storedFileName);
      } catch (error) {
        console.error("Erreur lors du chargement du PDF:", error);
        setError("Erreur lors du chargement du PDF. Format invalide.");
      }
    } else {
      console.log("Aucun PDF trouvé dans le localStorage");
      setError("Aucun document n'est disponible pour le moment. Veuillez contacter l'administrateur.");
    }
  }, []);

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
        {lastUpdate && (
          <p className="text-sm text-gray-600">
            Dernière mise à jour : {new Date(lastUpdate).toLocaleString()}
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