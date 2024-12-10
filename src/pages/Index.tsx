import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { PDFUploader } from "@/components/PDFUploader";
import { PDFViewer } from "@/components/PDFViewer";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showViewer, setShowViewer] = useState(true);

  if (!isAdmin && !showViewer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">DailyDocView</h1>
          <p className="text-gray-600">Portail administrateur</p>
        </div>
        <LoginForm onLogin={setIsAdmin} />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-primary">
              Console d'administration
            </h1>
            <Button onClick={() => setIsAdmin(false)} variant="outline">
              Déconnexion
            </Button>
          </div>
          <PDFUploader />
        </div>
      </div>
    );
  }

  return <PDFViewer />;
};

export default Index;