# Social Democracy: An Alternate History

## Included Libraries

[jquery v1.11.1](https://releases.jquery.com/)

[d3.js v7](https://d3js.org)

[d3-parliament](https://github.com/geoffreybr/d3-parliament)

## Building the game

1. Install [dendrynexus](https://github.com/aucchen/dendrynexus)

2. Run `dendrynexus make-html` in this folder.

To update dendrynexus in `package-lock.json`, run `npm install --upgrade https://github.com/aucchen/dendrynexus`

## Spain 2015–2023

A fork of Autumn Chen's *Social Democracy: An Alternate History*, set in Spain. You play Pedro Sánchez from December 2015. The rules are in `docs/design/00-core-rules.md`; chapter designs are in `docs/design/`.

The Spanish electoral engine is in `out/html/spain/`. Run its tests with `npm test`; they check that the engine reproduces the official Congress results from 2015 to 2023 and the regional parliament results from 2011 to 2023.

### Election data

- General elections: official results from the Spanish Ministry of the Interior (infoelectoral), via [MiCongreso](https://github.com/josemam/MiCongreso). Rebuild with `tools/build_election_data.py`.
- Regional elections: official results via [histEleccionesAutonomicas](https://github.com/rricote/histEleccionesAutonomicas). Rebuild with `tools/build_regional_data.py`.
