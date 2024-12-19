import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPDF = async () => {
      if (!id) return;

      try {
        console.log("Fetching PDF with path:", id);
        
        // First, get the file record from the database to get the full path
        const { data: pdfRecord, error: dbError } = await supabase
          .from('pdfs')
          .select('file_path')
          .eq('file_path', id)
          .single();

        if (dbError) {
          throw dbError;
        }

        if (!pdfRecord) {
          throw new Error('PDF record not found');
        }

        // Now download the file using the correct path
        const { data, error: downloadError } = await supabase.storage
          .from('pdfs')
          .download(pdfRecord.file_path);

        if (downloadError) {
          throw downloadError;
        }

        if (!data) {
          throw new Error('Aucune donnée PDF trouvée');
        }

        // Créer une URL blob pour le PDF
        const url = URL.createObjectURL(data);
        setPdfUrl(url);

      } catch (error) {
        console.error("Erreur lors du chargement du PDF:", error);
        setError("Erreur lors du chargement du PDF. Le lien semble invalide.");
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      }
    };

    fetchPDF();

    // Nettoyer l'URL blob à la destruction du composant
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
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