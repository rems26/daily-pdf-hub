import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { compressToEncodedURIComponent } from 'lz-string';

const MAX_FILE_SIZE = 500 * 1024; // 500 Ko limite

export const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    console.log("Taille du fichier:", file.size / 1024, "Ko");
    console.log("Type du fichier:", file.type);
    
    if (file.size > MAX_FILE_SIZE) {
      console.log("Fichier trop volumineux");
      toast({
        title: "Erreur",
        description: "Le fichier est trop volumineux. La taille maximum est de 500 Ko.",
        variant: "destructive",
      });
      return;
    }

    if (file.type === "application/pdf") {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        
        try {
          console.log("Taille des données base64:", base64Data.length);
          // On compresse directement les données base64 sans modification
          const compressedData = compressToEncodedURIComponent(base64Data);
          console.log("Taille des données compressées:", compressedData.length);
          
          navigate(`/pdf/${compressedData}`);
        } catch (error) {
          console.error("Erreur de compression:", error);
          toast({
            title: "Erreur",
            description: "Erreur lors de la compression du PDF. Veuillez réessayer avec un fichier plus petit.",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Type de fichier non valide:", file.type);
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
            <p className="text-xs text-gray-500">PDF uniquement (max 500 Ko)</p>
          </div>
        </label>
      </div>
    </div>
  );
};