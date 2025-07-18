"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, Upload, X, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/app/hooks/use-toast"
import type { Chambre, Month } from "@/types"
import { Modal } from "@/components/ui/modal"

type NewChambre = {
  name: string
  description: string
  property: string
  tenantName: string
  tenantPhone: string
  tenantIdFront: string | null
  tenantIdBack: string | null
  tenantContract: string | null
}

type NewMonth = {
  month: string
  compteurEau: string
  montantEau: string
  compteurElectricite: string
  montantElectricite: string
  fraisLouer: string
  paye: boolean
}

export default function RentalManagement() {
  const { toast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedChambre, setSelectedChambre] = useState<number | null>(null)
  const [chambres, setChambres] = useState<Chambre[]>([])
  const [loading, setLoading] = useState(true)
  const [newChambre, setNewChambre] = useState<NewChambre>({
    name: "",
    description: "",
    property: "",
    tenantName: "",
    tenantPhone: "",
    tenantIdFront: null,
    tenantIdBack: null,
    tenantContract: null,
  })
  const [newMonth, setNewMonth] = useState<NewMonth>({
    month: "",
    compteurEau: "",
    montantEau: "",
    compteurElectricite: "",
    montantElectricite: "",
    fraisLouer: "",
    paye: false,
  })
  // Add state for editing chambre and month
  const [editChambre, setEditChambre] = useState<Chambre | null>(null)
  // Remove editMonth state and modal
  // Move Modifier button for chambre to top right in details view
  // Use a larger, centered modal for chambre edit
  // Fix upload button: make the whole area clickable
  // Add state for image preview modal
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchChambres()
  }, [])

  const fetchChambres = async () => {
    setLoading(true)
    const res = await fetch("/api/chambres")
    const data = await res.json()
    setChambres(data)
    setLoading(false)
  }

  const handleImageUpload = (type: "tenantIdFront" | "tenantIdBack" | "tenantContract", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setNewChambre({
        ...newChambre,
        [type]: e.target?.result as string,
      })
    }
    reader.readAsDataURL(file)
  }

  const addChambre = async () => {
    if (!newChambre.name || !newChambre.property) {
      toast({
        title: "Erreur",
        description: "Nom et propriété sont obligatoires",
        variant: "destructive",
      })
      return
    }
    const res = await fetch("/api/chambres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChambre),
    })
    if (res.ok) {
      fetchChambres()
      setNewChambre({
        name: "",
        description: "",
        property: "",
        tenantName: "",
        tenantPhone: "",
        tenantIdFront: null,
        tenantIdBack: null,
        tenantContract: null,
      })
      setShowAddForm(false)
      toast({ title: "Succès", description: "Chambre ajoutée avec succès!" })
    } else {
      toast({ title: "Erreur", description: "Erreur lors de l'ajout de la chambre", variant: "destructive" })
    }
  }

  const addMonth = async (chambreId: number) => {
    if (
      !newMonth.month ||
      !newMonth.compteurEau ||
      !newMonth.montantEau ||
      !newMonth.compteurElectricite ||
      !newMonth.montantElectricite ||
      !newMonth.fraisLouer
    ) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      })
      return
    }
    const res = await fetch(`/api/chambres/${chambreId}/months`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: newMonth.month,
        compteurEau: Number.parseInt(newMonth.compteurEau),
        montantEau: Number.parseFloat(newMonth.montantEau),
        compteurElectricite: Number.parseInt(newMonth.compteurElectricite),
        montantElectricite: Number.parseFloat(newMonth.montantElectricite),
        fraisLouer: Number.parseFloat(newMonth.fraisLouer),
        paye: newMonth.paye,
      }),
    })
    if (res.ok) {
      fetchChambres()
      setNewMonth({
        month: "",
        compteurEau: "",
        montantEau: "",
        compteurElectricite: "",
        montantElectricite: "",
        fraisLouer: "",
        paye: false,
      })
      toast({ title: "Succès", description: "Mois ajouté avec succès!" })
    } else {
      toast({ title: "Erreur", description: "Erreur lors de l'ajout du mois", variant: "destructive" })
    }
  }

  // PATCH month payment status
  const togglePayment = async (chambre: Chambre, monthIndex: number) => {
    const month = chambre.months[monthIndex]
    const res = await fetch(`/api/chambres/${chambre.id}/months/${month.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...month,
        paye: !month.paye,
      }),
    })
    if (res.ok) {
      await fetchChambres()
      toast({ title: "Succès", description: "Statut de paiement mis à jour!" })
    } else {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour du paiement", variant: "destructive" })
    }
  }

  const deleteChambre = async (id: number) => {
    const res = await fetch(`/api/chambres/${id}`, { method: "DELETE" })
    if (res.ok) {
      fetchChambres()
      toast({ title: "Succès", description: "Chambre supprimée!" })
    } else {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" })
    }
  }

  // Refactor ImageUpload for full clickability
  const ImageUpload: React.FC<{
    type: "tenantIdFront" | "tenantIdBack" | "tenantContract";
    title: string;
    value: string | null;
    onChange?: (value: string | null) => void;
  }> = ({ type, title, value, onChange }) => (
    <div className="space-y-2">
      <Label>{title}</Label>
      {value ? (
        <div className="relative">
          <img src={value || "/placeholder.svg"} alt={title} className="w-full h-32 object-cover rounded border cursor-pointer" onClick={() => setImagePreview(value || "/placeholder.svg")} />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onChange ? onChange(null) : setNewChambre({ ...newChambre, [type]: null })}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label className="block border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (ev) => {
                  if (onChange) onChange(ev.target?.result as string)
                  else setNewChambre({ ...newChambre, [type]: ev.target?.result as string })
                }
                reader.readAsDataURL(file)
              }
            }}
            className="hidden"
          />
          <span className="block mt-2">Choisir fichier</span>
        </label>
      )}
    </div>
  )

  if (selectedChambre) {
    const chambre = chambres.find((c) => c.id === selectedChambre)
    if (!chambre) return null

    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Button onClick={() => setSelectedChambre(null)} className="mb-4 text-lg px-6 py-3">
                ← Retour
              </Button>
              <h1 className="text-2xl font-bold">{chambre.name}</h1>
              <p className="text-gray-600">{chambre.description}</p>
              <p className="text-gray-600">{chambre.property}</p>
              <p className="text-gray-600">Locataire: {chambre.tenantName}</p>
              <p className="text-gray-600">Téléphone: {chambre.tenantPhone}</p>
            </div>
            <Button onClick={() => setEditChambre(chambre)} className="text-lg px-6 py-3" variant="outline">Modifier</Button>
          </div>

          {/* Documents */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Pièce d'identité (Recto)</h4>
                  <img
                    src={chambre.tenantIdFront || "/placeholder.svg"}
                    alt="ID Front"
                    className="w-full h-32 object-cover rounded border cursor-pointer"
                    onClick={() => setImagePreview(chambre.tenantIdFront || "/placeholder.svg")}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pièce d'identité (Verso)</h4>
                  <img
                    src={chambre.tenantIdBack || "/placeholder.svg"}
                    alt="ID Back"
                    className="w-full h-32 object-cover rounded border cursor-pointer"
                    onClick={() => setImagePreview(chambre.tenantIdBack || "/placeholder.svg")}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contrat</h4>
                  <img
                    src={chambre.tenantContract || "/placeholder.svg"}
                    alt="Contract"
                    className="w-full h-32 object-cover rounded border cursor-pointer"
                    onClick={() => setImagePreview(chambre.tenantContract || "/placeholder.svg")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ajouter un mois */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ajouter un Mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <div>
                  <Label>Mois</Label>
                  <Input
                    value={newMonth.month}
                    onChange={(e) => setNewMonth({ ...newMonth, month: e.target.value })}
                    placeholder="Janvier 2024"
                  />
                </div>
                <div>
                  <Label>Compteur Eau</Label>
                  <Input
                    type="number"
                    value={newMonth.compteurEau}
                    onChange={(e) => setNewMonth({ ...newMonth, compteurEau: e.target.value })}
                    placeholder="1250"
                  />
                </div>
                <div>
                  <Label>Montant Eau (TND)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newMonth.montantEau}
                    onChange={(e) => setNewMonth({ ...newMonth, montantEau: e.target.value })}
                    placeholder="45.50"
                  />
                </div>
                <div>
                  <Label>Compteur Électricité</Label>
                  <Input
                    type="number"
                    value={newMonth.compteurElectricite}
                    onChange={(e) => setNewMonth({ ...newMonth, compteurElectricite: e.target.value })}
                    placeholder="8750"
                  />
                </div>
                <div>
                  <Label>Montant Électricité (TND)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newMonth.montantElectricite}
                    onChange={(e) => setNewMonth({ ...newMonth, montantElectricite: e.target.value })}
                    placeholder="120.00"
                  />
                </div>
                <div>
                  <Label>Frais de Louer (TND)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newMonth.fraisLouer}
                    onChange={(e) => setNewMonth({ ...newMonth, fraisLouer: e.target.value })}
                    placeholder="150.00"
                  />
                </div>
                <div>
                  <Label>Statut</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="paye"
                      checked={newMonth.paye}
                      onChange={(e) => setNewMonth({ ...newMonth, paye: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="paye">Payé</Label>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => addMonth(chambre.id)}
                className="mt-4 text-lg px-6 py-3"
              >
                Ajouter le Mois
              </Button>
            </CardContent>
          </Card>

          {/* Liste des mois */}
          <Card>
            <CardHeader>
              <CardTitle>Tous les Mois</CardTitle>
            </CardHeader>
            <CardContent>
              {chambre.months.length === 0 ? (
                <p className="text-gray-500">Aucun mois ajouté</p>
              ) : (
                <div className="space-y-4">
                  {chambre.months.map((month, index) => (
                    <div key={month.id} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-lg">{month.month}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={month.paye ? "default" : "destructive"} className="text-sm">
                            {month.paye ? "Payé" : "Non Payé"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePayment(chambre, index)}
                            className="ml-2 text-base px-4 py-2"
                          >
                            {month.paye ? "Marquer Non Payé" : "Marquer Payé"}
                          </Button>
                          {/* Remove the month edit button */}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Eau */}
                        <div className="bg-blue-50 p-3 rounded">
                          <h5 className="font-semibold text-blue-800 mb-2">💧 Eau</h5>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-medium">Compteur:</span> {month.compteurEau}
                            </div>
                            <div>
                              <span className="font-medium">Montant:</span> {month.montantEau} TND
                            </div>
                          </div>
                        </div>

                        {/* Électricité */}
                        <div className="bg-yellow-50 p-3 rounded">
                          <h5 className="font-semibold text-yellow-800 mb-2">⚡ Électricité</h5>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-medium">Compteur:</span> {month.compteurElectricite}
                            </div>
                            <div>
                              <span className="font-medium">Montant:</span> {month.montantElectricite} TND
                            </div>
                          </div>
                        </div>

                        {/* Frais de Louer */}
                        <div className="bg-green-50 p-3 rounded">
                          <h5 className="font-semibold text-green-800 mb-2">🏠 Frais de Louer</h5>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-medium">Montant:</span> {month.fraisLouer} TND
                            </div>
                            <div className="font-semibold text-green-800 border-t pt-1 mt-2">
                              <span>Total:</span>{" "}
                              {(month.montantEau + month.montantElectricite + month.fraisLouer).toFixed(2)} TND
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Chambres</h1>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="text-lg px-6 py-3">
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? "Annuler" : "Ajouter Chambre"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nouvelle Chambre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Nom *</Label>
                    <Input
                      value={newChambre.name}
                      onChange={(e) => setNewChambre({ ...newChambre, name: e.target.value })}
                      placeholder="Chambre 1"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newChambre.description}
                      onChange={(e) => setNewChambre({ ...newChambre, description: e.target.value })}
                      placeholder="Grande chambre lumineuse avec balcon."
                    />
                  </div>
                  <div>
                    <Label>Propriété *</Label>
                    <Input
                      value={newChambre.property}
                      onChange={(e) => setNewChambre({ ...newChambre, property: e.target.value })}
                      placeholder="123 Rue Principale"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Nom du Locataire</Label>
                    <Input
                      value={newChambre.tenantName}
                      onChange={(e) => setNewChambre({ ...newChambre, tenantName: e.target.value })}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <Label>Téléphone du Locataire</Label>
                    <Input
                      value={newChambre.tenantPhone}
                      onChange={(e) => setNewChambre({ ...newChambre, tenantPhone: e.target.value })}
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                  <ImageUpload type="tenantIdFront" title="Pièce d'identité (Recto)" value={newChambre.tenantIdFront} />
                  <ImageUpload type="tenantIdBack" title="Pièce d'identité (Verso)" value={newChambre.tenantIdBack} />
                  <ImageUpload type="tenantContract" title="Contrat" value={newChambre.tenantContract} />
                </div>

                <Button onClick={addChambre} className="text-lg px-6 py-3">Ajouter la Chambre</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <p>Chargement des chambres...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chambres.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Aucune chambre. Cliquez sur "Ajouter Chambre" pour commencer.</p>
                </CardContent>
              </Card>
            ) : (
              chambres.map((chambre) => {
                const unpaidMonths = chambre.months.filter((month) => !month.paye).length
                const totalMonths = chambre.months.length
                const totalOwed = chambre.months
                  .filter((month) => !month.paye)
                  .reduce((sum, month) => sum + month.montantEau + month.montantElectricite + month.fraisLouer, 0)

                return (
                  <Card key={chambre.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{chambre.name}</CardTitle>
                      <p className="text-gray-600">{chambre.description}</p>
                      <p className="text-gray-600">{chambre.property}</p>
                      <p className="text-gray-600">Locataire: {chambre.tenantName}</p>
                      <p className="text-gray-600">Téléphone: {chambre.tenantPhone}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Mois enregistrés:</span> {totalMonths}
                        </p>
                        {totalMonths > 0 && (
                          <>
                            <p>
                              <span className="font-medium">Dernier mois:</span>{" "}
                              {chambre.months[chambre.months.length - 1].month}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Statut:</span>
                              {unpaidMonths > 0 ? (
                                <div className="space-y-1">
                                  <Badge variant="destructive">{unpaidMonths} mois non payés</Badge>
                                  <p className="text-xs text-red-600">Dû: {totalOwed.toFixed(2)} TND</p>
                                </div>
                              ) : (
                                <Badge variant="default">
                                  <Check className="w-3 h-3 mr-1" />
                                  Tout payé
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <Button onClick={() => setSelectedChambre(chambre.id)} className="w-full mt-4 text-lg px-6 py-3" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir Détails
                      </Button>
                      <Button onClick={() => setEditChambre(chambre)} className="ml-2" size="sm">Modifier</Button>
                      <Button onClick={() => deleteChambre(chambre.id)} className="w-full mt-4 text-lg px-6 py-3" variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Supprimer Chambre
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Render Modal for editing chambre */}
      <Modal isOpen={!!editChambre} onClose={() => setEditChambre(null)} title="Modifier Chambre">
        {/* Form fields for chambre, pre-filled with editChambre values, on change update local state */}
        {/* On save, send PUT to /api/chambres/[id], then refresh and close modal */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Nom *</Label>
              <Input
                value={editChambre?.name}
                onChange={(e) => setEditChambre({ ...editChambre!, name: e.target.value })}
                placeholder="Chambre 1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={editChambre?.description}
                onChange={(e) => setEditChambre({ ...editChambre!, description: e.target.value })}
                placeholder="Grande chambre lumineuse avec balcon."
              />
            </div>
            <div>
              <Label>Propriété *</Label>
              <Input
                value={editChambre?.property}
                onChange={(e) => setEditChambre({ ...editChambre!, property: e.target.value })}
                placeholder="123 Rue Principale"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Nom du Locataire</Label>
              <Input
                value={editChambre?.tenantName}
                onChange={(e) => setEditChambre({ ...editChambre!, tenantName: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <Label>Téléphone du Locataire</Label>
              <Input
                value={editChambre?.tenantPhone}
                onChange={(e) => setEditChambre({ ...editChambre!, tenantPhone: e.target.value })}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            <ImageUpload type="tenantIdFront" title="Pièce d'identité (Recto)" value={editChambre?.tenantIdFront ?? null} onChange={v => setEditChambre(editChambre ? { ...editChambre, tenantIdFront: v } : null)} />
            <ImageUpload type="tenantIdBack" title="Pièce d'identité (Verso)" value={editChambre?.tenantIdBack ?? null} onChange={v => setEditChambre(editChambre ? { ...editChambre, tenantIdBack: v } : null)} />
            <ImageUpload type="tenantContract" title="Contrat" value={editChambre?.tenantContract ?? null} onChange={v => setEditChambre(editChambre ? { ...editChambre, tenantContract: v } : null)} />
          </div>

          <Button onClick={async () => {
            if (!editChambre) return;
            const res = await fetch(`/api/chambres/${editChambre.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(editChambre),
            });
            if (res.ok) {
              await fetchChambres();
              setEditChambre(null);
              toast({ title: "Succès", description: "Chambre modifiée avec succès!" });
            } else {
              toast({ title: "Erreur", description: "Erreur lors de la modification de la chambre", variant: "destructive" });
            }
          }} className="text-lg px-6 py-3">Enregistrer les Modifications</Button>
          <Button onClick={() => setEditChambre(null)} className="text-lg px-6 py-3" variant="outline">Annuler</Button>
        </div>
      </Modal>

      {/* Render image preview modal */}
      <Modal isOpen={!!imagePreview} onClose={() => setImagePreview(null)}>
        <img src={imagePreview || ""} alt="Document" className="max-w-full max-h-[80vh] mx-auto" />
      </Modal>
    </div>
  )
}
