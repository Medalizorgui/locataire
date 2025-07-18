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
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{tenant.name}</CardTitle>
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
