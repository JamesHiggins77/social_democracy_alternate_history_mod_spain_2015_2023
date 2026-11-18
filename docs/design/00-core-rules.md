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
| PP alone holds an absolute majority (≥ 176 seats) | **Game over** |
| PP and Vox form a coalition government | **Game over** |
| PP + Vox hold a majority but have not formed a coalition | Game continues |
| PP minority government, or PP governing with Vox's outside support | Game continues |

When the PP asks for the PSOE's support and PP + PSOE hold a majority, the player can offer a grand coalition so the PP does not need Vox. The PP accepts depending on PSOE–PP relations, its leader (a moderate is likelier, a hard-liner less likely), how cold PP–Vox relations are, and the SPD lesson. A grand coalition keeps the game going with the PSOE as junior partner, but costs heavily: left-wing voters move to Podemos and IU, the progressives and unions revolt, and morale falls. The constant `PP_ALONE_LOSS_SEATS` (176) can be tuned.

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

A week always has something to play: if every National politics card is on cooldown, the deck offers *A quiet week* (lowest priority, so it only appears when nothing else can), which passes the week. Without it an acting PSOE government with no negotiations deck could run out of cards and stall the game.

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

- **Party funds** (abstract units): start at 6, earn income and pay rising running costs each month (see §7.9). A general election has no fixed cost; the party spends what it chooses in the final campaign (§7.10), a round of regional campaigns 1, and big-hall rallies, the branch tour, digital campaigns and member consultations cost 1 each. The *Party finances* card raises funds (donors, micro-donations, or a bank loan repaid from income). Debt lowers morale and authority each month.
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

Losing is no longer necessarily the end, except in the scripted 2016–17 window, which keeps the May 2017 primary. Afterwards the routes are hard to earn:
- **Join Ciudadanos**: relations with Cs of 90+, an economically moderate line (economic position −3 to 1), and a record as a hardliner against independence (hard-line Catalan choices and the 2016 red lines count for it; dialogue, a referendum offer or pardons count against), with Cs polling 3%+.
- **Join Podemos**: relations with Podemos of 90+, a progressive social line (3+), a radical economic line (6+) and a populist style (8+ on the style scale), with Podemos polling 3%+.
- **Found the Pedro Sánchez List**: only with a dominant personal following (sanchismo 80+).
- **Stay on the PSOE backbenches** (not if expelled) and wait for a comeback primary, offered after 12 months when the PSOE is losing.
- **Retire** (game over).
Options that are not available are hidden, and the event says why. Expelled with none of the first three open, the game ends at once: Sánchez's career is over. Losing a forced primary after open confrontation, or with a populist profile, means expulsion.

After joining or founding a party, card and event effects aimed at the PSOE apply to Sánchez's party; the PSOE-internal deck and advisers disappear; a "Sánchez's road back" deck holds organisation, recruiting, fundraising, bridges to the PSOE and, in Cs or Podemos, a bid for the leadership. Government formation runs automatically: each week the right's and the left's candidates are tried, the PSOE voting by its new leadership's line (abstaining for the right after a repeat election) and Sánchez's party by the line he sets (coalition, support, abstain, or against all). If he leads Cs, Podemos or his own party and it outranks its bloc rival, he is that bloc's candidate. A new party that wins no seats at a general election ends the game.

PP succession: pressure builds when the PP loses power (3), is not the largest party after an election (2), loses 10+ seats or fails to form a government (1). A PP leader in office is safe; otherwise the chance of being forced out is 25% at 1, 60% at 2, certain at 3. Successors by period, weighted by the right's mood (a strong Vox favours a hard-liner, a strong Cs a moderate): Sáenz de Santamaría (moderate), Casado (hard), Cospedal (establishment) to 2018–19; Feijóo (moderate) from 2019; Ayuso (hard) from 2021. Hard-liners pull Vox voters back and lose centrists, warm PP–Vox relations and chill the PNV; moderates do the opposite.

Advisers (pinned, sharing one action timer): Antonio Hernando (parliament), the Secretary of Organisation (César Luena to 2016, José Luis Ábalos from 2017: federations, finances, discipline), Adriana Lastra (Podemos channel, members, equality), Iván Redondo from 2017 (private polling without the published error, narrative, the centre) and, in government, María Jesús Montero (spending, regional financing, budget partners).

### 7.9 Chaos, the economy and society

**Chaos** (0–100, shown as Stability: Calm, Restless, Turbulent, Chaotic, In turmoil) is recalculated monthly from: unemployment above 13% and negative growth; an acting government (10, plus 2 a month up to 15) and repeat elections (6 each); migration (a background level by year, highest in 2018 and 2020–21, plus event tension: the Aquarius, Ceuta, the Canary route, Ukraine); the Catalan crisis (15) and its aftermath (the 2019 sentence adds tension that fades); PP corruption while the PP governs; the pandemic (March 2020 to June 2021); and low social cohesion. It is smoothed (70% last month, 30% new).

From 2016 (2014–15 follows the real polls), chaos feeds Vox and, less, Podemos every month: Vox takes from the PP, Cs and (a little) the PSOE, at 30% strength until it breaks through (2018, or its first regional seats) and slowing as it nears its ceiling (21%, 34% while a grand coalition sits); learning the Danish model cuts its chaos-driven gains, and the migration part of the national question, by a fifth. When chaos falls below 25, Vox's protest voters drift back to the PP (1.2% of Vox's vote a month for every ten points of calm), except to a PP governing with the PSOE. Vox's first regional seats trigger a breakthrough event with a further jump.

**Vox as a force.** Before its breakthrough Vox is a fringe party (0.2% in 2015, no seats anywhere), and events and choices only name it once `vox_on` is set: Vox has regional seats, seats in Congress or polls 3% or more.

**The national question.** Once Vox is a force it also grows whatever the general mood, on the issues that carried it from 0.2% to 15% in 2018–19 under a PSOE government that had calmed most of the rest (`nationalQuestion`, rate `VOX_NATIONAL_RATE`): Catalan tension and the crisis itself; a left-wing government that relies on ERC, Junts or Bildu (a government born of a censure those parties voted for counts); dialogue and pardons; a progressive social course in government; and migration above its background level.

**Vistalegre.** Vox's October 2018 rally (`voxRally`, used by the event and by the replay) adds 4 support points plus 2 per step of Catalan dialogue, minus the hard line, plus 2 if the PP has been convicted of corruption.

**Ciudadanos**: its losses no longer recover from 2016. As the junior partner of a PP government it is absorbed (mostly by the PP), and from 2019, once Vox polls 5% or more, the right consolidates at its expense. **Podemos** loses 0.8% of its support a month from 2017 to internal strife, plus the Vistalegre II (2017) and Galapagar chalet (2018) events.

**Economy**: unemployment and growth follow the real figures by year (24.4% and +1.4% in 2014 to 12.2% and +2.5% in 2023, with the 2020 pandemic recession) plus adjustments from any government's decisions (minimum wage, labour reform, taxes, budgets, the pandemic response, the recovery fund, the Iberian exception, tariffs, Ukraine). Growth shocks fade within a year; unemployment follows growth (Okun) and fades slowly. A long acting government and high chaos slow growth. Unemployment above its historical level costs the governing party votes. PP governments trim the deficit each January.

**Society**: social cohesion (Fractured, Tense, Strained, Stable, Cohesive) moves a tenth of the way each month towards a target set by unemployment, chaos and accumulated social policy (minimum wage, pensions, labour rights, memory, "only yes means yes", reception of migrants; PP governments subtract a little each year, PP–Vox governments more). Low cohesion adds to chaos.

**Investiture**: ERC abstains on a Sánchez investiture backed by a Podemos coalition if the red lines are gone and there is a dialogue table (or relations of 50+), as in January 2020; Bildu abstains from relations of 30. Winning a primary lifts the 2016 red lines. After the right's candidate loses a vote, the King offers Sánchez the nomination.

**Party money**: income is 0.2 + seats/350 a month plus 0.15 per dues level; running costs are 0.03 + 0.03 per year since 2014; general elections have no fixed cost (see the final campaign, §7.10). The Party dues card raises dues (money, but members and some voters leave) or cuts them (members and goodwill, less money). The Socialist International and Progressive Alliance card spends money on hosting a conference (1.5: relations abroad) or studying a sister party (0.5). What the PSOE learns depends on who leads that party at the time, lessons can cut both ways, and studying the same leadership again has diminishing returns (full, then 1/2, 1/3...):
British Labour — Miliband (to 2015): a sharper cost-of-living message on wages; Corbyn (2015–20): energises the young, members and progressives but loses pensioners, professionals and the self-employed to the PP and Cs and angers the barons; Starmer (2020–): wins the middle class and calms modernisers, but loses young voters to Podemos and angers progressives.
Portugal — Seguro (2014): little; Costa in opposition (2014–15): a programme the radical left could sign; Costa's "contraption" (2015–22): written agreements with each partner, much easier talks with Podemos; Costa's majority (2022–): squeezes Podemos voters (the useful vote) and sours relations.
Denmark — Thorning-Schmidt (to 2015): governing with liberals, warmer Cs; Frederiksen (2015–): Vox gains less from migration (20% less per full lesson, up to 30%), progressives object, socially more conservative.
Germany — Gabriel (to 2017): grand-coalition stability, warmer PP, members uneasy; Schulz (2017–18): a short burst of enthusiasm, then doubt; Nahles and successors (2018–21): "never prop up the right"; Scholz (2021–): calm competence, middle-class appeal.
Sweden — Löfven (to 2021): the negotiated welfare model raises cohesion; Andersson (2021–): welfare plus a NATO turn.
US Democrats' leadership — Obama (to January 2017): data-driven campaigning; Pelosi and Schumer (2017–21): leading a broad coalition and getting things done (easier partners, calmer barons and institutionalists, angers the left); Biden (from 2021): union and middle-class pitch.
US Democrats' progressives (from February 2017) — Bernie Sanders, joined by Alexandria Ocasio-Cortez from November 2018 (stronger): energise the progressives and the young and grow sanchismo; alienate the barons and the institutionalists.
Italian Democratic Party — Renzi (to 2018): centrist modernisation, unions and progressives angry; Martina (2018–19): little; Zingaretti (2019–21): governing with populist partners, easier talks with Podemos; Letta (2021–23): pro-European seriousness; Schlein (2023–): a turn left, young voters and progressives.
PASOK — the closest analogy to the PSOE and Podemos: Venizelos (to 2015): the price of austerity and grand coalitions (steels the left, cools the PP); Gennimata (2015–21): holding the centre-left against Syriza (wins back Podemos voters, colder Podemos); Androulakis (2021–): a slow recovery as the radical left fades.
Every option that costs party funds says so on the choice ("Costs N in party funds").
Campaign skill (from Labour and Obama) adds up to +30% to campaign gains. Each option shows a one-line hint of what the current leadership teaches and, if studied before, how strong the next lesson will be.

**Foreign relations** improve with diminishing returns (a gesture adds less the warmer relations already are) and drift 2% a month back towards 55 without attention.

### 7.10 The final campaign

Just before every general election (when Sánchez leads a party), a final-campaign screen lets the party spend what is left, 1 in funds per spend, and shows the projected election-day vote and seats as money goes in:

- **A group** (young people, students, pensioners, working class, middle class, women, the unemployed, rural Spain): +1.5 support points across the classes it reaches (rural Spain: +3% in six rural communities).
- **A region** (the thirteen largest communities): +5% to the party's vote there.
- **Attack ads** against the PP, Cs, Podemos, Vox (or the PSOE, after Sánchez has left it): the rival loses up to 0.8 points in every class; a quarter of that comes to the player's party (a fifth for a new party) and the rest scatters to the rival's neighbours. One attack in five backfires and costs the player's party instead.

These are the values for a first spend. Last-minute money buys little (`FINAL_SCALE` = 0.5, half of what the same money once bought), so funds are worth more spent during the legislature than hoarded for election night. Repeating the same spend within one campaign has diminishing returns (full, 1/2, 1/3...), and every unit already spent in the campaign cuts the next by a further 10% (`FINAL_SATURATION`): after ten units a fresh spend does half of what the first did. The screen says what a fresh spend is now worth. Measured in April 2019: one unit on the working class buys +0.3 points on the day; five different spends +0.9; fourteen +1.5; twenty-eight +1.9 (it was +6.9 and 27 seats before the cut). The effects apply to the election-day vote only; 15% of them persists afterwards, so the polls barely move. The last-minute swing shows up in the pollsters' miss on the results page.

### 7.11 Regions map, representation, people and links

**Paths to a majority.** Each general election's results page lists the plausible arrangements — left bloc, left bloc with the nationalists and ERC/Bildu abstaining, PSOE–Cs (with or without Podemos abstaining), PSOE–Podemos–Cs, a grand coalition, PP–Cs (with or without the PSOE abstaining), PP–Vox, PP–Cs–Vox, the PP alone, and a PSL-led left when the PSL has seats — with yes votes against the 176 needed and whether it passes on the first ballot, only on the second (more yes than no), or how far short it falls. Parties without seats (Vox before its breakthrough, Más País before 2019...) are left out, and an arrangement is shown only if all its core parties have seats.

**General election map.** Provinces won by a different party than at the previous general election (for the first, the real 2011 result) are drawn in a darker shade of the new winner's colour; the hover card says who it was gained from, and a line under the legend counts the flips.

**Regions tab.** A map of the autonomous communities sits above the list. By default it colours each community by the party holding the presidency (the same map follows each round of regional elections). A selector switches to one party or bloc: the PSOE, PP, Podemos, Cs, Vox (from 2018 or its first regional seats), IU (including I-E in Navarre) or the regionalist parties as one bloc. Shades: dark for a presidency with its own absolute majority, full colour for the presidency, lighter for a junior coalition partner, pale for external support, blank in opposition, grey hatching where the party has no seats in that parliament. For the regionalist bloc the most influential regionalist party in each community decides. Hovering a community shows its president and government; clicking a community on the map or a row in the list opens its details.

**Representation** (Politics tab), for the PSOE or Sánchez's current party: Congress seats; Senate (208 elected by limited vote from each general election's provincial results — 3 seats for the first party and 1 for the second in each mainland province, island and Ceuta/Melilla rules — plus 58 appointed by the regional parliaments by D'Hondt over their groups); European Parliament (the real 2014 result, then a national D'Hondt vote in May 2019 with no threshold, 54 seats, 59 after Brexit from February 2020); regional parliament seats; regional presidencies and governments the party sits in. Local government is not modelled: there is no municipal data in the game to drive it plausibly.

**People and parties in the text** are coloured by party (light colours darkened for legibility). Hovering a party shows a sentence in the form "The <native name> (en: <English name>) is a <ideology> party in <country>, <facts>" and its current leader with their faction or wing (PSOE, PP, Podemos, Cs and the sister parties follow the game; others change on their real dates). Hovering a person shows a card with the party's colour badge (the real logos are trademarks and not bundled), name, role, and wing or ideology (PSOE figures by the game's factions). About 115 Spanish and foreign politicians and 30 party names are recognised; longest names match first, so "Pedro Antonio Sánchez" is not mistaken for Pedro Sánchez. Key events, processes and legal texts (Article 155, Gürtel, La Manada, the 1 October referendum, the state of alarm, D'Hondt...) are marked too. Clicking any of them opens its English Wikipedia page in a new tab (the Spanish Wikipedia where there is no English page: Pepe Álvarez, Teresa Rodríguez, Nacho Álvarez, Verónica Pérez, the 2012 labour reform, the "only yes means yes" law); inside a choice button they get colour and the card but stay part of the button. Wikipedia titles were checked against en.wikipedia.org; the Canary route has no reliable page in either language and is not linked.

### 7.12 The cabinet

The government has a Prime Minister and 14 posts: First Deputy Prime Minister, Finance, Economic Affairs, Foreign Affairs, Interior, Defence, Justice, Labour, Social Rights and Pensions, Health, Education, Territorial Policy, Ecological Transition and Equality. Ministers carry historical names for the party holding the post (Montero, Calviño, Borrell for the PSOE; Montoro, De Guindos, Báñez for the PP; Iglesias, Yolanda Díaz, Irene Montero for Podemos...), or "a <party> nominee" otherwise. The cabinet is shown in the Politics tab, with how many ministries the player's party holds.

A single-party government takes every post. In a coalition, the junior partner gets a share in proportion to its seats (at least two), chosen from what it asks for first (Podemos: Social Rights, Labour, Equality...; Cs: Economic Affairs, Education...; Vox: Interior, Defence, Justice...; the PSOE as junior: Finance, Labour, Foreign Affairs...), and the deputy premiership if it has a quarter of the senior partner's seats. When the player's party enters a coalition, a coalition-agreement event lets the player accept the draft, or — as the senior partner — be generous (two more posts and the deputy premiership: better relations, restless barons) or drive a hard bargain (keep the economic and security ministries: worse relations, more authority); as the junior partner, insist on Finance and Economic Affairs (the senior may refuse) or take the social ministries.

Government cards need the matching ministry: the budget and tax reform need Finance; the minimum wage and labour reform need Labour; pensions need Social Rights; historical memory needs Justice or the deputy premiership; foreign tours need Foreign Affairs; a reshuffle needs the premiership. María Jesús Montero is an adviser only while the party holds Finance. The Government deck appears whenever the player's party is in government, including as a junior partner.

### 7.13 The barons' plot

A plot score (0–100, shown in the Politics tab as Quiet, Murmurs, Organising or Imminent) measures how close the regional barons and the Federal Executive are to moving against Sánchez. It rises with bad results (1.5 per seat lost at a general election, +15 under 100 seats, +25 under 90; +8 for each regional presidency lost), with a losing streak (1.5 a month while the PSOE has under 100 seats and is out of government), a hostile Federal Committee, a divided party, weak polls and Susana Díaz's enmity (to 2018), and above all with a left-wing course: economic radicalism, a Podemos pact, a referendum offer and concessions to the independence parties. Loyalists in key posts lower it each month; it decays slowly.

At 60 the barons move: the Federal Executive resigns en masse and Verónica Pérez, President of the Federal Committee, declares herself the party's only authority, backed by Susana Díaz, García-Page, Lambán and Fernández Vara. Sánchez can fight it out in the Federal Committee (Federal Committee balance, loyalists and morale against the plot, the barons' strength and his left-wing course), appeal to the members in a snap primary, or resign. Surviving resets the plot and strengthens him.

The *Placing your people* card (Party deck) puts sanchistas in power: the Federal Executive (safe; angers the institutionalists), the regional federations (a gamble: success breaks the barons' hold, failure strengthens them), the parliamentary group, and, with a members' mandate, new statutes letting only the members elect and remove the leader. Repeats give diminishing returns.

**The crisis as a sequence** (modelled on September–October 2016, but possible in any deadlock): during government formation, at plot 40 Fernández Vara breaks ranks (debate, dismiss, or ask for authority to explore an alternative government); at 50 García-Page attacks (call primaries and a congress, which provokes the barons; promise to abide by the Federal Committee, which defuses the plot but cedes the abstention decision; or ignore him) and Felipe González claims Sánchez had promised to abstain (deny or stay silent). At 60 the rebellion comes; Sánchez can refuse to recognise the resignations, which opens a "two authorities" stage (resign if the Committee votes for abstention, fight on procedure, or offer a compromise, each a different bonus) leading to the Saturday Federal Committee, told hour by hour, ending in a vote of about 240 delegates on an extraordinary congress (a secret ballot box or a show of hands). The barons' strength is the plot, their weight, Díaz's enmity, a left-wing course and, in a deadlock with the PSOE under 100 seats, the "Spain needs a government" argument; Sánchez's is the Committee's balance, loyalists in key posts and morale. In a historical-like position he gets about 100 votes and loses (in reality 107 to 132); with a few loyalists placed it is a coin flip.

After an ouster, the caretaker committee's abstention splits the group: a number of socialist deputies (more with a larger sanchismo) vote no, including the Catalan socialists, and Sánchez chooses whether to give up his seat (sanchismo and morale for the comeback), vote no with the rebels, or abstain with the group (sanchismo and morale fall). The May 2017 primary is a three-way race with Susana Díaz and Patxi López, with vote shares from morale and sanchismo (historically 50.3%, 39.9%, 9.8%).

If Sánchez is ousted, a caretaker committee (Javier Fernández to 2018) runs the PSOE for eight months before an elected leader takes over. While no government has been formed, it abstains to let the PP govern in four cases out of five, as in October 2016.

### 7.14 Faction leaders

Each PSOE faction shows its leader in the Politics tab (hover card and Wikipedia link where there is a page):
- Regional Leaders: Susana Díaz while she governs Andalusia and is not herself PSOE leader; otherwise Emiliano García-Page, the most outspoken critical baron.
- Institutionalists: Alfredo Pérez Rubalcaba until the 2016 crisis; Javier Fernández, the caretaker, until he leaves the Asturian presidency in mid-2019; then Carmen Calvo.
- Progressives: José Antonio Pérez Tapias (Izquierda Socialista) until mid-2017; then José Luis Rodríguez Zapatero, champion of left-wing alliances.
- Modernisers: Eduardo Madina until he leaves politics in September 2017; then Patxi López — except while a PSOE government has made Nadia Calviño its Economy minister (from mid-2018), when she leads the government's technocratic wing, shown in grey as an independent.
- Trade Unionists: the UGT's leaders, Cándido Méndez until March 2016, then Pepe Álvarez.

### 7.15 Ending deadlocks, one rebellion

**Deadlock fatigue.** Spain never voted three times in a row: after one repeat election (2016, November 2019) a government formed. After a repeat election, Ciudadanos and the small regional parties (PNV, CC, PRC, Teruel Existe, NC) abstain rather than block the largest party's candidate. If six weeks of talks then pass without a deal, the second-largest of PP and PSOE abstains: the PP for a PSOE-led Congress, the PSOE's deputies for a PP-led one (as in October 2016). On the eve of a second dissolution the largest party's candidate always gets one last vote with that abstention, so Spain never votes three times in a row.

**One rebellion per game.** The barons' coup (or the older Federal Committee revolt) and its warnings (Fernández Vara, García-Page, Felipe González) happen at most once in a game. Challenges driven by low authority (rumours, a challenger, a forced primary) are separate.

**Historical anchors.** An acting PP Prime Minister who still leads the largest party is not forced out (Rajoy through 2016). The Gürtel sentence (May 2018) offers a motion of no confidence on the spot.

**Economy.** Policy effects are stronger and last longer (unemployment effects fade by about half over eight years); a governing PSOE's economic line moves growth and cohesion each year. Only unemployment more than a point above its historical level costs the governing party votes. Incumbency wear is gentle (0.1 points per class a month for a PSOE government, 0.15 for a PP one), and a new PSOE government gains a little visibility in its first year.

### 7.16 Calibration against the real 2015–2023 path

A replay script plays Sánchez's real decisions with the game's own effects (the 2016 caretaker abstention, the Gürtel censure, the Aquarius, pensions, the minimum wage, Franco's exhumation, the coalition, the lockdown, the pardons, the labour-reform agreement) and compares each general election with the real one. The changes that brought it close:
- **Lasting shifts stick.** Campaign effects fade towards a level that itself follows sustained changes (4% a month), so Podemos voters returning to the PSOE or the PP's collapse persist, while a quick bounce still fades.
- **Ciudadanos backs a PP government from outside** (as in 2016) unless PP–Cs relations are warm (65+), which spares it the junior partner's slow absorption; propping the PP up still costs it a little. The Catalan crisis rallies anti-independence voters to Cs.
- **The censure.** A successful motion of no confidence brings the new Prime Minister's bounce (Podemos and Cs voters come to the PSOE), and if it follows a corruption conviction the PP's voters scatter to Cs, Vox and the PSOE.
- **Podemos declines** faster from 2017 (1.1% of its vote a month), and chaos feeds it only a third as much after 2016.
- **Vox** grows faster once the Catalan crisis has happened, its Andalusian breakthrough and the 2019 sentence take more PP and Cs voters, and its voters drift back to the PP only when things are calm (chaos under 25). The national question (§7.9) carries it through 2018–19.
- **Ciudadanos's 2019 collapse.** If, from 2018, Cs could have let the PSOE govern just by abstaining and refused (relations below 50), the repeat election is blamed on it and it loses heavily, mostly to the PP and Vox.
- **Government.** A new PSOE government draws some Podemos and Cs voters in its first year; wear is gentle afterwards.

Result of the replay (game seats, real in brackets): April 2019 PSOE 99 (123), PP 90 (66), Podemos 46 (42), Cs 47 (57), Vox 30 (24); November 2019 PSOE 109 (120), PP 99 (89), Podemos 41 (35), Cs 13 (10), Vox 49 (52); July 2023 PSOE 96 (121), PP 148 (137), Podemos/Sumar 23 (31), Cs 0 (0), Vox 39 (33). Vox's vote: 11.0% (10.3%), 14.3% (15.1%), 12.6% (12.4%).

An earlier version of the replay left out the Vistalegre rally (October 2018), the largest single Vox event, and so reported Vox far too low in 2019 (10 and 25 seats). With the rally the old model gave Vox 46, 59 and 49 seats: too early and too lasting. The rally is now smaller, the national question carries Vox's growth under a PSOE government, and calm returns its protest voters to the PP faster.

`tools/playtest.js` plays the compiled game headless with random cards and choices (`--grand` always offers a grand coalition when it can). Over 80 random games Vox averages 57 seats at elections from 2019 (15.6%), above history (24, 52, 33) because random play is far more chaotic than the real legislatures: more acting governments, repeat elections and PP governments under scandal.

### 7.5 Election results

Every general and regional result shows vote share, change in vote share, seats, seat share and change in seats against the previous election (green ▲ up, red ▼ down, (-) unchanged), and a map of the most-voted party in each province (Natural Earth boundaries, `tools/build_map.py`); hovering a province shows how many deputies it elects and, for each party, its vote share and the seats it won there (every party with a seat is listed, even outside the top five); on regional maps, provinces that are not themselves districts (the Canary islands, Asturias's districts) show the whole regional parliament. Autonomous communities are outlined (bold on regional-election maps). The sidebar's Regions tab has a dropdown with each community's government (cabinet, external support, majority type) and its parliament's seat diagram.

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

### 7.17 The road back and the grand coalition

**Backbench campaign.** Out of the leadership, Sánchez builds a comeback with three resources, shown in the sidebar:

| Resource | Raised by | Effect |
|---|---|---|
| Network (0–100) | Team, online army, interviews, programme, tours | Up to +12 points in the comeback primary |
| Barons won over (0–3) | Court a baron (federal promises or posts) | +2.5 points each |
| War chest | Small donors, wealthy donors, private work | Up to +4 points |
| Relations with the leadership (0–100) | Loyal votes, praise, silence | Below 40, the apparatus mobilises: up to −4 points |

- Backbench cards, each on its own timer: Break your silence, Build your team, The war chest, A vote in Congress, Court a baron, The programme for the comeback, The online army, The battle of ideas, Friends abroad.
- Most choices trade the members against the leadership: attacks and rebellions grow Sánchez's following, but cost the PSOE voters (to Podemos and Cs) and raise an expulsion risk. Repeated whip-breaking can get him expelled, which sends him to the exile choice.
- Force a primary: with a network of 30+, he can collect the members' signatures and trigger the comeback primary early. Losing it costs 40% of the network and two years.
- Keep a low profile now has a three-month timer, so it can no longer be played every month.

**Exile cards** for the Pedro Sánchez List, Cs or Podemos: On the road (heartlands, cities, or television), What the party stands for (the party's line, his own, or anti-establishment), and The past comes calling (a scandal from six months after leaving, which can be fought, explained, or ignored as a gamble).

**Grand coalition.** A PP–PSOE grand coalition is possible whenever the two have 176 seats and the PP accepts.
- At formation: PSOE voters go to Podemos (and IU and Más País); progressives and unions revolt. Once Vox is a force, the PP's hard right goes to Vox in large numbers (about 4 points at once), with some Cs voters; before that, the PP's discontented go to Ciudadanos or stay at home, and the text does not mention Vox.
- While it lasts, every month: PSOE→Podemos transfers, and union and progressive dissent rises. Once Vox is a force it is the only opposition on the right and takes from the PP (`VOX_GRAND_RATE`), Cs and the PSOE's older and working-class voters; its ceiling rises to 34% and calm no longer sends its voters back to the PP. Before its breakthrough the PP's leak goes mostly to Cs, with a trickle to Vox that can build into a breakthrough.
- Measured on the real path: a grand coalition after November 2019 takes Vox from 14% to 18% at formation, 23% after a year, 27% after two and 31% (133 seats) by July 2023, against 13% and 39 seats on the real path. The old version gave about +5 points over two years.
