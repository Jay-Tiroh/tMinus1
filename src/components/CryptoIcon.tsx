import { SvgUri } from "react-native-svg";

const BASE_URL = "https://crypto-api-guwm.onrender.com/assets";

type CryptoIconProps = {
  symbol: string;
  size?: number;
  fill?: string;
};

export function CryptoIcon({
  symbol,
  size = 32,
  fill = "white",
}: CryptoIconProps) {
  const uri = `${BASE_URL}/${symbol.toLowerCase()}.svg`;

  return <SvgUri uri={uri} width={size} height={size} fill={fill} />;
}
