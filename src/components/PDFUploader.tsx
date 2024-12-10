import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
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

    // Simulation d'upload - Dans une vraie application, envoyez le fichier à un serveur
    toast({
      title: "Succès",
      description: "Le PDF a été mis à jour avec succès",
    });
    setSelectedFile(null);
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