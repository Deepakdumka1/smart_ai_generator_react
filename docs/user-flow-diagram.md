sequenceDiagram
    participant U as User
    participant P as Public Pages
    participant A as Auth System
    participant Q as Quiz System
    participant C as ChatBot
    participant DB as Database

    U->>P: Visit Website
    P->>U: Show Home/Topics

    rect rgb(240, 240, 240)
        note right of U: Authentication Flow
        U->>P: Click Login/Signup
        P->>A: Auth Request
        A->>DB: Verify/Create User
        DB-->>A: User Data
        A-->>U: Auth Success
    end

    rect rgb(230, 240, 255)
        note right of U: Quiz Flow
        U->>Q: Select Topic
        Q->>DB: Fetch Questions
        DB-->>Q: Questions Data
        Q->>U: Display Quiz
        U->>Q: Submit Answers
        Q->>DB: Store Results
        DB-->>U: Show Results
    end

    rect rgb(255, 240, 230)
        note right of U: Support Flow
        U->>C: Open ChatBot
        C->>U: Provide Assistance
    end