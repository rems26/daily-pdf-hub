import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { decompressFromEncodedURIComponent } from 'lz-string';

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      try {
        const decompressedData = decompressFromEncodedURIComponent(id);
        if (!decompressedData) {
          throw new Error('Données PDF invalides');
        }
        const fullBase64 = `data:application/pdf;base64,${decompressedData}`;
        setPdfUrl(fullBase64);
      } catch (error) {
        console.error("Erreur lors du chargement du PDF:", error);
        setError("Erreur lors du chargement du PDF. Le lien semble invalide.");
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      }
    }
  }, [id, navigate]);

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