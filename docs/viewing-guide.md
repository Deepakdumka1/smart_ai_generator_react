# Viewing Project Documentation Diagrams

## Option 1: Using Visual Studio Code (Recommended)

1. Install the "Markdown Preview Mermaid Support" extension:
   - Open VS Code
   - Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
   - Type: `ext install bierner.markdown-mermaid`
   - Click Install

2. View the diagrams:
   - Open any `.md` file containing the diagrams
   - Press `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac) to open preview
   - Or click the "Open Preview" icon in the top-right corner

## Option 2: Online Mermaid Live Editor

1. Visit [Mermaid Live Editor](https://mermaid.live)
2. Copy the diagram code (everything between ```mermaid and ```)
3. Paste into the editor
4. View the rendered diagram in real-time

## Option 3: GitHub Integration

If you push these files to GitHub:
1. GitHub natively supports Mermaid diagrams
2. They will automatically render in your repository
3. No additional setup required

## Option 4: Local HTML File

Create a local HTML file to view the diagrams:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Project Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>
    <div class="mermaid">
        <!-- Paste diagram code here -->
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true });
    </script>
</body>
</html>
```

## Maintaining Documentation

### File Structure
```
docs/
├── architecture-diagram.md    # Overall project architecture
├── user-flow-diagram.md      # User interaction flows
├── component-hierarchy.md    # Component relationships
└── viewing-guide.md         # This guide
```

### Best Practices

1. **Version Control**:
   - Keep documentation in version control with your code
   - Update diagrams when making significant changes

2. **Organization**:
   - Keep related diagrams in the same file
   - Use clear, descriptive filenames
   - Add comments to explain complex parts

3. **Updates**:
   - Review and update diagrams during sprint reviews
   - Keep diagrams in sync with code changes
   - Document major architectural decisions

## Command Line Setup (Optional)

If you want to generate static images from the diagrams:

1. Install Mermaid CLI:
```bash
npm install -g @mermaid-js/mermaid-cli
```

2. Generate PNG files:
```bash
mmdc -i input.md -o output.png
```

## Need Help?

- Check [Mermaid's official documentation](https://mermaid-js.github.io/mermaid/#/)
- Review the diagram syntax in existing files
- Update diagrams using the live editor before committing changes