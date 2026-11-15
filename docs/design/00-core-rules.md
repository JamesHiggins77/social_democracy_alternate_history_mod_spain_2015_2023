# Core rules — Social Democracy: Spain 2015–2023

**Status:** agreed rules plus implementation notes. Items marked **(provisional)** are first-pass values to be tuned in playtesting; items marked **(verify)** need checking against a primary source.

This document covers the rules every chapter and card depends on. Chapter documents (starting with `chapter-01-the-impossible-parliament.md`) describe content; this one describes the simulation.

## 1. Shape of the game

- **Player:** Pedro Sánchez, not the PSOE. Sánchez's personal authority and the party's institutional strength are separate quantities.
- **Span:** 13 July 2014, the day Pedro Sánchez wins the PSOE primary with the backing of Susana Díaz and the regional leaders, to the end of 2023. The game opens with the 2011 Congress, Rajoy's absolute majority and the regional governments of July 2014. The 2015 regional elections and the 20 December 2015 general election are played live.
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

### 3.1b Who can govern

- **The right's candidate** is the leader of the larger of the PP and Ciudadanos: Rajoy, or Rivera if Cs overtakes the PP. A PP investiture with Cs votes and at least 20 Cs seats forms a **PP–Ciudadanos coalition**; with a warm PP–Vox relation and Vox needed, a **PP–Vox coalition**; a Rivera investiture forms a **Ciudadanos–PP coalition**.
- **If the PSOE is the largest party**, the King nominates Sánchez first.
- **If Podemos is level with or ahead of the PSOE**, the *Back Iglesias* card lets the PSOE invest Iglesias, as junior coalition partner (PSOE ministers) or from outside.
- **PSOE governments** are recorded as coalition, agreement-based or minority, and flagged when they depend on the independence parties (`depends_on_catalans`). During the Catalan crisis such a government faces its partners' price (concede, a dialogue table, or refuse and lose the majority), and a PSOE Prime Minister decides Article 155 himself (with elections, indefinitely, or refuse).

### 3.1c Relations between other parties

Pairwise relations (`Q.party_rel`, defaults in `parliament.js`) decide who will vote together: Ciudadanos will not share a majority with ERC, Junts or Bildu; the PNV will not back a government that depends on Vox; Podemos and Cs will not vote together while relations are cold. Events move them (the Catalan crisis pushes Cs and the PP away from Junts and ERC; Vox's rise brings the PP and Vox closer). Shown in the Politics tab.

### 3.1d Who is blamed for a repeat election

At dissolution the game checks whether the PSOE had a workable majority within reach (a deal with Podemos and the PNV/CC, or with Cs and Podemos's abstention). If so, voters blame the PSOE (support moves to Podemos, Cs and the PP, and Sánchez loses authority); if not, they blame the right's candidate (support moves to the PSOE, Cs or the PP, and Vox if it exists).

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

### 6.4 The historical currents of 2014–15

The rise and fall of Podemos and Ciudadanos, the PP's erosion and the collapse of IU and UPyD come from a fitted path (`tools/build_history_path.js`, `history_path_data.js`): monthly national factors per party, fitted so that the polls the player sees match the real 2014–15 poll averages and the true vote is those polls minus the December 2015 polling error. The path ends at the real December 2015 result. The player's actions push on top of it; regional elections up to December 2015 use the real result as baseline and the swing against the path at the same date, so an untouched game reproduces the real March, May and September 2015 regional results and governments.

Events explain the currents and let the player respond: the abortion law's withdrawal (Sept 2014), the black cards and Púnica (Oct 2014), Podemos at Vistalegre (Oct 2014), the 9N consultation (Nov 2014), Díaz's snap Andalusian election (Jan 2015 call), Ciudadanos going national (Feb 2015), the mayors of change (June 2015), Syriza's surrender (July 2015), Mas's plebiscitary election (Aug 2015 call) and Rajoy dissolving the Cortes at the end of the legislature (Oct 2015), with the PSOE's campaign line.

### 7.0 Weekly turns during government formation

From a general election until a government is invested or the Cortes are dissolved, each turn is one week ("Week 2, January 2016"); four weeks close the month, which runs the usual monthly routine (funds, poll record, regional elections, drift). The investiture clock counts eight weeks from the first vote. Government Negotiations cards cool down in weeks; other cards cool down at a quarter-month per week. Formation events are timed in weeks since the election: the King's consultations from week 2, Iglesias's offer from week 3, the King turning to Sánchez from week 5, the forced vote at week 16.

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

### 7.3 Finances

- **Party funds** (abstract units): start at 6, earn 0.5 + PSOE seats/200 a month (dues and public subsidy). A general election campaign costs 4, a round of regional campaigns 1, and big-hall rallies, the branch tour, digital campaigns and member consultations cost 1 each. The *Party finances* card raises funds (donors, micro-donations, or a bank loan repaid from income). Debt lowers morale and authority each month.
- **Government finances** (shown while the PSOE governs): deficit and debt follow the real path for each year (2015–2023, including the 2020 pandemic) plus the player's policy adjustments (`fiscal_adj`), which also accumulate into debt. Above 3.5% of GDP, Brussels writes.

### 7.4 Decisions move votes

Major decisions transfer support between parties class by class (`SpainGame.transfer`): abstaining for a PP government sends left-wing voters to Podemos and shrinks the Progressives; pacts, the Catalan choices, ousters and repeat elections all move votes. Campaign-card effects on the PSOE, PP and Ciudadanos fade by 1.5% of the gap each month.

### 7.5 Targeting demographics

Campaign and media cards can aim at an audience (`SpainGame.target`): students, young people, pensioners, the working class (workers and the unemployed), the middle class (professionals and the self-employed), women, the unemployed, or rural Spain (a regional boost in Castilla y León, Castilla-La Mancha, Extremadura, Aragón, Galicia and La Rioja). Women are reached through every class in proportion to its share of women (approximate INE shares, to be replaced by CIS microdata). Each repeat use of the same target is weaker (1/(1 + 0.25 × uses)), recovering slowly. Cards: **Campaign ads** (2 funds, strongest), **Media appearance** (the outlet decides the audience), **Campaign tour** (election only, 1 fund per regional stop).

### 7.5b Balance: gains, backlash, position, incumbency, money

- **Harder gains:** PSOE campaign gains are scaled by 0.6, then by campaign fatigue, 1/(1 + fatigue), where every point gained adds 0.08 fatigue and fatigue falls by a quarter each month. Repeat targeting of the same audience: 1/(1 + uses), recovering 0.15 a month.
- **Cross-pressure:** courting students or the young loses pensioners to the PP; courting pensioners loses students to Podemos; working-class appeals lose professionals and the self-employed to Cs and the PP; middle-class appeals lose workers to Podemos; women-focused appeals lose a few self-employed men.
- **Position:** moving to the centre or right (`econ_left` or `social_prog` below −1) sends workers, students and the unemployed to Podemos and IU. `econ_left` and `social_prog` rise with left-wing economic promises (labour-reform repeal, wealth tax, public ownership) and progressive social ones (feminism, memory, abortion, territorial concessions), and fall with moderating choices; both fade 3% a month. Above 3, moderates leave every month: professionals and the self-employed to Cs and the PP (economic), pensioners and homemakers to the PP and Vox (social). Shown as words in the Politics tab.
- **Grievances outlast favours:** gains fade at 3% of the gap a month, losses recover at 1%. In government, PSOE gains count ×0.7 and losses ×1.5, and every month a party in government (from 2016) loses a little support to the opposition.
- **Money:** every campaign action costs funds and cannot be taken without them. In debt, Sánchez loses authority and Federal Committee support monthly and the Institutionalists and Regional Leaders grow restless; at −5 the treasurer's crisis, and a revolt becomes possible; at −10, with a hostile Federal Committee, removal for mismanagement.

### 7.6 Polls: history and error

- **Poll of polls** (Polls tab and Library): the last 48 months. Before December 2015, monthly averages of the 409 published polls listed on Wikipedia (`tools/build_poll_history.py`); afterwards, the game's monthly polls. Election results replace the poll in their month; dashed lines mark general elections.
- **Polling error** (`tools/build_poll_errors.py`): the final three weeks of polls compared with every result 2015–2023. Mean error (poll − result) and spread: PSOE −1.3 (sd 1.1, underestimated every time), Ciudadanos +1.8 (sd 1.9), PP −0.1 (sd 2.3), Podemos/UP/Sumar −0.0 (sd 2.1), Vox −0.1 (sd 1.4). Largest misses: Cs +4.6 (2015), PP −3.6 and UP +3.4 (2016), PP +3.4 (April 2019), Vox −2.1 (November 2019), PSOE −3.4 (2023).
- In the game, the first campaign's polls carry the real December 2015 errors; after each election a new error is drawn per party from its bias and spread, with ±0.5 monthly variation between pollsters. Polled seats come from the polled vote. Elections use the true vote, and the election page reports how far the polls were off.

### 7.7 International relations and world events

Six relations, 0–100, shown as relation words in the Politics tab: the EU, the south (Portugal, Italy, Greece), the Maghreb (Morocco and Algeria), the United States, NATO and the UN. They start at EU 60, south 60, Maghreb 50, US/NATO/UN 55.

Effects: EU relations set how far Brussels tolerates the deficit before an excessive-deficit warning (3.0% below 50, 3.5% from 50, 4.2% from 70). The UN relation decides the October 2014 Security Council vote (won at 50+). EU and south relations decide the size of the 2020 recovery fund and whether the 2022 Iberian exception is approved. Maghreb relations decide how severe the 2021 Ceuta crisis is; US relations how hard the 2019 olive and wine tariffs bite; NATO relations whether Madrid hosts the 2022 summit.

Moving them: the Government card "Foreign policy" (one tour every three months) and the National card "International contacts" in opposition (costs party funds), plus event choices.

World events (source/scenes/spain/sp_world.scene.dry), each conditional on date and state: UN Security Council vote (Oct 2014), Portugal's geringonça (Nov 2015), Brexit (Jul 2016), Las Ramblas (Aug 2017), Cifuentes's master's (Apr 2018, if the PP governs Madrid), La Manada (May 2018), the Aquarius (Jun 2018), NATO 2% (Jul 2018), Más País split (Sep 2019, if Podemos is standing), US tariffs (Oct 2019), the Procés sentence (Oct 2019, if the Catalan crisis happened), Rivera resigns (if Cs falls below 15 seats after a 30+ peak), COVID-19 (Mar 2020), recovery fund (Jul 2020), the King Emeritus leaves (Aug 2020), Ayuso's snap election (Mar 2021, if the PP governs Madrid; moves Madrid's election date), Ceuta (May 2021), pardons (Jun 2021, PSOE government after the crisis and sentence), La Palma (Sep 2021), Ukraine (Feb 2022), the Western Sahara letter (Mar 2022, PSOE government after Ceuta), Pegasus (Apr 2022), Iberian exception (Apr 2022), NATO Madrid summit (Jun 2022), EU Council presidency (Jul 2023). Texts and choices change with who governs.

### 7.8 Leadership crises, exile, and the PP's succession

Sánchez's leadership crisis follows his authority. At 30 or below: rumours in Ferraz. At 15 or below: a named challenger (Madina in 2014–16, Susana Díaz to 2017 if relations are poor, García-Page later) and talk of a leadership election. At each stage he can ignore it (the pressure grows), address it (authority back, costs the month), call the critics' bluff with a confrontation (wins or loses on Federal Committee balance and morale; a failed dare at stage two can end in expulsion), or call a leadership election himself (+6/+5 for taking the initiative). At 0 a primary is forced (−3). A primary is won on 0.45 × morale + 0.35 × sanchismo + 0.2 × authority + bonus + noise ≥ 38. Authority above 40 resets the stages.

Losing is no longer the end, except in the scripted 2016–17 window, which keeps the May 2017 primary. Afterwards Sánchez chooses: join Ciudadanos (needs a centrist economic line, relations ≥ 55, Cs polling ≥ 3%); join Podemos (needs a left or progressive line, relations ≥ 55); found his own party (Avanza, Nuevo Rumbo or La Alternativa), whose starting vote depends on sanchismo and the new "style" scale (Establishment → Populist, raised by defiant, members-first and anti-establishment choices); stay on the PSOE backbenches and wait for a comeback primary (if not expelled; offered after 12 months when the PSOE is losing); or retire (game over). Losing a forced primary after open confrontation, or with a populist profile, means expulsion.

After joining or founding a party, card and event effects aimed at the PSOE apply to Sánchez's party; the PSOE-internal deck and advisers disappear; a "Sánchez's road back" deck holds organisation, recruiting, fundraising, bridges to the PSOE and, in Cs or Podemos, a bid for the leadership. Government formation runs automatically: each week the right's and the left's candidates are tried, the PSOE voting by its new leadership's line (abstaining for the right after a repeat election) and Sánchez's party by the line he sets (coalition, support, abstain, or against all). If he leads Cs, Podemos or his own party and it outranks its bloc rival, he is that bloc's candidate. A new party that wins no seats at a general election ends the game.

PP succession: pressure builds when the PP loses power (3), is not the largest party after an election (2), loses 10+ seats or fails to form a government (1). A PP leader in office is safe; otherwise the chance of being forced out is 25% at 1, 60% at 2, certain at 3. Successors by period, weighted by the right's mood (a strong Vox favours a hard-liner, a strong Cs a moderate): Sáenz de Santamaría (moderate), Casado (hard), Cospedal (establishment) to 2018–19; Feijóo (moderate) from 2019; Ayuso (hard) from 2021. Hard-liners pull Vox voters back and lose centrists, warm PP–Vox relations and chill the PNV; moderates do the opposite.

Advisers (pinned, sharing one action timer): Antonio Hernando (parliament), the Secretary of Organisation (César Luena to 2016, José Luis Ábalos from 2017: federations, finances, discipline), Adriana Lastra (Podemos channel, members, equality), Iván Redondo from 2017 (private polling without the published error, narrative, the centre) and, in government, María Jesús Montero (spending, regional financing, budget partners).

### 7.5 Election results

Every general and regional result shows vote share, change in vote share, seats, seat share and change in seats against the previous election (green ▲ up, red ▼ down, (-) unchanged), and a map of the most-voted party in each province (Natural Earth boundaries, `tools/build_map.py`); hovering a province shows its vote shares, and autonomous communities are outlined (bold on regional-election maps). The sidebar's Regions tab has a dropdown with each community's government (cabinet, external support, majority type) and its parliament's seat diagram.

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
