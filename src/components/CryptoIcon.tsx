import { SvgCssUri } from "react-native-svg/css";

const BASE_URL = "https://crypto-api-guwm.onrender.com/assets";

type CryptoIconProps = {
  symbol: string;
  size?: number;
};

export function CryptoIcon({ symbol, size = 32 }: CryptoIconProps) {
  const uri = `${BASE_URL}/${symbol.toLowerCase()}.svg`;

  return <SvgCssUri uri={uri} width={size} height={size} />;
}
