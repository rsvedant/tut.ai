import React, { useEffect } from "react";

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
    // Initialize state from localStorage if available
    const [selectedTutor, setSelectedTutor] = React.useState<string | null>(
        null,
    );

    // Load from localStorage on initial render
    useEffect(() => {
        const savedTutor = localStorage.getItem("selectedTutor");

        if (savedTutor) {
            setSelectedTutor(savedTutor);
        }
    }, []);

    // Save to localStorage when selectedTutor changes
    useEffect(() => {
        if (selectedTutor) {
            localStorage.setItem("selectedTutor", selectedTutor);
        }
    }, [selectedTutor]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = React.useMemo(
        () => ({ selectedTutor, setSelectedTutor }),
        [selectedTutor],
    );

    return (
        <TutorContext.Provider value={contextValue}>
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
