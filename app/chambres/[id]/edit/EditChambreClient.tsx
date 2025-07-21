"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/app/hooks/use-toast";
import { X } from "lucide-react";

export default function EditChambreClient({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">
          Erreur: L'identifiant de la chambre (id) est manquant ou invalide.
        </p>
      </div>
    );
  }
  const router = useRouter();
  const { toast } = useToast();
  const [chambre, setChambre] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChambre() {
      setLoading(true);
      const res = await fetch(`/api/chambres/${id}`);
      const data = await res.json();
      setChambre(data);
      setForm({
        name: data?.name || "",
        description: data?.description || "",
        property: data?.property || "",
        tenantName: data?.tenantName || "",
        tenantPhone: data?.tenantPhone || "",
        tenantIdFront: data?.tenantIdFront || null,
        tenantIdBack: data?.tenantIdBack || null,
        tenantContract: data?.tenantContract || null,
      });
      setLoading(false);
    }
    fetchChambre();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!chambre || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Chambre non trouvée</p>
            <Button onClick={() => router.back()} className="mt-4">Retour</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleImageUpload = (type: "tenantIdFront" | "tenantIdBack" | "tenantContract", file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm({
        ...form,
        [type]: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Stricter client-side validation
    if (!form.name || !form.property) {
      toast({
        title: "Erreur",
        description: "Le nom et la propriété sont obligatoires.",
        variant: "destructive"
      });
      return;
    }
    const payload = {
      name: form.name,
      property: form.property,
      description: form.description || null,
      tenantName: form.tenantName || null,
      tenantPhone: form.tenantPhone || null,
      tenantIdFront: form.tenantIdFront || null,
      tenantIdBack: form.tenantIdBack || null,
      tenantContract: form.tenantContract || null,
    };
    const res = await fetch(`/api/chambres/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast({ title: "Succès", description: "Chambre modifiée avec succès!" });
      // Force reload to ensure fresh data
      router.replace(`/chambres/${chambre.id}`);
    } else {
      let errorMsg = "Erreur lors de la modification de la chambre";
      try {
        const errorData = await res.json();
        if (errorData && errorData.error) errorMsg = errorData.error;
      } catch {}
      toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          Retour
        </Button>
        <Card className="shadow-xl border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-blue-900">Modifier Chambre</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-blue-800">Nom *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Chambre 1"
                    className="mt-1 border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <Label className="text-blue-800">Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Grande chambre lumineuse avec balcon."
                    className="mt-1 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label className="text-blue-800">Propriété *</Label>
                  <Input
                    value={form.property}
                    onChange={(e) => setForm({ ...form, property: e.target.value })}
                    placeholder="123 Rue Principale"
                    className="mt-1 border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-blue-800">Nom du Locataire</Label>
                  <Input
                    value={form.tenantName}
                    onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
                    placeholder="Jean Dupont"
                    className="mt-1 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label className="text-blue-800">Téléphone du Locataire</Label>
                  <Input
                    value={form.tenantPhone}
                    onChange={(e) => setForm({ ...form, tenantPhone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                    className="mt-1 border-blue-200 focus:border-blue-400"
                  />
                </div>
                {/* Image Uploads */}
                <div className="sm:col-span-2 md:col-span-1">
                  <Label>Pièce d'identité (Recto)</Label>
                  {form.tenantIdFront ? (
                    <div className="relative">
                      <img
                        src={form.tenantIdFront}
                        alt="ID Front"
                        className="w-full h-32 object-cover rounded border cursor-pointer"
                        onClick={() => setImagePreview(form.tenantIdFront || "")}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setForm({ ...form, tenantIdFront: null })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("tenantIdFront", file);
                        }}
                        className="hidden"
                      />
                      <span className="block mt-2">Choisir fichier</span>
                    </label>
                  )}
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                  <Label>Pièce d'identité (Verso)</Label>
                  {form.tenantIdBack ? (
                    <div className="relative">
                      <img
                        src={form.tenantIdBack}
                        alt="ID Back"
                        className="w-full h-32 object-cover rounded border cursor-pointer"
                        onClick={() => setImagePreview(form.tenantIdBack || "")}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setForm({ ...form, tenantIdBack: null })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("tenantIdBack", file);
                        }}
                        className="hidden"
                      />
                      <span className="block mt-2">Choisir fichier</span>
                    </label>
                  )}
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                  <Label>Contrat</Label>
                  {form.tenantContract ? (
                    <div className="relative">
                      <img
                        src={form.tenantContract}
                        alt="Contract"
                        className="w-full h-32 object-cover rounded border cursor-pointer"
                        onClick={() => setImagePreview(form.tenantContract || "")}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setForm({ ...form, tenantContract: null })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload("tenantContract", file);
                        }}
                        className="hidden"
                      />
                      <span className="block mt-2">Choisir fichier</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button type="submit" className="text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3">Enregistrer les Modifications</Button>
                <Button type="button" onClick={() => router.push(`/chambres/${chambre.id}`)} className="text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3" variant="outline">Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {imagePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setImagePreview(null)}
                aria-label="Fermer"
              >
                ×
              </button>
              <img src={imagePreview} alt="Document" className="max-w-full max-h-[80vh] mx-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 