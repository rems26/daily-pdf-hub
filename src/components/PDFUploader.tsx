import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limite

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace special chars with underscore
};

export const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Erreur",
        description: "Le fichier est trop volumineux. La taille maximum est de 5 MB.",
        variant: "destructive",
      });
      return;
    }

    if (file.type === "application/pdf") {
      setSelectedFile(file);
      try {
        console.log("Starting file upload process...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User error:", userError);
          throw userError;
        }

        if (!user) {
          console.error("No user found");
          throw new Error("Vous devez être connecté pour uploader un fichier");
        }

        console.log("User found:", user.id);

        // Create sanitized filename
        const sanitizedFileName = sanitizeFileName(file.name);
        const filePath = `${Date.now()}_${sanitizedFileName}`;

        console.log("Uploading file:", filePath);

        // Upload file to storage bucket with explicit content-type
        const { data: storageData, error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'application/pdf'
          });

        if (uploadError) {
          console.error("Storage error:", uploadError);
          throw uploadError;
        }

        console.log("File uploaded successfully:", storageData);

        // Insert record into pdfs table with explicit user_id
        const { data: insertData, error: insertError } = await supabase
          .from('pdfs')
          .insert([{
            name: file.name,
            file_path: storageData.path,
            user_id: user.id,
            created_at: new Date().toISOString()
          }])
          .select('*')
          .single();

        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }

        console.log("Record inserted successfully:", insertData);

        toast({
          title: "Succès",
          description: "Le PDF a été uploadé avec succès",
        });

        if (insertData) {
          navigate(`/pdf/${storageData.path}`);
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'upload du fichier",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center w-full max-w-lg p-6 border-2 border-dashed rounded-lg">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Cliquez pour uploader</span> ou
              glissez-déposez
            </p>
            <p className="text-xs text-gray-500">PDF uniquement (max 5 MB)</p>
          </div>
        </label>
      </div>
    </div>
  );
};