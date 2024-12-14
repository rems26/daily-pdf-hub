import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { compressToEncodedURIComponent } from 'lz-string';

const MAX_FILE_SIZE = 50 * 1024; // 50 Ko limite

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
        description: "Le fichier est trop volumineux. La taille maximum est de 50 Ko.",
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
          // Compression plus agressive
          const compressedData = compressToEncodedURIComponent(base64Data);
          if (compressedData.length > 4000) {
            throw new Error("PDF trop volumineux même après compression");
          }
          navigate(`/pdf/${compressedData}`);
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Le PDF est trop volumineux pour être partagé via URL. Veuillez choisir un fichier plus petit.",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
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
            <p className="text-xs text-gray-500">PDF uniquement (max 50 Ko)</p>
          </div>
        </label>
      </div>
    </div>
  );
};