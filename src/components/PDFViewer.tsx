import { useEffect, useState } from "react";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const storedPDF = localStorage.getItem('currentPDF');
    const lastUpdateDate = localStorage.getItem('pdfLastUpdate');
    
    if (storedPDF) {
      console.log("PDF trouvé dans le localStorage");
      setPdfUrl(storedPDF);
      setLastUpdate(lastUpdateDate);
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
    <div className="flex flex-col h-screen">
      {lastUpdate && (
        <div className="p-2 bg-gray-100">
          <p className="text-sm text-gray-600">
            Dernière mise à jour : {new Date(lastUpdate).toLocaleString()}
          </p>
        </div>
      )}
      {pdfUrl ? (
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title="PDF Viewer"
          >
            <p>Votre navigateur ne peut pas afficher le PDF directement. 
            <a href={pdfUrl} download="document.pdf">Cliquez ici pour le télécharger</a>.</p>
          </iframe>
        </object>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Chargement du document...</p>
        </div>
      )}
    </div>
  );
};