graph TD
    %% Component Hierarchy
    App["App.js"]
    
    %% Layout Components
    App -->|Contains| Header["Header"]
    App -->|Contains| Footer["Footer"]
    App -->|Contains| Main["Main Content"]
    
    %% Main Content Branch
    Main -->|Routes to| Home["Home Page"]
    Main -->|Routes to| Topics["Topics Page"]
    Main -->|Routes to| Quiz["Quiz Page"]
    Main -->|Routes to| Results["Results Page"]
    Main -->|Routes to| Profile["Profile Page"]
    
    %% Components in Pages
    Topics -->|Uses| TopicCard["TopicCard"]
    Quiz -->|Uses| QuestionCard["QuestionCard"]
    Quiz -->|Uses| ProgressBar["ProgressBar"]
    Results -->|Uses| ResultChart["ResultChart"]
    
    %% Global Components
    App -->|Floating| ChatBot["ChatBot"]
    ChatBot -->|Toggle| ChatBotButton["ChatBotButton"]
    
    %% Styling
    classDef page fill:#fff3bf,stroke:#fab005
    classDef component fill:#dbe4ff,stroke:#4c6ef5
    classDef global fill:#e1f3d8,stroke:#82c91e
    
    class Home,Topics,Quiz,Results,Profile page
    class TopicCard,QuestionCard,ProgressBar,ResultChart component
    class ChatBot,ChatBotButton global