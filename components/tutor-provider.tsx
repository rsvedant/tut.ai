import React from "react";

// Create a context for tutor selection
const TutorContext = React.createContext<
    | {
          selectedTutor: string | null;
          setSelectedTutor: React.Dispatch<React.SetStateAction<string | null>>;
      }
    | undefined
>(undefined);

// Create a provider component
export function TutorProvider({ children }: { children: React.ReactNode }) {
    const [selectedTutor, setSelectedTutor] = React.useState<string | null>(
        null,
    );

    return (
        <TutorContext.Provider value={{ selectedTutor, setSelectedTutor }}>
            {children}
        </TutorContext.Provider>
    );
}

// Custom hook to use the tutor context
export function useTutor() {
    const context = React.useContext(TutorContext);

    if (context === undefined) {
        throw new Error("useTutor must be used within a TutorProvider");
    }

    return context;
}
