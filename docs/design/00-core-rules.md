# Core rules — Social Democracy: Spain 2015–2023

**Status:** agreed rules plus implementation notes. Items marked **(provisional)** are first-pass values to be tuned in playtesting; items marked **(verify)** need checking against a primary source.

This document covers the rules every chapter and card depends on. Chapter documents (starting with `chapter-01-the-impossible-parliament.md`) describe content; this one describes the simulation.

## 1. Shape of the game

- **Player:** Pedro Sánchez, not the PSOE. Sánchez's personal authority and the party's institutional strength are separate quantities.
- **Span:** 20 November 2015, one month before the general election, to the end of 2023. The game opens with the 2011 Congress and Rajoy's majority government; the 20 December election is run live by the vote model, so the player's pre-campaign line and campaign cards shape the result and their position for coalition talks.
- **Structure:** month-by-month, as in the Weimar original: draw and play cards, consult advisers, then resolve the month. Scheduled and conditional events happen between turns. Major procedures (investitures, motions of no confidence, Federal Committees, primaries) interrupt the loop as multi-stage sequences.
- **History:** historical dates are *opportunities with preconditions*, not commands. If the conditions that produced an event are absent, it does not happen or happens differently.
- **Distribution:** a standalone fork with its own site. The Weimar campaign is removed from the build; it stays in git history for reference.

## 2. How the game ends

### 2.1 Defeat — Sánchez loses the leadership

The game is lost if Sánchez stops being Secretary-General of the PSOE, by resignation, ouster by the Federal Committee, or losing a primary.

**The 2016–17 exception.** If Sánchez is forced out during the leadership crisis of the 2016 legislature, the game continues. The player plays the interregnum, out of office and without the party apparatus, and must win the 2017 primary and the 39th Federal Congress that follows it. Losing that primary ends the game. A loss of the leadership outside this window ends the game immediately.

Implementation: `sanchez_leader` (0/1), `leadership_exception_open` (set when the crisis window opens, closed after the 39th Congress), and `primary_2017_scheduled`.

### 2.2 Defeat — the PSOE has no path to government

Checked after every general election and whenever a government is formed:

| Situation | Result |
|---|---|
| PP alone holds a clear majority (≥ 186 seats) | **Game over** |
| PP alone holds a bare majority (176–185) | Game continues. Defections, scandals or a breakdown in discipline can still bring it down. |
| PP + Vox hold ≥ 55% of Congress (≥ 193 seats) | **Game over** |
| PP + Vox hold a narrow majority (176–192) | Game continues. The government is fragile and a motion of no confidence remains possible with defections or a coalition breakdown. |
| PP minority government | Game continues |

Both thresholds are constants (`PP_ALONE_LOSS_SEATS` = 186, `LARGE_MAJORITY_SEATS` = 193) so they can be tuned.

### 2.3 PP–Vox relations are not automatic

A PP–Vox government or support arrangement carries its own friction, modelled on the original's coalition-dissent counters:

- `pp_vox_relation` and `pp_vox_dissent`. Vox demands (immigration, recentralisation, Article 155, the gender-violence law, cabinet posts) and PP moderates' resistance raise dissent.
- Regional PP–Vox coalitions (Castilla y León 2022 onwards, and any the simulation produces) feed the same relationship. Their conduct moves national opinion.
- High dissent can break the arrangement and leave a minority government, open a window for a motion of no confidence, or trigger a snap election.
- Whether Vox enters government at all is the PP leader's decision, an independent actor with its own incentives. It is not guaranteed by the seat count.

### 2.4 Surviving to the end

Reaching the end of 2023 as PSOE leader is survival. The ending report grades the result: whether Sánchez is in government and with whom, Vox's strength, PSOE unity, policy achievements and the state of the territorial question. Named, historically flavoured achievements are a community favourite in the original and should be carried over.

## 3. Institutions

All rules sit in one module so every card uses the same arithmetic.

### 3.1 Investiture (Constitution, art. 99)

- The King proposes a candidate after consultations. The candidate may decline, as Rajoy did on 22 January 2016.
- First ballot: absolute majority (176). Second ballot, 48 hours later: more yes than no votes. Abstentions are decisive.
- **Clock:** two months after the first investiture vote, if no candidate has won, the Cortes are dissolved automatically and an election follows (54 days after the decree, LOREG). With no first vote, the clock does not start (the 2016 debate).
- Arrangements are distinct states: coalition, legislative agreement, confidence-and-supply, issue-by-issue, abstention. Each has different costs and stability.

### 3.2 Motion of no confidence (art. 113)

- Constructive: it must name an alternative candidate and needs an absolute majority (176).
- Proposed by at least 35 deputies (10%). If it fails, its signatories cannot propose another in the same session period.
- Success makes the candidate Prime Minister immediately, without an election (June 2018).

### 3.3 Dissolution and terms

- A legislature lasts at most four years.
- The Prime Minister can call an early election, except during a pending motion of no confidence or within a year of the previous dissolution (art. 115).
- **Budgets:** an unpassed budget rolls over. A failed budget vote is a major trigger for early elections (February 2019). Tracked as `budget_year`, `budget_passed` and `budget_rolled_over`.

### 3.4 Senate (verify scope)

The PP holds the Senate majority for most of the period. The Senate matters for Article 155 (it needs a Senate absolute majority) and for delaying legislation. It is modelled as a simple seat ledger, not a full election.

## 4. General elections

Implemented and tested in `out/html/spain/`.

- **Seats:** 350 deputies in 52 constituencies. Ceuta and Melilla elect one each. Every other province gets a minimum of 2, and the other 248 are shared by population (largest remainder, LOREG art. 162). An election uses the population figures of the latest historical decree on or before its date.
- **Allocation:** D'Hondt in each province, 3% threshold of valid votes, with blank votes counted as valid (LOREG art. 163).
- **Validation:** fed the official province-level votes, the engine reproduces every Congress from 2015 to 2023 seat for seat (`tests/electoral_engine.test.js`).
- **Candidacies:** confluences and alliances are separate ballot lists in each province, mapped onto political spaces (`up` covers Podemos, En Comú, En Marea, Compromís–Podemos, Unidas Podemos and Sumar). Unrelated small lists are never merged.

### 4.1 Vote model: classes with a regional layer

1. **Classes (national):** the CIS's socio-economic groups, with shares taken from CIS Study 3126 (post-election survey of the 2015 election, January–March 2016):

   | Class | CIS groups | Share |
   |---|---|---:|
   | Professionals | directors and professionals; technicians and middle managers | 15.0% |
   | Self-employed | small business owners; farmers | 4.8% |
   | Workers | office and service employees; skilled and unskilled manual workers | 21.5% |
   | Pensioners | retired and pensioners | 27.4% |
   | Unemployed | unemployed | 18.2% |
   | Students | students | 4.5% |
   | Homemakers | unpaid domestic work | 7.0% |

   Each class has support points for the statewide parties (PSOE, PP, Cs, Podemos space, IU, Vox, Más País/Compromís, PACMA, UPyD). Cards add and subtract points, as in the original. **The support values are provisional**: the published CIS reports give only the pattern (PSOE strongest among manual workers and pensioners; PP among the self-employed, pensioners and homemakers; Podemos U-shaped; Ciudadanos among professionals). The exact class × party table, the class mix in each community and a **gender split** (support by class and sex) will be calculated from the CIS microdata (`tools/build_class_model.py`, to be written once the files are available). Rural voters are modelled through the regional layer, not as a class.
2. **Regions:** 19 regional units (17 communities plus Ceuta and Melilla), each with:
   - its own class mix (provisional);
   - a multiplier per statewide party (`regionalMod`), for regional events;
   - the strength of its territorial parties (`territorialMod`): ERC, Junts, CUP, PNV, EH Bildu, Geroa Bai, UPN, BNG, CC, NC, PRC, Teruel Existe and others.
3. **Provinces:** regional change is applied to each province's real December 2015 result as a swing. Gains are spread partly evenly and partly in proportion to existing strength; losses are proportional.

Properties (tested):
- An unchanged state reproduces the December 2015 Congress exactly.
- New parties, Vox above all, grow according to class mix × regional affinity, rather than amplifying their random 2015 micro-vote. The affinity reflects structural factors (salience of the territorial conflict, rural grievance, the Ceuta/Melilla border), not a fixed result.
- Lists can be withdrawn (`notStanding`, e.g. IU joining Unidos Podemos) or added in specific provinces (`newLists`, e.g. Teruel Existe, Más País).

Polls are the model's national vote shares, recalculated each month.

## 5. Regional parliaments

Implemented and tested in `out/html/spain/regional_*.js`.

### 5.1 Calendar

- **Common May cycle:** thirteen communities vote with the municipal elections on the fourth Sunday of May every four years (2015, 2019, 2023). This includes Madrid, Valencia (which moved to April 2019), Aragón, Asturias, the Balearic Islands, the Canary Islands, Cantabria, Castilla-La Mancha, Castilla y León, Extremadura, La Rioja, Murcia and Navarre.
- **Own calendars:** Andalusia, Catalonia, the Basque Country and Galicia. Their presidents can dissolve at any time.
- **Snap elections in the common-cycle communities:** where allowed, either the new parliament only serves until the next common date (`snapKeepsCycle`; Madrid's 2021 parliament ended in 2023) or a new four-year term starts (Castilla y León 2022). **(verify)**: the per-community flags in `regional_rules.js`.
- The May elections are also the **municipal** elections. These aren't simulated seat by seat, but their national swing is a major event (the May 2023 results triggered the July 2023 snap general election).

### 5.2 Electoral systems

Each chamber's districts, seats per district and threshold rules are in `regional_rules.js`. Notable cases:

- **Valencia:** 5% across the whole region.
- **Murcia:** five districts and 5% until 2015; from 2019, one district and 3%.
- **Canary Islands:**
  - Before 2018: 60 seats by island, with a threshold of 30% on the island or 6% across the region.
  - From 2019: 70 seats, adding a 9-seat regional list, with 15% on the island or 4% across the region.
- **Balearic Islands:** island districts, 5% on each island.
- **Asturias:** three districts (Central, Western, Eastern).
- **Extremadura:** 5% in the province or across the region.
- **Madrid:** single district, 5%; the chamber size varies with population.

Validation: 55 of 66 regional elections from 2011 to 2023 are reproduced exactly from official results. The rest are documented source-data limits, such as merged lists, scrambled municipality data, a missing separate ballot, or last seats decided by fewer than 60 votes (`tests/regional_rules.test.js`).

### 5.3 Regional votes in the game

A regional election starts from that community's last real result and applies the swing the vote model produces for the community. Regional-only parties (PAR, CHA, Compromís, Més, Foro, El Pi…) hold their strength unless an event changes it. `ALIASES` handles joint lists (Junts pel Sí = ERC + Junts).

**Starting governments (December 2015)** are in `regional_model.js`. Nine are PSOE-led or include the PSOE:
- PSOE-led: Andalusia, Aragón, Asturias, the Balearic Islands, Castilla-La Mancha, Valencia and Extremadura.
- PSOE as junior partner: the Canary Islands (with CC) and Cantabria (with the PRC).
- Navarre's PSOE federation is in opposition.

### 5.4 Why regions matter to Sánchez

- Regional presidents are the **Regional Leaders** faction's power base. Losing a community weakens that leader and the faction's influence.
- Barons up for re-election resist national strategies that cost them votes, for example a deal with Podemos or the independence parties.
- Regional elections are where new parties break through first (Vox in Andalusia in December 2018) and where PP–Vox cooperation is tested.

## 6. The PSOE

### 6.1 Factions

Five permanent factions, as defined in the Chapter I doc §6: **Institutionalists, Regional Leaders, Progressives, Modernisers, Trade Unionists**. Each has `strength` and `dissent`, as in the original, normalised across factions; overall party dissent dampens every gain in support. In addition:

- Faction strength must be traceable to identifiable people and organisations: regional presidencies held, union ties, MPs, Federal Committee members.
- **Regional Leaders** are a set of individual barons, each with their own relationship to Sánchez and their own regional government (see §5.3). The faction figure is derived from them.
- **Sanchismo** is a loyalty network, not a faction. It is `sanchismo_strength`, built from politicians' personal loyalty across all five factions. Rival networks (Susana Díaz's) are tracked the same way.
- Politicians carry three separate attributes: faction, a multi-dimensional ideology, and personal loyalty.

### 6.2 Party bodies and the leader

| Quantity | Meaning |
|---|---|
| `sanchez_authority` | Sánchez's personal standing in the party |
| `member_morale` | The membership's mood; decisive in primaries and membership consultations |
| `federal_committee_balance` | Sánchez's share of the Federal Committee; decisive in an ouster |
| `federal_executive_control` | Control of the leadership and its appointments |
| `psoe_unity` | Derived from faction dissent |

The 2016 ouster is a Federal Committee vote; the 2017 return is a membership primary. Members and the Committee should often disagree, as they did historically.

### 6.3 Sánchez's positioning

He starts as a modernising, pragmatic social democrat (his 2014 profile). The player can stay there or move towards his more progressive 2017 positioning. It is a player choice, tracked as `sanchez_positioning` on more than one axis.

## 7. The monthly loop

One central routine (the Spanish `post_event`), as in the original. Cards change variables and set flags or deadlines; they never advance time themselves.

1. Advance the date when the month's action count is reached; decrement timers.
2. Recalculate polls from the vote model.
3. Update the economy (provisional: unemployment, growth, deficit, inflation; external shocks such as COVID-19 in 2020 and the 2022 energy inflation).
4. Faction and relationship drift; recompute party dissent and Sanchismo strength.
5. Deadlines: investiture clock, budget, legislature end, regional elections due.
6. Check the loss conditions in §2.
7. Route to any due events; otherwise return to the desk.

Card types follow the Chapter I doc §11.4: **action cards**, **event cards**, **pinned adviser and actor cards** and **crisis sequences**.

### 7.1 Decks

| Deck | Available | Examples |
|---|---|---|
| National politics | always | interview, rally, televised debate (election called), corruption files, pensions march, 8 March, motion of no confidence (PP governs) |
| Party politics | always | regional presidents, ask the members, Federal Executive, UGT, Socialist Youth, programme, local branches |
| Government negotiations | while seeking investiture after an election | negotiating team, the Podemos question, the Ciudadanos channel, the small parties, what the party promises |
| Government | while the PSOE holds ministries | budget, minimum wage, historical memory, pensions, labour reform, reshuffle |
| Catalan crisis | from the referendum laws to the post-155 Catalan election | enforce the law, a table for dialogue, the PSC line, a federal answer |

### 7.2 Status words

Values are shown as words, never numbers: authority (Non-existent, Very low ≤9, Low ≤35, Middling ≤60, Strong ≤79, Very strong ≤99, Absolute 100), and matching scales for member morale, unity, relations, faction dissent and weight, the Federal Committee and Sanchismo (`SCALES` in `spain_ui.js`).

### 7.3 Election results

Every general and regional result shows vote share, change in vote share, seats, seat share and change in seats against the previous election.

## 8. Lessons from the original's community

From player discussion of the Weimar game:
- **Avoid unbreakable deadlocks.** Players reported stuck games when the only possible coalition refused to form. Every deadlock here must resolve, through repeat elections or abstentions.
- **Give opposition play real substance.** Players complained of having little to do outside government. Sánchez is in opposition from 2015 to 2018.
- **No farmable repeatable actions.** Players exploited repeatable cards in the original.
- **Explain characters and show the numbers.** Players asked for both: show seat charts and polls.

## 9. Data and credits

- General elections: official Ministry of the Interior results, via [MiCongreso](https://github.com/josemam/MiCongreso). Built by `tools/build_election_data.py`.
- Regional elections: official results, via [histEleccionesAutonomicas](https://github.com/rricote/histEleccionesAutonomicas). Built by `tools/build_regional_data.py`, with the corrections listed there.
- Images: Wikimedia Commons and other open collections, each recorded with source, creator, licence and attribution in an asset list (Chapter I doc, "Visual assets").

## 10. Open questions

1. CIS microdata (studies 3126, 3145, 3248, 3269 and 3420) are needed to calibrate classes, regional class mixes and the gender split.
2. Should Ceuta and Melilla's assemblies be simulated, or only their Congress seats?
3. Senate: a simple ledger, or full elections (208 elected senators, limited-vote system)?
