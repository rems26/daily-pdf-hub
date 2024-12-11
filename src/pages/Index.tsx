import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/LoginForm";
import { PDFUploader } from "@/components/PDFUploader";
import { PDFViewer } from "@/components/PDFViewer";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    setIsAdmin(false);
    setShowViewer(true);
  };

  const handleViewerClick = () => {
    setShowViewer(true);
  };

  const handleAdminClick = () => {
    setShowViewer(false);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?view=pdf`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans votre presse-papiers.",
    });
  };

  // Vérifier si on arrive via un lien de partage
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'pdf') {
      setShowViewer(true);
    }
  }, []);

  if (!isAdmin && !showViewer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">DailyDocView</h1>
          <p className="text-gray-600 mb-4">Choisissez votre mode d'accès</p>
          <div className="space-x-4">
            <Button onClick={handleViewerClick} variant="outline">
              Consulter le document
            </Button>
            <Button onClick={handleAdminClick} variant="default">
              Administration
            </Button>
          </div>
        </div>
        {!showViewer && (
          <div className="mt-8">
            <LoginForm onLogin={setIsAdmin} />
          </div>
        )}
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
            <div className="space-x-2">
              <Button onClick={handleShare} variant="outline">
                Partager le lien
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Déconnexion
              </Button>
            </div>
          </div>
          <PDFUploader />
        </div>
      </div>
    );
  }

  return <PDFViewer />;
};

export default Index;