"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Mail, Calendar, DollarSign, FileText, Zap, Droplets, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/app/hooks/use-toast"

// Mock data - in a real app, this would come from props or API
const mockTenants = [
  {
    id: 1,
    name: "Jean Dupont",
    property: "123 Rue Principale, Apt 2A",
    monthlyRent: 1200,
    rentalFees: 150,
    moveInDate: "2024-01-15",
    phone: "+33 1 23 45 67 89",
    email: "jean.dupont@email.com",
    idFront: "/placeholder.svg?height=200&width=300",
    idBack: "/placeholder.svg?height=200&width=300",
    contract: "/placeholder.svg?height=400&width=300",
    monthlyRecords: [
      {
        month: "2024-01",
        electricity: 150,
        water: 45,
        rentPaid: true,
        rentDate: "2024-01-05",
      },
      {
        month: "2024-02",
        electricity: 165,
        water: 50,
        rentPaid: true,
        rentDate: "2024-02-03",
      },
      {
        month: "2024-03",
        electricity: 140,
        water: 42,
        rentPaid: false,
        rentDate: null,
      },
    ],
  },
]

export default function TenantDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState("")
  const [monthlyData, setMonthlyData] = useState({
    electricity: "",
    water: "",
    rentPaid: false,
  })

  const tenant = mockTenants.find((t) => t.id.toString() === params.id)

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Locataire non trouvé</p>
            <Button onClick={() => router.back()} className="mt-4">
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month)
    const existingRecord = tenant.monthlyRecords.find((record) => record.month === month)
    if (existingRecord) {
      setMonthlyData({
        electricity: existingRecord.electricity?.toString() || "",
        water: existingRecord.water?.toString() || "",
        rentPaid: existingRecord.rentPaid || false,
      })
    } else {
      setMonthlyData({
        electricity: "",
        water: "",
        rentPaid: false,
      })
    }
  }

  const handleSaveMonthlyData = () => {
    if (!selectedMonth) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un mois",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would update the data
    toast({
      title: "Succès",
      description: "Données mensuelles mises à jour avec succès!",
    })
  }

  const generateMonthOptions = () => {
    const months = []
    const currentDate = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthString = date.toISOString().slice(0, 7)
      const monthName = date.toLocaleDateString("fr-FR", { year: "numeric", month: "long" })
      months.push({ value: monthString, label: monthName })
    }
    return months
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux locataires
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tenant.name}</h1>
              <p className="text-gray-600">{tenant.property}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {tenant.monthlyRent} €/mois
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">+ {tenant.rentalFees} € frais</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="informations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="historique">Historique Mensuel</TabsTrigger>
            <TabsTrigger value="gestion">Gestion Mensuelle</TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span>{tenant.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span>{tenant.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span>Emménagement: {new Date(tenant.moveInDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Détails Financiers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      Loyer mensuel:
                    </span>
                    <span className="font-semibold">{tenant.monthlyRent} €</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      Frais de location:
                    </span>
                    <span className="font-semibold">{tenant.rentalFees} €</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-semibold">Total mensuel:</span>
                    <span className="font-bold text-lg">{tenant.monthlyRent + tenant.rentalFees} €</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Pièce d'identité (Recto)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tenant.idFront ? (
                    <img
                      src={tenant.idFront || "/placeholder.svg"}
                      alt="Pièce d'identité recto"
                      className="w-full h-48 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center text-gray-500">
                      Aucune image téléchargée
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Pièce d'identité (Verso)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tenant.idBack ? (
                    <img
                      src={tenant.idBack || "/placeholder.svg"}
                      alt="Pièce d'identité verso"
                      className="w-full h-48 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center text-gray-500">
                      Aucune image téléchargée
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Contrat de Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tenant.contract ? (
                    <img
                      src={tenant.contract || "/placeholder.svg"}
                      alt="Contrat de location"
                      className="w-full h-48 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center text-gray-500">
                      Aucune image téléchargée
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historique" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Paiements et Services</CardTitle>
                <CardDescription>Suivi mensuel des loyers et consommations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenant.monthlyRecords
                    .sort((a, b) => b.month.localeCompare(a.month))
                    .map((record) => (
                      <div key={record.month} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">
                            {new Date(record.month + "-01").toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                            })}
                          </h4>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              {record.electricity} €
                            </span>
                            <span className="flex items-center gap-1">
                              <Droplets className="w-4 h-4" />
                              {record.water} €
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            {record.rentPaid ? (
                              <Badge variant="default" className="bg-green-500">
                                <Check className="w-3 h-3 mr-1" />
                                Payé
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <X className="w-3 h-3 mr-1" />
                                Non payé
                              </Badge>
                            )}
                          </div>
                          {record.rentDate && (
                            <p className="text-xs text-muted-foreground">
                              Payé le {new Date(record.rentDate).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gestion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion Mensuelle</CardTitle>
                <CardDescription>Mettre à jour les données pour un mois spécifique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="month-select">Sélectionner le mois</Label>
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => handleMonthSelect(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choisir un mois...</option>
                    {generateMonthOptions().map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMonth && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="electricity" className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Électricité (€)
                        </Label>
                        <Input
                          id="electricity"
                          type="number"
                          step="0.01"
                          value={monthlyData.electricity}
                          onChange={(e) => setMonthlyData({ ...monthlyData, electricity: e.target.value })}
                          placeholder="150.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="water" className="flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          Eau (€)
                        </Label>
                        <Input
                          id="water"
                          type="number"
                          step="0.01"
                          value={monthlyData.water}
                          onChange={(e) => setMonthlyData({ ...monthlyData, water: e.target.value })}
                          placeholder="45.00"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rent-paid"
                        checked={monthlyData.rentPaid}
                        onChange={(e) => setMonthlyData({ ...monthlyData, rentPaid: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="rent-paid">Loyer payé ce mois-ci</Label>
                    </div>

                    <Button onClick={handleSaveMonthlyData} className="w-full">
                      Sauvegarder les données du mois
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
