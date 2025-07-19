import { Chambre } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, X, Check } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ChambreCardProps {
  chambre: Chambre
  onView: (id: number) => void
  onEdit: (chambre: Chambre) => void
  onDelete: (id: number) => void
  loading?: boolean
}

export const ChambreCard: React.FC<ChambreCardProps> = ({ chambre, onView, onEdit, onDelete, loading }) => {
  const router = useRouter()
  const unpaidMonths = chambre.months.filter((month) => !month.paye).length
  const totalMonths = chambre.months.length
  const totalOwed = chambre.months
    .filter((month) => !month.paye)
    .reduce((sum, month) => sum + month.montantEau + month.montantElectricite + month.fraisLouer, 0)

  return (
    <Card className="hover:shadow-lg transition-shadow border-2 border-gray-100">
      <div className="relative w-full h-40 mb-2 rounded-t-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {chambre.tenantIdFront ? (
          <img
            src={chambre.tenantIdFront}
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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-primary truncate max-w-[70%]">{chambre.name}</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/chambres/${chambre.id}/edit`)} size="sm" variant="outline" disabled={loading}>Modifier</Button>
            <Button onClick={() => onDelete(chambre.id)} size="sm" variant="destructive" disabled={loading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-1 truncate">{chambre.description}</p>
        <p className="text-gray-500 text-xs truncate">{chambre.property}</p>
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
        <Button onClick={() => router.push(`/chambres/${chambre.id}`)} className="w-full mt-4 text-lg px-6 py-3" variant="outline" disabled={loading}>
          <Eye className="w-4 h-4 mr-2" />
          Voir Détails
        </Button>
      </CardContent>
    </Card>
  )
} 