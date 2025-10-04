export interface WarehouseGQL {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface ProductGQL {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface KpisArgs {
  range?: string;
}

export interface KPIGQL {
  date: string;
  stock: number;
  demand: number;
}

export interface ProductsQueryData {
  products: ProductGQL[];
}

export interface WarehousesQueryData {
  warehouses: WarehouseGQL[];
}

export interface KPIsQueryData {
  kpis: KPIGQL[];
}

export interface UpdateDemandVariables {
  productId: string;
  newDemand: number;
}

export interface TransferStockVariables {
  productId: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  quantity: number;
}


