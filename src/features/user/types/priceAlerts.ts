export interface AlertAsset {
  symbol: string;
  name: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  assetSymbol: string;
  direction: string;
  targetPriceUsd: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
  asset: AlertAsset;
}

export interface AlertsMeta {
  count: number;
  active: number;
}

export interface PriceAlertsResponse {
  data: PriceAlert[];
  meta: AlertsMeta;
}

export interface CreatePriceAlertRequest {
  assetSymbol: string;
  direction: string;
  targetPriceUsd: number;
}

interface UpdatePriceAlertRequestData {
  direction: string;
  targetPriceUsd: number;
  isActive: boolean;
}

export type UpdatePriceAlertRequest = Partial<UpdatePriceAlertRequestData>;

export interface UpdatedPriceAlert {
  id: string;
  assetSymbol: string;
  direction: string;
  targetPriceUsd: number;
  isActive: boolean;
  triggeredAt: string | null;
}

export interface UpdatePriceAlertResponse {
  data: UpdatedPriceAlert;
}

export interface CreatedPriceAlert {
  id: string;
  userId: string;
  assetSymbol: string;
  direction: string;
  targetPriceUsd: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
}

export interface CreatePriceAlertResponse {
  data: CreatedPriceAlert;
}

export interface DeleteResult {
  deleted: boolean;
}

export interface DeleteResponse {
  data: DeleteResult;
}
