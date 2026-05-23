import ThemedBottomSheet from "@/components/ThemedBottomSheet";
import TradeDetails from "@/components/trades/TradeDetails";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSheet } from "@/store/slices/BottomSheetSlice";
import BottomSheet from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";

export default function SheetController() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useAppDispatch();

  // SheetController resolves it
  const sheetRegistry: Record<string, React.ReactNode> = {
    tradeDetails: <TradeDetails />,
  };

  // inside SheetController
  const { isOpen, contentId } = useAppSelector((state) => state.bottomSheet);
  const content = contentId ? sheetRegistry[contentId] : null;

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  return (
    <ThemedBottomSheet
      ref={bottomSheetRef}
      onClose={() => dispatch(closeSheet())}
    >
      {content}
    </ThemedBottomSheet>
  );
}
