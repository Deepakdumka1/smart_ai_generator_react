graph TB
    %% Main Application Structure
    subgraph APP["Smart AI Generator React"]
        Entry[/"Entry Point (index.js)"/]
        App["App.js (Root Component)"]
        
        %% Context Providers
        subgraph Contexts["Global State Management"]
            AuthCtx["AuthContext Provider"]
            ChatCtx["ChatBotContext Provider"]
        end
        
        %% Firebase Integration
        subgraph Firebase["Firebase Services"]
            Auth["Authentication"]
            DB["Firestore Database"]
            Storage["Cloud Storage"]
        end
        
        %% Components Layer
        subgraph Components["Core Components"]
            direction LR
            Layout["Layout Components"]
            Interactive["Interactive Components"]
            Display["Data Display"]
            User["User Components"]
        end
        
        %% Pages Layer
        subgraph Pages["Application Pages"]
            direction LR
            Public["Public Pages"]
            Protected["Protected Pages"]
            Error["Error Pages"]
        end
        
        %% Supporting Modules
        subgraph Utils["Supporting Modules"]
            direction LR
            Helpers["Utility Functions"]
            Data["Data Storage"]
            Styles["Styling"]
        end
    end
    
    %% Connections and Flow
    Entry --> App
    App --> Contexts
    App --> Components
    App --> Pages
    
    AuthCtx --> Firebase
    Protected --> AuthCtx
    Interactive --> ChatCtx
    
    %% Component Relationships
    Layout --> Pages
    Interactive --> Pages
    Display --> Pages
    User --> Protected
    
    %% Data Flow
    Firebase --> AuthCtx
    Firebase --> Data
    Helpers --> Components
    Styles --> Components
    
    %% Styling
    classDef contextClass fill:#e1f3d8,stroke:#82c91e
    classDef componentClass fill:#dbe4ff,stroke:#4c6ef5
    classDef pageClass fill:#fff3bf,stroke:#fab005
    classDef firebaseClass fill:#ffe3e3,stroke:#fa5252
    classDef utilClass fill:#f3d9fa,stroke:#be4bdb
    
    class Contexts contextClass
    class Components componentClass
    class Pages pageClass
    class Firebase firebaseClass
    class Utils utilClass