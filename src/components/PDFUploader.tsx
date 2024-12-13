import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const timestamp = new Date().getTime();
        const key = `pdf_${timestamp}`;
        localStorage.setItem(key, base64);
        localStorage.setItem(`${key}_name`, file.name);
        console.log("PDF sauvegardé dans le localStorage");
        toast({
          title: "Succès",
          description: "PDF uploadé avec succès",
        });
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

  const handleViewPDF = () => {
    if (selectedFile) {
      const timestamp = new Date().getTime();
      const key = `pdf_${timestamp}`;
      navigate(`/pdf/${key}`);
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
            <p className="text-xs text-gray-500">PDF uniquement</p>
          </div>
        </label>
      </div>
      
      {selectedFile && (
        <div className="flex justify-end mb-4">
          <Button onClick={handleViewPDF} variant="outline" className="gap-2">
            Voir le PDF
          </Button>
        </div>
      )}
    </div>
  );
};