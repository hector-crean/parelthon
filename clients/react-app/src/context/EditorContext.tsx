import { AppState, EditMode } from "@/models/canvas";
import { ReactNode, createContext, useContext, useState } from "react";

const DEFAULT_CANVAS_STATE: AppState = { kind: "edit", mode: EditMode.None };

interface IAppState {
  appState: AppState;
  setAppState: (state: AppState) => void;
}
export const AppStateContext = createContext<IAppState>({
  appState: DEFAULT_CANVAS_STATE,
  setAppState: (state) => {},
});

interface AppProviderProps {
  children: ReactNode;
}
export const AppStateProvider = ({ children }: AppProviderProps) => {
  const [appState, setAppState] = useState<AppState>(DEFAULT_CANVAS_STATE);

  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useCanvasContext must be used inside the CanvasProvider");
  }

  return context;
};
