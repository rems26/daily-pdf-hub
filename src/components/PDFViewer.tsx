import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      try {
        // Décompresser et reconstruire les données base64
        const decompressedData = decompressData(id);
        const fullBase64 = `data:application/pdf;base64,${decompressedData}`;
        setPdfUrl(fullBase64);
      } catch (error) {
        console.error("Erreur lors du chargement du PDF:", error);
        setError("Erreur lors du chargement du PDF. Le lien semble invalide.");
      }
    }
  }, [id]);

  // Fonction pour décompresser les données
  const decompressData = (compressed: string) => {
    // Reconvertir en base64 standard
    return compressed
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(compressed.length + (4 - (compressed.length % 4)) % 4, '=');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-center p-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
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