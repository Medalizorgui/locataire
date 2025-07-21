"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/app/hooks/use-toast";

// Types
interface Month {
  id: string;
  month: string;
  compteurEau: number;
  montantEau: number;
  compteurElectricite: number;
  montantElectricite: number;
  fraisLouer: number;
  paye: boolean;
}

interface Chambre {
  id: string;
  name: string;
  description: string;
  property: string;
  tenantName: string;
  tenantPhone: string;
  tenantIdFront?: string;
  tenantIdBack?: string;
  tenantContract?: string;
  months: Month[];
}

// Custom hooks
const useChambre = (id: string) => {
  const [chambre, setChambre] = useState<Chambre | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChambre = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/chambres/${id}`);
      if (res.ok) {
        const data = await res.json();
        setChambre(data);
      } else {
        setChambre(null);
      }
    } catch (error) {
      setChambre(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChambre();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchChambre();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchChambre]);

  return { chambre, loading, refetch: fetchChambre };
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-lg text-gray-600">Chargement...</p>
    </div>
  </div>
);

const ImageModal = ({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full mx-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <img 
          src={imageUrl} 
          alt="Document" 
          className="max-w-full max-h-[80vh] mx-auto rounded" 
        />
      </div>
    </div>
  );
};

const DocumentCard = ({ 
  title, 
  imageUrl, 
  onImageClick 
}: { 
  title: string;
  imageUrl?: string;
  onImageClick: (url: string) => void; 
}) => (
  <div>
    <h4 className="font-semibold mb-2 text-blue-800">{title}</h4>
    <img
      src={imageUrl || "/placeholder.svg"}
      alt={title}
      className="w-full h-32 object-cover rounded border cursor-pointer shadow hover:shadow-md transition-shadow"
      onClick={() => onImageClick(imageUrl || "/placeholder.svg")}
    />
  </div>
);

const UtilitySection = ({ 
  icon, 
  title, 
  bgColor, 
  borderColor, 
  textColor,
  children 
}: {
  icon: React.ReactNode;
  title: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  children: React.ReactNode;
}) => (
  <div className={`${bgColor} p-4 rounded-xl border ${borderColor}`}>
    <h4 className={`font-semibold ${textColor} mb-3 text-sm flex items-center gap-2`}>
      {icon}
      {title}
    </h4>
    {children}
  </div>
);

const FormInput = ({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  step,
  borderColor = "border-slate-200",
  focusColor = "focus:border-blue-500"
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  borderColor?: string;
  focusColor?: string;
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      name={name}
      type={type}
      required={required}
      step={step}
      className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${focusColor} focus:ring-1 focus:ring-blue-200 text-sm bg-white transition-all duration-200`}
      placeholder={placeholder}
    />
  </div>
);

const MonthCard = ({ 
  month, 
  onTogglePayment, 
  onDelete 
}: { 
  month: Month;
  onTogglePayment: (month: Month) => void;
  onDelete: (monthId: string) => void;
}) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 w-full">
        <h4 className="font-semibold text-lg w-full sm:w-auto">{month.month}</h4>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Badge variant={month.paye ? "default" : "destructive"} className="w-full sm:w-auto text-center">
            {month.paye ? "Payé" : "Non Payé"}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onTogglePayment(month)}
            className="w-full sm:w-auto text-sm"
          >
            {month.paye ? "Marquer Non Payé" : "Marquer Payé"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(month.id)}
            className="w-full sm:w-auto text-sm"
          >
            Supprimer
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <h5 className="font-semibold text-blue-800 mb-2">💧 Eau</h5>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Compteur:</span> {month.compteurEau}</div>
            <div><span className="font-medium">Montant:</span> {month.montantEau} TND</div>
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <h5 className="font-semibold text-yellow-800 mb-2">⚡ Électricité</h5>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Compteur:</span> {month.compteurElectricite}</div>
            <div><span className="font-medium">Montant:</span> {month.montantElectricite} TND</div>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <h5 className="font-semibold text-green-800 mb-2">🏠 Frais de Louer</h5>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Montant:</span> {month.fraisLouer} TND</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChambreDetailsClient({ params }: { params: { id: string } }) {
  console.log('params in client:', params);
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
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { chambre, loading, refetch } = useChambre(id);

  // Event handlers
  const handleAddMonth = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chambre) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const payload = {
        month: formData.get("month"),
        compteurEau: Number(formData.get("compteurEau")),
        montantEau: Number(formData.get("montantEau")),
        compteurElectricite: Number(formData.get("compteurElectricite")),
        montantElectricite: Number(formData.get("montantElectricite")),
        fraisLouer: Number(formData.get("fraisLouer")),
        paye: formData.get("paye") === "on",
      };
      const res = await fetch(`/api/chambres/${chambre.id}/months`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await refetch();
        toast({ title: "Succès", description: "Mois ajouté avec succès!" });
        formRef.current?.reset();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || "Erreur lors de l'ajout du mois";
        toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur réseau", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [chambre, refetch, toast]);

  const handleTogglePayment = useCallback(async (month: Month) => {
    if (!chambre) return;
    try {
      const res = await fetch(`/api/chambres/${chambre.id}/months/${month.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...month, paye: !month.paye }),
      });
      if (res.ok) {
        await refetch();
        toast({ title: "Succès", description: "Statut de paiement mis à jour!" });
      } else {
        toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur réseau", variant: "destructive" });
    }
  }, [chambre, refetch, toast]);

  const handleDeleteMonth = useCallback(async (monthId: string) => {
    if (!chambre || !window.confirm("Supprimer ce mois ?")) return;
    try {
      const res = await fetch(`/api/chambres/${chambre.id}/months/${monthId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refetch();
        toast({ title: "Succès", description: "Mois supprimé avec succès!" });
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || "Erreur lors de la suppression";
        toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur réseau", variant: "destructive" });
    }
  }, [chambre, refetch, toast]);

  if (loading) {
    return (
      <>
        <LoadingSpinner />
        <ImageModal imageUrl={imagePreview} onClose={() => setImagePreview(null)} />
      </>
    );
  }

  if (!chambre) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Chambre non trouvée</p>
              <Button onClick={() => router.back()} className="mt-4">
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
        <ImageModal imageUrl={imagePreview} onClose={() => setImagePreview(null)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
          Retour
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-1">{chambre.name}</h1>
            <p className="text-gray-600 mb-1">{chambre.description}</p>
            <p className="text-gray-600 mb-1">{chambre.property}</p>
            <p className="text-gray-600 mb-1">Locataire: {chambre.tenantName}</p>
            <p className="text-gray-600">Téléphone: {chambre.tenantPhone}</p>
          </div>
          <Button 
            onClick={() => router.push(`/chambres/${id}/edit`)} 
            variant="outline"
          >
            Modifier
          </Button>
        </div>
        {/* Documents */}
        <Card className="mb-6 shadow-xl border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DocumentCard
                title="Pièce d'identité (Recto)"
                imageUrl={chambre.tenantIdFront}
                onImageClick={setImagePreview}
              />
              <DocumentCard
                title="Pièce d'identité (Verso)"
                imageUrl={chambre.tenantIdBack}
                onImageClick={setImagePreview}
              />
              <DocumentCard
                title="Contrat"
                imageUrl={chambre.tenantContract}
                onImageClick={setImagePreview}
              />
            </div>
          </CardContent>
        </Card>
        {/* Add Month Form */}
        <div className="max-w-6xl mx-auto w-full mb-10">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800 mb-1">
                    Ajouter un Mois
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    Saisissez les informations mensuelles pour cette chambre
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <form ref={formRef} onSubmit={handleAddMonth} className="w-full">
                {/* Month and Payment Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700 text-sm">
                      Mois <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="month" 
                      required 
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm placeholder-slate-400 bg-white/80" 
                      placeholder="Janvier 2024" 
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
                      <input 
                        name="paye" 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-green-600 bg-white border-2 border-green-300 rounded focus:ring-green-500 focus:ring-2" 
                      />
                      <span className="font-semibold text-green-800">Payé ce mois</span>
                    </label>
                  </div>
                </div>
                {/* Utility Meters */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                    Compteurs et Montants
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Water */}
                    <UtilitySection
                      icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 10c0 5 3 8 7 8s7-3 7-8c0-5-3-8-7-8zm0 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>}
                      title="Eau"
                      bgColor="bg-blue-50/50"
                      borderColor="border-blue-100"
                      textColor="text-blue-800"
                    >
                      <div className="space-y-3">
                        <FormInput
                          name="compteurEau"
                          label="Compteur Eau"
                          type="number"
                          required
                          placeholder="1250"
                          borderColor="border-blue-200"
                          focusColor="focus:border-blue-400"
                        />
                        <FormInput
                          name="montantEau"
                          label="Montant Eau (TND)"
                          type="number"
                          step="0.01"
                          required
                          placeholder="45.50"
                          borderColor="border-blue-200"
                          focusColor="focus:border-blue-400"
                        />
                      </div>
                    </UtilitySection>
                    {/* Electricity */}
                    <UtilitySection
                      icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.5 9.5L8 19l6.5-10.5H11.5zM13 3L7.5 12h3L13 21l6.5-9h-3L13 3z"/></svg>}
                      title="Électricité"
                      bgColor="bg-yellow-50/50"
                      borderColor="border-yellow-100"
                      textColor="text-yellow-800"
                    >
                      <div className="space-y-3">
                        <FormInput
                          name="compteurElectricite"
                          label="Compteur Électricité"
                          type="number"
                          required
                          placeholder="8750"
                          borderColor="border-yellow-200"
                          focusColor="focus:border-yellow-400"
                        />
                        <FormInput
                          name="montantElectricite"
                          label="Montant Électricité (TND)"
                          type="number"
                          step="0.01"
                          required
                          placeholder="120.00"
                          borderColor="border-yellow-200"
                          focusColor="focus:border-yellow-400"
                        />
                      </div>
                    </UtilitySection>
                    {/* Rent */}
                    <UtilitySection
                      icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 10c0 5 3 8 7 8s7-3 7-8c0-5-3-8-7-8zm0 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>}
                      title="Loyer"
                      bgColor="bg-purple-50/50"
                      borderColor="border-purple-100"
                      textColor="text-purple-800"
                    >
                      <FormInput
                        name="fraisLouer"
                        label="Frais de Louer (TND)"
                        type="number"
                        step="0.01"
                        required
                        placeholder="150.00"
                        borderColor="border-purple-200"
                        focusColor="focus:border-purple-400"
                      />
                    </UtilitySection>
                    {/* Submit Button */}
                    <div className="flex items-end justify-center lg:justify-start">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Ajout en cours...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ajouter le Mois
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Months List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tous les Mois</CardTitle>
          </CardHeader>
          <CardContent>
            {chambre.months.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun mois ajouté</p>
            ) : (
              <div className="space-y-4">
                {chambre.months.map((month) => (
                  <MonthCard
                    key={month.id}
                    month={month}
                    onTogglePayment={handleTogglePayment}
                    onDelete={handleDeleteMonth}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ImageModal imageUrl={imagePreview} onClose={() => setImagePreview(null)} />
    </div>
  );
}