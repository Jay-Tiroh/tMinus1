import { useLocalSearchParams, useRouter } from "expo-router";

type AssetSubroute =
  | "alert"
  | "asset"
  | "action"
  | "execute"
  | "order-book"
  | "quote"
  | "recent-trades";

type AssetRouteParams = {
  asset?: string;
} & Record<string, string>;

export function useAssetRoute() {
  const router = useRouter();
  const { asset: currentAsset } = useLocalSearchParams<{ asset: string }>();

  const push = (subroute: AssetSubroute, params?: AssetRouteParams) => {
    const { asset, ...rest } = params ?? {};
    router.push({
      pathname: `/(tabs)/trades/[asset]/${subroute}`,
      params: { asset: asset ?? currentAsset, ...rest },
    });
  };

  return push;
}
