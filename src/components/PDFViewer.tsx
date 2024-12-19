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
        console.log("Fetching PDF with ID:", id);
        
        // Get the record from the database first
        const { data: pdfRecord, error: dbError } = await supabase
          .from('pdfs')
          .select('file_path')
          .eq('id', id)
          .single();

        if (dbError) {
          console.error("Database error:", dbError);
          throw new Error('PDF not found in database');
        }

        if (!pdfRecord) {
          console.error("No PDF record found");
          throw new Error('PDF not found in database');
        }

        console.log("PDF record found:", pdfRecord);

        // Get the public URL for the file
        const { data } = supabase.storage
          .from('pdfs')
          .getPublicUrl(pdfRecord.file_path);

        if (!data.publicUrl) {
          console.error("Could not generate public URL");
          throw new Error('Could not generate public URL');
        }

        console.log("Generated public URL:", data.publicUrl);
        setPdfUrl(data.publicUrl);

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