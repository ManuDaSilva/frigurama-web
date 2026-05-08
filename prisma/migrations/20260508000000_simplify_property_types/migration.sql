-- Simplificar PropertyType: de 9 tipos granulares a 6 categorías

-- 1. Crear el nuevo enum con las 6 categorías finales
CREATE TYPE "public"."PropertyType_new" AS ENUM (
  'Apartamento',
  'CasaVilla',
  'EdificioOficina',
  'TerrenoNave',
  'Local',
  'Garaje'
);

-- 2. Convertir la columna a texto temporalmente para poder actualizar los valores
ALTER TABLE "public"."Listing" ALTER COLUMN type TYPE text USING type::text;

-- 3. Migrar registros existentes a las nuevas categorías
UPDATE "public"."Listing" SET type = 'Apartamento'     WHERE type IN ('Piso', 'Atico', 'Estudio', 'Apartamento');
UPDATE "public"."Listing" SET type = 'CasaVilla'        WHERE type IN ('Casa', 'Adosado');
UPDATE "public"."Listing" SET type = 'EdificioOficina'  WHERE type = 'Oficina';
UPDATE "public"."Listing" SET type = 'TerrenoNave'      WHERE type = 'Terreno';

-- 4. Volver a tipar la columna con el nuevo enum
ALTER TABLE "public"."Listing"
  ALTER COLUMN type TYPE "public"."PropertyType_new"
  USING type::"public"."PropertyType_new";

-- 5. Eliminar el enum viejo y renombrar el nuevo
DROP TYPE "public"."PropertyType";
ALTER TYPE "public"."PropertyType_new" RENAME TO "PropertyType";
