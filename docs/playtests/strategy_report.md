# Strategy report: getting the best results for the PSOE

Historical mode, 70 automated playthroughs (`tools/strategy_search.js`).

- **Exploration:** 60 games with random choices, leaving out only the obviously self-destructive options.
- **Strategy:** 10 games that took the choices which had scored best in exploration, plus 10% random choices.
- **Score:** mean PSOE seats across the general elections plus 3 × the mean monthly PSOE poll.

## Headline

| | Exploration (60) | Best strategy (10) |
|---|---|---|
| Mean PSOE seats per election | 88.9 | **99.5** |
| Mean monthly poll | 21.2% | **22.6%** |
| Peak poll (mean) | 27.1% | **28.0%** |
| Months as PM | 17.7 | **28.5** |
| Best single election | 136 | 123 |
| Barons' coup happened | 44/60 | 9/10 |

The best runs reached 114–123 seats in 2019 and governed for 67–71 months. Nobody got near a majority (176).

## What works

**Party line (end-of-game positions in the best runs)**
- **Economy:** Social Liberal or Social Democratic, never Anti-Capitalist. In exploration the few Moderate games scored highest (164.7, n=4).
- **Society:** Progressive or Moderate.
- **Constitution:** Federalist, or a soft Unionist line. Hard Centralist Unionism did worst (148.6).
- **Style:** Pragmatic was clearly best (161.7), Populist second. Establishment and Insurgent were weakest.
- **Europe:** pro-EU or Eurosceptic did slightly better than staying Moderate. This difference is small and probably noise.

**Advisers (mean score of games that ended with them; small samples)**
- **Better than average:** Zaida Cantera and Toni Ferrer (both 161.5), Margarita Robles (160.7), Óscar Puente (155.6).
- **Around average:** Lastra, Luena, Hernando, Cerdán, Bolaños.
- **Below average:** Redondo (145.3), Vara (140.2), Lambán (126.8, n=1). Barons as advisers hurt.
- In the choice data, bringing in Robles or Redondo while building the team was a strong early move (+7). Redondo helps as a hire but does worse when he is still there at the end.

**Individual choices with the biggest lift over the average game**
- **La Palma volcano:** declare a disaster zone and fund the reconstruction (+9.8).
- **Tax reform:** income-tax cut for low earners (+7.7), or a minimum corporate tax (+6.9).
- **Party posts:** Adriana Lastra as Spokesperson (+7.7). Leaving Verónica Pérez as Committee President (+8.1) avoids a fight in the Federal Committee.
- **If ousted:** resign your seat rather than abstain for Rajoy (+7.1).
- **Pegasus:** defend the services (+6.8).
- **COVID:** a strict national lockdown (+5.9).
- **Campaign debate:** attack the PM over corruption (+5.7).
- **Memory law:** fund the search for the graves (+5.6).
- **Monarchy:** defend the institution after the emeritus scandal (+5.5).
- **Labour reform:** share the credit with the social partners (+4.4).
- **Censure-motion budget:** call an early election when Congress blocks it (+3.5).

## What to avoid

- **Losing the party.** Anything that ends with you ousted and in exile scores 7–9 points below average: the exile cards, forcing a primary from the backbench, "A Prime Minister without a party". Keep the Executive and the posts loyal.
- **Catalonia:** refusing Article 155 as PM (−10.2).
- **Campaign tour:** touring Madrid and its suburbs (−10.6).
- **Minimum Living Income:** presenting it at the wrong moment (−11.1). Its timing matters.
- **Party posts:** making Cristina Narbona party President before 2017 (−9.3). The Committee fight costs more than the post is worth.
- **Factions:** alienating the Socialist Left, and accepting the unions' rally in a way that alarms the barons (both about −7).

## Problems the runs exposed

1. **The barons' coup is close to unavoidable.** It happened in 9 of the 10 best games. The search never learned to prevent it, so appointments and purges don't yet buy enough protection, at least in historical mode.
2. **The caretaker committee can get stuck.** In 4 of the 10 best games the PSOE was still led by Javier Fernández's caretaker committee through the 2019 and 2023 elections. The 2017 primary chain apparently never completed. This needs investigating.
3. **The PSOE collapses in 2023.** Several strong runs fall from about 120 seats in 2019 to 73–78 in 2023. Government wear may be too harsh.
4. **One game ended after only the 2015 election** (91 seats). This also needs investigating.

Outcomes are noisy and most samples are small (often under 15 games per choice), so treat single-choice lifts as hints rather than rules.

## Follow-up fixes (36 verification games: 24 historical, 12 ahistorical)

- **Stuck caretaker committee:** this wasn't a bug. In those games the search chose to retire Sánchez, which ends the game, so the last leader shown was the caretaker. The caretaker committee already hands over to an elected leader after eight months.
- **Coup protection:** when the critics cannot dissolve the Executive, the barons' attack is weaker (−18, was −12). Each loyal top post is worth 2.5 (was 1.5).
- **Beating the establishment:** winning a primary after a coup, a challenge or from the backbench brings voters home. The PSOE gains about 4 points, mostly from Podemos and some from Cs, plus morale and Sanchismo. The bonus is full after an ouster and 70% after a coup survived in office.
- **Government wear:** it now falls on the soft vote only. It shrinks as the PSOE nears about 19%. The 2023 result in historical runs went from a mean of about 80 seats to 101.
- **Catalan crisis:** it now always ends. A hard line's effect fades, the movement tires after 30 months, and after four years a Junts-led Generalitat counts as governing pragmatically. In the verification runs the crisis lasted 40–49 months on average, with a longest of 55, and none was still running at the end.
- **Snap election against Vox:** if the PSOE calls an early general election while Vox polls 10% or more, the polls understate the PSOE by 4–7% of its vote and overstate Vox, as in July 2023.

## Boosted strategy and the final grade (25 games)

These games used the learned best choices plus three habits:
- use an adviser's action whenever one is ready;
- draw from the budget and government decks first, and present laws and budgets;
- otherwise play rally and campaign cards.

| | Boosted (25) | Strong bot, no boost (9) |
|---|---|---|
| Grades | A 1, B 4, C 10, D 5, E 1, F 4 | C 1, D 2, E 1, F 5 |
| Mean grade score | 58 | 35 |
| Months as PM | 73 | 37 |
| Laws passed | 4.6 | — |
| Budgets passed | 1.7 | — |
| Mean PSOE seats per election | 117 | — |
| Mean poll | 26.1% | — |

- The A was a full term (104 months as PM), 8 laws and 5 budgets.
- All 4 F games ended with Sánchez ousted in a coup and Susana Díaz leading the party. The PSOE still won 115–135 seats in those games, but under her, so they don't count for him.
- Budgets are the weak point: about half the games passed one or none. Even long-serving governments often score 0 on budgets.
- Laws mostly pass when presented (4.6 per game). The bot runs out of new bills: there are only ten in the agenda.
