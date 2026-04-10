# Planning Guide

A comprehensive Pokemon Trading Card Master Set planner that helps collectors organize and track complete sets, including official set releases, Pokemon-specific collections, and evolution chains with all card variants.

**Experience Qualities**:
1. **Organized** - Clear categorization and flexible sorting options make it easy to plan complex collections across hundreds of card variants
2. **Comprehensive** - Every variant matters; the app accounts for reverse holos, special patterns, promos, and collaboration releases
3. **Practical** - Generates binder-ready checklists with print-friendly formatting and sensible ordering systems

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This app requires managing large datasets of Pokemon cards with multiple attributes, complex filtering logic, multiple view states (set builder, pokemon selector, output preview), and sophisticated sorting algorithms for different collection strategies.

## Essential Features

### Master Set Type Selection
- **Functionality**: Choose between Official Set, Pokemon Collection, or Evolution Chain collection types
- **Purpose**: Different collection strategies require different card selection and ordering logic
- **Trigger**: Primary selection on the main builder screen
- **Progression**: Select type → Configure options → Choose cards → Generate list
- **Success criteria**: Type changes dynamically update available options and preview structure

### Card Variant Filter
- **Functionality**: Toggle between "All Variants" (holos, reverse holos, patterns) and "Unique Art Only"
- **Purpose**: Some collectors want every printing variant, others only care about unique artwork
- **Trigger**: Toggle switch in the builder configuration
- **Progression**: Toggle switch → Card list updates → Duplicate art variants hidden/shown
- **Success criteria**: Card count accurately reflects variant inclusion preference

### Pokemon/Set Selector
- **Functionality**: Search and select Pokemon names or official Set names with autocomplete
- **Purpose**: Define the scope of the master set collection
- **Trigger**: Type-ahead search field
- **Progression**: Type search term → See suggestions → Select option → Added to collection scope
- **Success criteria**: Can add multiple Pokemon or select a single Set; clear visual of selections

### Sort Order Configuration
- **Functionality**: Choose ordering: Set Order (for official sets), Chronological, Grouped by Set, or Evolution Chain Order
- **Purpose**: Different binder organization strategies suit different collection types
- **Trigger**: Dropdown or radio selection
- **Progression**: Select sort method → Preview updates with new ordering
- **Success criteria**: Cards reorder instantly; evolution chains group correctly

### Binder-Ready Checklist Output
- **Functionality**: Generate formatted checklist with card names, set info, variant details, and checkboxes
- **Purpose**: Provides a printable/viewable reference for tracking collection progress
- **Trigger**: View/Generate button
- **Progression**: Configure collection → Generate list → View formatted output → Print or save
- **Success criteria**: Clean formatting, all variants listed, proper ordering applied

### Collection Save/Load
- **Functionality**: Persist master set configurations for later reference
- **Purpose**: Collectors work on sets over months/years and need to save progress
- **Trigger**: Save button stores current configuration
- **Progression**: Configure set → Save with name → Load from saved list → Continue tracking
- **Success criteria**: All settings and selections persist and restore accurately

## Edge Case Handling

- **No Results Found**: Display helpful message suggesting alternative search terms or browse by set
- **Empty Configuration**: Prompt user to select at least one Pokemon or Set before generating
- **Large Sets**: Show card count warnings for sets with 500+ variants; paginate if needed
- **Missing Data**: Gracefully handle cards without complete variant information
- **Evolution Chains**: Handle Pokemon with split evolutions (Eevee) or regional variants intelligently

## Design Direction

The design should evoke the excitement and nostalgia of collecting Pokemon cards while maintaining professional organization tools. Think vibrant Pokemon-inspired colors, playful typography that nods to the TCG aesthetic, and smooth interactions that feel rewarding. The interface should feel like a premium deck-building tool mixed with the joy of opening a booster pack.

## Color Selection

**Primary Color**: Electric yellow (oklch(0.85 0.15 95)) - Captures Pikachu's iconic color and represents energy, excitement, and the Pokemon brand
**Secondary Colors**: 
- Deep blue (oklch(0.45 0.12 250)) - Professional, trustworthy, represents water-type cards and adds stability
- Vibrant red (oklch(0.60 0.20 25)) - Represents fire-type energy and important actions/highlights
**Accent Color**: Holographic purple (oklch(0.65 0.18 290)) - Evokes the shimmer of rare holographic cards, used for CTAs and special indicators
**Foreground/Background Pairings**:
- Background (White oklch(0.98 0 0)): Dark text (oklch(0.20 0.02 270)) - Ratio 12.8:1 ✓
- Primary (Electric Yellow oklch(0.85 0.15 95)): Dark overlay text (oklch(0.15 0.02 95)) - Ratio 10.2:1 ✓
- Accent (Holographic Purple oklch(0.65 0.18 290)): White text (oklch(0.98 0 0)) - Ratio 5.1:1 ✓
- Deep Blue (oklch(0.45 0.12 250)): White text (oklch(0.98 0 0)) - Ratio 7.8:1 ✓

## Font Selection

Typefaces should balance playful Pokemon energy with the clarity needed for detailed checklists and card information.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Lilita One Bold/36px/tight letter spacing - Playful, bold header reminiscent of Pokemon logos
  - H2 (Section Headers): Space Grotesk Bold/24px/normal spacing - Modern, technical feel for organization
  - H3 (Card Set Names): Space Grotesk SemiBold/18px/normal spacing
  - Body (Descriptions/Lists): Inter Regular/16px/relaxed line height (1.6) - Clean, readable for checklists
  - Small (Card Details): Inter Regular/14px/normal - Detailed variant information

## Animations

Animations should create moments of delight that evoke the Pokemon experience: card flips, sparkles for rare variants, and smooth transitions between views. Use subtle shimmer effects on hover for cards with holo variants. List reordering should animate smoothly to help users track changes. Keep micro-interactions quick (100-200ms) while allowing collection generation to feel momentous with a satisfying 400ms reveal animation.

## Component Selection

**Components**:
- **Tabs**: Switch between "Build Set", "My Collections", and "Preview" views
- **Select/Combobox**: Pokemon and Set selection with search/autocomplete
- **Radio Group**: Master set type selection (Official Set/Pokemon/Evolution Chain)
- **Switch**: Toggle between "All Variants" and "Unique Art Only"
- **Card**: Display each master set configuration and saved collections
- **Badge**: Show card counts, variant types, and set identifiers
- **Checkbox**: Checklist items in the binder-ready output
- **Button**: Primary actions (Generate, Save, Print) with distinct hierarchy
- **Dialog**: Detailed card information and save/load modals
- **Scroll Area**: Handle long card lists smoothly

**Customizations**:
- Custom card preview component with shimmer effect for holo cards
- Custom multi-select component for Pokemon with evolution chain visualization
- Gradient background overlay suggesting booster pack foil pattern

**States**:
- Buttons: Bright accent color (purple) for primary, outlined for secondary, ghost for tertiary
- Inputs: Focus state with electric yellow ring glow
- Cards: Subtle shadow, gentle hover lift with 200ms transition
- Checkboxes: Custom checkmark with Pokemon ball icon

**Icon Selection**:
- Plus/Minus: Add/remove Pokemon or sets
- Funnel: Filter variants
- SortAscending/SortDescending: Sort order controls
- Printer: Print checklist
- FloppyDisk: Save collection
- Lightning: Quick actions
- Cards: Deck/collection indicators

**Spacing**:
- Page padding: p-6 to p-8
- Section gaps: gap-6
- Card internal padding: p-6
- List item spacing: gap-3
- Button groups: gap-2

**Mobile**:
- Stack tabs vertically on mobile
- Single column layout for collection cards
- Collapsible sections for filter controls
- Bottom-sheet style dialogs on mobile
- Touch-friendly 44px minimum hit areas
- Sticky header with collection name and card count
