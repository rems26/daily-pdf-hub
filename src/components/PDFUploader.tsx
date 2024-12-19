import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limite

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
        console.log("Début de l'upload...");
        console.log("Fichier à uploader:", file.name, file.size, "bytes");

        // Upload du fichier dans le bucket storage
        const { data, error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(`${Date.now()}_${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        console.log("Résultat upload:", data, uploadError);

        if (uploadError) {
          console.error("Erreur upload détaillée:", uploadError);
          throw uploadError;
        }

        // Création de l'entrée dans la table pdfs
        const { error: insertError } = await supabase
          .from('pdfs')
          .insert({
            name: file.name,
            file_path: data.path,
            user_id: 'admin'
          });

        console.log("Résultat insertion DB:", insertError);

        if (insertError) {
          console.error("Erreur insertion DB détaillée:", insertError);
          throw insertError;
        }

        toast({
          title: "Succès",
          description: "Le PDF a été uploadé avec succès",
        });

        navigate(`/pdf/${data.path}`);
      } catch (error) {
        console.error("Erreur complète:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'upload du fichier",
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