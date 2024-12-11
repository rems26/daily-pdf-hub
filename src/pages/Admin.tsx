import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/LoginForm";
import { PDFUploader } from "@/components/PDFUploader";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    setIsAdmin(false);
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-primary">
              Console d'administration
            </h1>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
          <PDFUploader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">DailyDocView</h1>
        <p className="text-gray-600 mb-4">Administration</p>
      </div>
      <div className="mt-8">
        <LoginForm onLogin={setIsAdmin} />
      </div>
    </div>
  );
};

export default Admin;