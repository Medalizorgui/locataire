-- CreateTable
CREATE TABLE "Chambre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "property" TEXT NOT NULL,
    "tenantName" TEXT,
    "tenantPhone" TEXT,
    "tenantIdFront" TEXT,
    "tenantIdBack" TEXT,
    "tenantContract" TEXT,

    CONSTRAINT "Chambre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Month" (
    "id" SERIAL NOT NULL,
    "chambreId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "compteurEau" INTEGER NOT NULL,
    "montantEau" DOUBLE PRECISION NOT NULL,
    "compteurElectricite" INTEGER NOT NULL,
    "montantElectricite" DOUBLE PRECISION NOT NULL,
    "fraisLouer" DOUBLE PRECISION NOT NULL,
    "paye" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Month" ADD CONSTRAINT "Month_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
