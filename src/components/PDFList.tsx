import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PDF {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
}

export const PDFList = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPDFs = async () => {
    try {
      const { data, error } = await supabase
        .from("pdfs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPdfs(data || []);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des PDFs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePDF = async (pdf: PDF) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("pdfs")
        .remove([pdf.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("pdfs")
        .delete()
        .eq("id", pdf.id);

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Le PDF a été supprimé",
      });

      fetchPDFs();
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le PDF",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (pdfs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun PDF uploadé pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-xl font-semibold">PDFs uploadés</h2>
      <div className="space-y-2">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium">{pdf.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(pdf.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/pdf/${pdf.file_path}`)}
                title="Voir le PDF"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deletePDF(pdf)}
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
