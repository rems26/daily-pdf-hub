import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      console.log("Fichier PDF sélectionné:", file.name);
      setSelectedFile(file);
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64PDF = e.target?.result as string;
      console.log("PDF converti en base64, premiers caractères:", base64PDF.substring(0, 50));
      
      try {
        localStorage.setItem('currentPDF', base64PDF);
        localStorage.setItem('pdfLastUpdate', new Date().toISOString());
        console.log("PDF sauvegardé dans le localStorage");
        
        toast({
          title: "Succès",
          description: "Le PDF a été mis à jour avec succès",
        });
        setSelectedFile(null);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde dans le localStorage:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la sauvegarde du PDF",
          variant: "destructive",
        });
      }
    };

    reader.onerror = (error) => {
      console.error("Erreur lors de la lecture du fichier:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la lecture du fichier",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(selectedFile);
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
            <p className="text-xs text-gray-500">PDF uniquement</p>
          </div>
        </label>
      </div>
      {selectedFile && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            Fichier sélectionné : {selectedFile.name}
          </p>
          <Button onClick={handleUpload}>Mettre à jour le PDF</Button>
        </div>
      )}
    </div>
  );
};