import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onLogin: (success: boolean) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une vraie application, utilisez une vraie authentification
    if (password === "admin123") {
      onLogin(true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur DailyDocView",
      });
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Mot de passe administrateur"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Se connecter
      </Button>
    </form>
  );
};