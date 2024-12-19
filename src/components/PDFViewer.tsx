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
        console.log("Attempting to fetch PDF with ID:", id);
        
        // First, get the record from the database to ensure we have the correct path
        const { data: pdfRecord, error: dbError } = await supabase
          .from('pdfs')
          .select('file_path')
          .eq('file_path', id)
          .single();

        if (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }

        if (!pdfRecord) {
          console.error("No PDF record found for path:", id);
          throw new Error('PDF not found in database');
        }

        console.log("Found PDF record:", pdfRecord);

        // Get the public URL for the file using the storage API
        const { data: storageData, error: storageError } = await supabase
          .storage
          .from('pdfs')
          .createSignedUrl(pdfRecord.file_path, 60 * 60); // URL valide pendant 1 heure

        if (storageError || !storageData?.signedUrl) {
          console.error("Storage error:", storageError);
          throw new Error('Could not generate signed URL');
        }

        console.log("Generated signed URL:", storageData.signedUrl);
        setPdfUrl(storageData.signedUrl);

      } catch (error) {
        console.error("Error loading PDF:", error);
        setError("Erreur lors du chargement du PDF. Le lien semble invalide.");
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      }
    };

    fetchPDF();
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