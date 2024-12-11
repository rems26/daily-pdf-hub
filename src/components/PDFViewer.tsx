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
      // Convertir le base64 en blob URL
      const base64Response = storedPDF.split(',')[1];
      const binaryString = window.atob(base64Response);
      const bytes = new Uint8Array(binaryString.length);
      const len = bytes.length;
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLastUpdate(lastUpdateDate);
    } else {
      console.log("Aucun PDF trouvé dans le localStorage");
      setError("Aucun document n'est disponible pour le moment. Veuillez contacter l'administrateur.");
    }

    // Nettoyer l'URL du blob lors du démontage du composant
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
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
        <embed
          src={pdfUrl}
          type="application/pdf"
          className="w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Chargement du document...</p>
        </div>
      )}
    </div>
  );
};