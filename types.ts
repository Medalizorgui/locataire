export type Month = {
  id: number;
  month: string;
  compteurEau: number;
  montantEau: number;
  compteurElectricite: number;
  montantElectricite: number;
  fraisLouer: number;
  paye: boolean;
  chambreId: number;
};

export type Chambre = {
  id: number;
  name: string;
  description: string;
  property: string;
  tenantName: string;
  tenantPhone: string;
  tenantIdFront: string | null;
  tenantIdBack: string | null;
  tenantContract: string | null;
  months: Month[];
}; 