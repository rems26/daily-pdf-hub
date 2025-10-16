import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onLogin: (success: boolean) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin(true);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur DailyDocView",
        });
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Input
          type="password"
          placeholder="Mot de passe"
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