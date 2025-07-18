"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, FileText, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/app/hooks/use-toast"

interface AddTenantFormProps {
  onAddTenant: (tenant: any) => void
}

export default function AddTenantForm({ onAddTenant }: AddTenantFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    property: "",
    monthlyRent: "",
    rentalFees: "",
    moveInDate: "",
    phone: "",
    email: "",
    notes: "",
  })

  const [images, setImages] = useState({
    idFront: null as string | null,
    idBack: null as string | null,
    contract: null as string | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = (type: "idFront" | "idBack" | "contract", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImages({
        ...images,
        [type]: e.target?.result as string,
      })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (type: "idFront" | "idBack" | "contract") => {
    setImages({
      ...images,
      [type]: null,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.property || !formData.monthlyRent) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    const newTenant = {
      ...formData,
      monthlyRent: Number.parseFloat(formData.monthlyRent),
      rentalFees: Number.parseFloat(formData.rentalFees) || 0,
      ...images,
    }

    onAddTenant(newTenant)

    // Reset form
    setFormData({
      name: "",
      property: "",
      monthlyRent: "",
      rentalFees: "",
      moveInDate: "",
      phone: "",
      email: "",
      notes: "",
    })
    setImages({
      idFront: null,
      idBack: null,
      contract: null,
    })

    toast({
      title: "Succès",
      description: "Locataire ajouté avec succès!",
    })
  }

  const ImageUploadCard = ({
    type,
    title,
    icon: Icon,
  }: {
    type: "idFront" | "idBack" | "contract"
    title: string
    icon: any
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images[type] ? (
          <div className="relative">
            <img
              src={images[type]! || "/placeholder.svg"}
              alt={title}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeImage(type)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Cliquez pour télécharger ou glissez-déposez</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(type, file)
              }}
              className="hidden"
              id={`upload-${type}`}
            />
            <Label htmlFor={`upload-${type}`} className="cursor-pointer">
              <Button type="button" variant="outline" size="sm">
                Choisir un fichier
              </Button>
            </Label>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un Nouveau Locataire</CardTitle>
        <CardDescription>Saisir les informations du locataire et télécharger les documents requis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Entrez le nom complet du locataire"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property">Adresse de la propriété *</Label>
              <Input
                id="property"
                name="property"
                value={formData.property}
                onChange={handleInputChange}
                placeholder="123 Rue Principale, Apt 2A"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Loyer mensuel (€) *</Label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                value={formData.monthlyRent}
                onChange={handleInputChange}
                placeholder="1200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rentalFees">Frais de location (€)</Label>
              <Input
                id="rentalFees"
                name="rentalFees"
                type="number"
                value={formData.rentalFees}
                onChange={handleInputChange}
                placeholder="150"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moveInDate">Date d'emménagement</Label>
              <Input
                id="moveInDate"
                name="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="locataire@email.com"
              />
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Téléchargement de Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUploadCard type="idFront" title="Pièce d'identité (Recto)" icon={CreditCard} />
              <ImageUploadCard type="idBack" title="Pièce d'identité (Verso)" icon={CreditCard} />
              <ImageUploadCard type="contract" title="Contrat" icon={FileText} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Toute information supplémentaire sur le locataire..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Ajouter le Locataire
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
