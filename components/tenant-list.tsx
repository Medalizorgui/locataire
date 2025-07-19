"use client"

import { useRouter } from "next/navigation"
import { Eye, Phone, Mail, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Tenant {
  id: number
  name: string
  property: string
  monthlyRent: number
  rentalFees?: number
  moveInDate: string
  phone: string
  email: string
  monthlyRecords?: Array<{
    month: string
    rentPaid: boolean
  }>
  idFront?: string // Added for the new image display
}

interface TenantListProps {
  tenants: Tenant[]
}

export default function TenantList({ tenants }: TenantListProps) {
  const router = useRouter()

  const TenantCard = ({ tenant }: { tenant: Tenant }) => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentRecord = tenant.monthlyRecords?.find((record) => record.month === currentMonth)
    const rentStatus = currentRecord?.rentPaid

    return (
      <Card className="hover:shadow-2xl transition-shadow rounded-2xl overflow-hidden border-2 border-blue-100 bg-white group">
        <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
          {tenant.idFront ? (
            <img
              src={tenant.idFront}
              alt="ID Front"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V8.25A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25v8.25M3 16.5A2.25 2.25 0 0 0 5.25 18.75h13.5A2.25 2.25 0 0 0 21 16.5M3 16.5l4.5-4.5a2.25 2.25 0 0 1 3.182 0l.568.568a2.25 2.25 0 0 0 3.182 0l2.068-2.068a2.25 2.25 0 0 1 3.182 0L21 13.5"/></svg>
              <span className="text-xs mt-2">Aucune image</span>
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-blue-900 group-hover:text-blue-700 transition-colors">{tenant.name}</CardTitle>
              <CardDescription>{tenant.property}</CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="secondary">{tenant.monthlyRent} €/mois</Badge>
              {tenant.rentalFees && <p className="text-xs text-muted-foreground mt-1">+ {tenant.rentalFees} € frais</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Emménagement: {new Date(tenant.moveInDate).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{tenant.phone || "Pas de téléphone"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{tenant.email || "Pas d'e-mail"}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>
                Loyer ce mois:{" "}
                <Badge variant={rentStatus ? "default" : "destructive"} className="ml-1">
                  {rentStatus ? "Payé" : "Non payé"}
                </Badge>
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => router.push(`/locataire/${tenant.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir les détails
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tous les Locataires</h2>
        <Badge variant="outline">{tenants.length} total</Badge>
      </div>

      {tenants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Aucun locataire ajouté pour le moment. Ajoutez votre premier locataire pour commencer.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <TenantCard key={tenant.id} tenant={tenant} />
          ))}
        </div>
      )}
    </div>
  )
}
