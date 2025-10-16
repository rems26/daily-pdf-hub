-- Créer le bucket de stockage pour les PDFs (public pour la lecture)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Créer la table pour stocker les métadonnées des PDFs
CREATE TABLE IF NOT EXISTS public.pdfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS sur la table pdfs
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Lecture publique des métadonnées PDFs
CREATE POLICY "Public can view pdfs metadata"
ON public.pdfs FOR SELECT
TO public
USING (true);

-- Politique RLS : Les utilisateurs authentifiés peuvent insérer
CREATE POLICY "Authenticated users can insert pdfs"
ON public.pdfs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Politique RLS : Les utilisateurs peuvent supprimer leurs propres PDFs
CREATE POLICY "Users can delete own pdfs"
ON public.pdfs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Politique RLS Storage : Lecture publique des fichiers
CREATE POLICY "Public read access to pdfs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pdfs');

-- Politique RLS Storage : Upload authentifié
CREATE POLICY "Authenticated users can upload pdfs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pdfs');

-- Politique RLS Storage : Suppression par propriétaire
CREATE POLICY "Users can delete own pdf files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pdfs' AND auth.uid() = owner);