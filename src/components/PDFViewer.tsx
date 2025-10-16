import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
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

        // Get the public URL for the file
        const { data: storageData } = supabase
          .storage
          .from('pdfs')
          .getPublicUrl(pdfRecord.file_path);

        if (!storageData.publicUrl) {
          throw new Error('Could not generate public URL');
        }

        console.log("Generated public URL:", storageData.publicUrl);
        
        // Set both URLs
        setPdfUrl(storageData.publicUrl);
        
        // Create download URL with download header
        const { data: downloadData } = supabase
          .storage
          .from('pdfs')
          .getPublicUrl(pdfRecord.file_path, {
            download: true
          });
        
        setDownloadUrl(downloadData.publicUrl);

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
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {pdfUrl ? (
        <div className="flex flex-col h-full">
          <div className="bg-white shadow-sm p-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">Visualiseur PDF</h1>
            <div className="flex gap-2">
              <a 
                href={downloadUrl || pdfUrl} 
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" size="sm">
                  Télécharger
                </Button>
              </a>
              <Button
                onClick={() => window.open(pdfUrl, '_blank')}
                variant="outline"
                size="sm"
              >
                Ouvrir dans un nouvel onglet
              </Button>
              <Button
                onClick={() => navigate('/admin')}
                variant="outline"
                size="sm"
              >
                Retour
              </Button>
            </div>
          </div>
          <div className="flex-grow p-4">
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full rounded-lg shadow-lg"
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-600">
                  Votre navigateur ne peut pas afficher le PDF directement.
                </p>
                <div className="flex gap-2">
                  <a 
                    href={downloadUrl || pdfUrl} 
                    download
                    className="inline-block"
                  >
                    <Button>Télécharger le PDF</Button>
                  </a>
                  <Button
                    onClick={() => window.open(pdfUrl, '_blank')}
                    variant="outline"
                  >
                    Ouvrir dans un nouvel onglet
                  </Button>
                </div>
              </div>
            </object>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Chargement du document...</p>
        </div>
      )}
    </div>
  );
};