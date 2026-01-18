# Project To-Do List

- [x] Add support for the remaining three top-level objects: films, species and vehicles
  - films: https://swapi.py4e.com/api/films/
  - species: https://swapi.py4e.com/api/species/
  - vehicles: https://swapi.py4e.com/api/vehicles/

- [x] Handle relations between People, Planets, Starships, Films, Species, and Vehicles

- [x] Make the app mobile-friendly
- [x] Auto-expand drill-down when navigating from a relation

- [x] SSL support in deployment
  - Use Traefik Reverse Proxy for automatic SSL.
  - Configure App container with Traefik labels.
  - Update RelationList to pass `autoExpand=true` in query.
  - Update DataTable to automatically expand if `autoExpand` prop is present and there is only 1 item.
  - Optimize layout for smaller screens (Pixel 9 viewport ~412px).
  - Adjust padding and font sizes.
  - Ensure data tables are scrollable or stacked on mobile.
  - Link homeworlds in People view to Planets view.
  - Link pilots in Starships and Vehicles view to People view.
  - Link residents in Planets view to People view.
  - Link People, Planets, Starships, Vehicles, and Species in Films view.
  - Link People in Species view.
