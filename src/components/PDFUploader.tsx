import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        localStorage.setItem('currentPDF', base64);
        localStorage.setItem('pdfLastUpdate', new Date().toISOString());
        setPdfUrl(base64);
        console.log("PDF sauvegardé dans le localStorage");
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
    const timestamp = Date.now();
    const pdfUrl = `/pdf/${timestamp}`;
    window.open(pdfUrl, '_blank');
    toast({
      title: "Succès",
      description: "PDF ouvert dans un nouvel onglet",
    });
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
      
      {pdfUrl && (
        <div className="flex justify-end mb-4">
          <Button onClick={handleViewPDF} variant="outline" className="gap-2">
            Voir le PDF
          </Button>
        </div>
      )}
    </div>
  );
};