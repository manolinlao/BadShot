The domain/ folder is not required, but it helps organize the **business logic** of the application separately from the UI and technical code.

In a project like this (a coffee social app), the domain represents the core concepts of the product, such as coffee shots, roast levels, recipes, and rules about how data behaves.

## What goes into domain/

The domain/ layer contains:

- Business logic (how things work)
- Core concepts of the app (e.g. coffee, shots, users)
- Shared rules and mappings (e.g. roast levels, labels, calculations)
- Types that represent real-world meaning (not UI structure)

Example:

````
domain/
  coffee/
    roastLevel.ts
````
- You are building an Instagram-like coffee app
- There will be many entities (shots, users, recipes, etc.)
- You want to scale features over time
- You are using AI tools that tend to introduce structure or organization inconsistencies
