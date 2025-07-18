"use client"

import { useState } from "react"
import { Zap, Droplets, Save, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/app/hooks/use-toast"

interface Tenant {
  id: number
  name: string
  property: string
  monthlyRecords?: Array<{
    month: string
    electricity?: number
    water?: number
  }>
}

interface UtilityTrackerProps {
  tenants: Tenant[]
  onUpdateRecord: (tenantId: number, month: string, recordData: any) => void
}

export default function UtilityTracker({ tenants, onUpdateRecord }: UtilityTrackerProps) {
  const { toast } = useToast()
  const [selectedTenant, setSelectedTenant] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [utilityData, setUtilityData] = useState({
    electricity: "",
    water: "",
  })

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

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId)
    setUtilityData({ electricity: "", water: "" })
    setSelectedMonth("")
  }

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month)
    if (selectedTenant) {
      const tenant = tenants.find((t) => t.id.toString() === selectedTenant)
      const existingRecord = tenant?.monthlyRecords?.find((record) => record.month === month)
      if (existingRecord) {
        setUtilityData({
          electricity: existingRecord.electricity?.toString() || "",
          water: existingRecord.water?.toString() || "",
        })
      } else {
        setUtilityData({ electricity: "", water: "" })
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUtilityData({
      ...utilityData,
      [field]: value,
    })
  }

  const handleSave = () => {
    if (!selectedTenant || !selectedMonth) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un locataire et un mois",
        variant: "destructive",
      })
      return
    }

    const recordData = {
      electricity: Number.parseFloat(utilityData.electricity) || 0,
      water: Number.parseFloat(utilityData.water) || 0,
    }

    onUpdateRecord(Number.parseInt(selectedTenant), selectedMonth, recordData)

    toast({
      title: "Succès",
      description: "Relevés des services publics mis à jour avec succès!",
    })
  }

  const currentMonth = new Date().toISOString().slice(0, 7)
  const totalElectricity = tenants.reduce((sum, tenant) => {
    const currentRecord = tenant.monthlyRecords?.find((record) => record.month === currentMonth)
    return sum + (currentRecord?.electricity || 0)
  }, 0)

  const totalWater = tenants.reduce((sum, tenant) => {
    const currentRecord = tenant.monthlyRecords?.find((record) => record.month === currentMonth)
    return sum + (currentRecord?.water || 0)
  }, 0)

  const selectedTenantData = tenants.find((t) => t.id.toString() === selectedTenant)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suivi des Services Publics</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Services Mensuels</p>
          <p className="text-2xl font-bold">{totalElectricity + totalWater} €</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Utility Input Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mettre à jour les Relevés</CardTitle>
              <CardDescription>Saisir les dernières consommations d'électricité et d'eau</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-select">Sélectionner le locataire</Label>
                  <Select value={selectedTenant} onValueChange={handleTenantSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un locataire..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id.toString()}>
                          {tenant.name} - {tenant.property}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month-select">Sélectionner le mois</Label>
                  <Select value={selectedMonth} onValueChange={handleMonthSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un mois..." />
                    </SelectTrigger>
                    <SelectContent>
                      {generateMonthOptions().map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedTenant && selectedMonth && (
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
                      value={utilityData.electricity}
                      onChange={(e) => handleInputChange("electricity", e.target.value)}
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
                      value={utilityData.water}
                      onChange={(e) => handleInputChange("water", e.target.value)}
                      placeholder="45.00"
                    />
                  </div>
                </div>
              )}

              {selectedTenant && selectedMonth && (
                <Button onClick={handleSave} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les Relevés
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Électricité</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalElectricity} €</div>
              <p className="text-xs text-muted-foreground">Toutes propriétés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eau</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWater} €</div>
              <p className="text-xs text-muted-foreground">Toutes propriétés</p>
            </CardContent>
          </Card>

          {selectedTenantData && selectedMonth && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locataire Sélectionné</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{selectedTenantData.name}</div>
                <p className="text-xs text-muted-foreground mb-2">{selectedTenantData.property}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(selectedMonth + "-01").toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Électricité:</span>
                    <span>{utilityData.electricity || 0} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eau:</span>
                    <span>{utilityData.water || 0} €</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>
                      {(Number.parseFloat(utilityData.electricity) || 0) + (Number.parseFloat(utilityData.water) || 0)}{" "}
                      €
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
