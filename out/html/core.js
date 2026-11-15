window.game={"compiled":"{\"title\":\"Social Democracy: Spain 2015–2023\",\"author\":\"A mod of Autumn Chen's Social Democracy: An Alternate History\",\"ifid\":\"7FCDF039-2B77-4179-B795-CBAFA65253AA\",\"content\":\"\",\"scenes\":{\"prevScene\":{\"id\":\"prevScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"prevTopScene\":{\"id\":\"prevTopScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"jumpScene\":{\"id\":\"jumpScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"backSpecialScene\":{\"id\":\"backSpecialScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"returnScene\":{\"id\":\"returnScene\",\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"cancel_advisor_action\":{\"id\":\"cancel_advisor_action\",\"type\":\"scene\",\"title\":\"Cancel action.\",\"viewIf\":{\"$code\":\"return ((Q['last_advisor_action'] || 0)===1);\"},\"goTo\":[{\"id\":\"root\"}],\"onArrival\":[{\"$code\":\"if (Q.month_actions > 0) {\\n    Q.month_actions -= 1;\\n}\\nQ.advisor_action_timer = 0;\\n// Canceling an advisor action\\n// reset the timer...\\nif (Q[card.id + \\\"_timer\\\"]) {\\n    Q[card.id + \\\"_timer\\\"] = 0;\\n}\\n// reduce visit count\\nif (this.state.visits[card.id]) {\\n    this.state.visits[card.id] -= 1;\\n}\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"credits.data\":{\"id\":\"credits.data\",\"title\":\"Election data\",\"options\":[{\"id\":\"@credits\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Election data\"},{\"type\":\"paragraph\",\"content\":\"General elections 2015–2023: official results of the Spanish Ministry of the Interior (infoelectoral), compiled in the MiCongreso project by josemam: https://github.com/josemam/MiCongreso\"},{\"type\":\"paragraph\",\"content\":\"Regional elections 2011–2023: official results compiled in the histEleccionesAutonomicas project by rricote: https://github.com/rricote/histEleccionesAutonomicas\"},{\"type\":\"paragraph\",\"content\":\"Electoral law: Spanish Constitution (arts. 68, 99, 113, 115) and the Ley Orgánica del Régimen Electoral General (arts. 162–163), plus each autonomous community's electoral law.\"}]},\"easy_discard\":{\"id\":\"easy_discard\",\"type\":\"scene\",\"title\":\"Return card to hand.\",\"viewIf\":{\"$code\":\"return (((Q['difficulty'] || 0) <= 0) && ((Q['last_advisor_action'] || 0)===0));\"},\"goTo\":[{\"id\":\"root\"}],\"onArrival\":[{\"$code\":\"if (Q.month_actions > 0) {\\n    Q.month_actions -= 1;\\n}\\n// return card to hand\\nvar card = this.state.lastPlayedCard;\\ncard.image = card.cardImage;\\nif (Q.difficulty >= 0) {\\n    this.state.currentHands['main'].push(card);\\n} else {\\n    this.state.currentHands['main.main_easy'].push(card);\\n}\\n// reset the timer...\\nif (Q[card.id + \\\"_timer\\\"]) {\\n    Q[card.id + \\\"_timer\\\"] = 0;\\n}\\n// reduce visit count\\nif (this.state.visits[card.id]) {\\n    this.state.visits[card.id] -= 1;\\n}\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"game_over.survived\":{\"id\":\"game_over.survived\",\"title\":\"The end of 2023\",\"newPage\":true,\"onArrival\":[{\"$code\":\"Q['game_over'] = 1;\"}],\"options\":[{\"id\":\"@root.start_menu\",\"title\":\"Return to the main menu\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"December 2023\"},{\"type\":\"paragraph\",\"content\":\"Pedro Sánchez reaches the end of 2023 as leader of the PSOE.\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"He is Prime Minister: \",{\"type\":\"insert\",\"insert\":1},\". \"],\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"He leads the opposition to \",{\"type\":\"insert\",\"insert\":3},\". \"],\"predicate\":2},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Sánchez's authority: \",{\"type\":\"insert\",\"insert\":4},\"/100. PSOE unity: \",{\"type\":\"insert\",\"insert\":5},\"/100.\"]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['government_type'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pm'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sanchez_authority'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_unity'] || 0);\"}}]}},\"game_over\":{\"id\":\"game_over\",\"type\":\"scene\",\"title\":\"Game over\",\"newPage\":true,\"onArrival\":[{\"$code\":\"Q['game_over'] = 1;\"}],\"options\":[{\"id\":\"@root.start_menu\",\"title\":\"Return to the main menu\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Game over\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Without the party behind him, Sánchez's project ends here. \",\"predicate\":1},{\"type\":\"conditional\",\"content\":\"With the right holding a commanding majority, there is no route back to government before the end of the period.\",\"predicate\":2}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['loss_text'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"}}]}},\"library.menu\":{\"id\":\"library.menu\",\"options\":[{\"id\":\"@library.system\",\"title\":\"Spain's system of government\"},{\"id\":\"@library.elections\",\"title\":\"How elections work\"},{\"id\":\"@backSpecialScene\",\"title\":\"Exit the library\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"main.deck_politics\":{\"id\":\"main.deck_politics\",\"title\":\"Negotiations and media\",\"cardImage\":\"img/spain/deck_congreso_fachada.jpg\",\"isDeck\":true,\"options\":[{\"id\":\"#sp_politics\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"post_event.events_choice\":{\"id\":\"post_event.events_choice\",\"options\":[{\"id\":\"#sp_event\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"post_event\":{\"id\":\"post_event\",\"type\":\"scene\",\"title\":\"Post Event\",\"newPage\":true,\"onArrival\":[{\"$code\":\"Q.last_advisor_action = 0;\\nif (typeof window !== 'undefined' && window.SpainGame) {\\n    if (Q.month_actions >= 1) {\\n        window.SpainGame.endOfMonth(Q);\\n    } else {\\n        window.SpainGame.recalculate(Q);\\n    }\\n    Q.loss_text = window.SpainGame.lossReason(Q);\\n}\\nQ.is_lost = Q.loss_text ? 1 : 0;\\nQ.reached_end = (Q.year > 2023) ? 1 : 0;\\nQ.acting = Q.government_status == 'acting' ? 1 : 0;\\nQ.has_event = 0;\\nvar scene = this.game.scenes['post_event.events_choice'];\\nvar choices = this._compileChoices(scene);\\nif (choices && choices.length && choices[0].title != \\\"Continue...\\\") {\\n    Q.has_event = 1;\\n}\"}],\"goTo\":[{\"id\":\"game_over\",\"predicate\":{\"$code\":\"return ((Q['is_lost'] || 0)===1);\"}},{\"id\":\"game_over.survived\",\"predicate\":{\"$code\":\"return ((Q['reached_end'] || 0)===1);\"}},{\"id\":\"post_event.events_choice\",\"predicate\":{\"$code\":\"return ((Q['has_event'] || 0)===1);\"}},{\"id\":\"main\",\"predicate\":{\"$code\":\"return ((Q['has_event'] || 0)===0);\"}}],\"content\":{\"content\":{\"type\":\"heading\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":0},\" \",{\"type\":\"insert\",\"insert\":1}]},\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['year'] || 0);\"}}]}},\"return\":{\"id\":\"return\",\"type\":\"scene\",\"title\":\"Back to main\",\"goTo\":[{\"id\":\"root\"}],\"onArrival\":[{\"$code\":\"if (((Q['difficulty'] || 0) < 0) ) { Q['month_actions'] = (Q['month_actions'] || 0) - 1; }\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"root.start_menu\":{\"id\":\"root.start_menu\",\"newPage\":true,\"goTo\":[{\"id\":\"root.start_menu_2\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Social Democracy: Spain 2015–2023\"},{\"type\":\"paragraph\",\"content\":\"20 December 2015. The two-party system has broken. You are Pedro Sánchez, Secretary-General of the PSOE. Win power, keep it, and keep a PP majority, or a large PP–Vox majority, from closing every path to government.\"}]},\"status.politics\":{\"id\":\"status.politics\",\"title\":\"Politics\",\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.congress) {\\n    window.SpainGame.renderFactions(Q, 'sp-side-factions');\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"PSOE factions\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-factions\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Sanchismo (loyalty network): \",{\"type\":\"insert\",\"insert\":0},\"/100\"]},{\"type\":\"paragraph\",\"content\":[\"Federal Committee support for Sánchez: \",{\"type\":\"insert\",\"insert\":1},\"%\"]},{\"type\":\"heading\",\"content\":\"Relations\"},{\"type\":\"paragraph\",\"content\":[\"PP: \",{\"type\":\"insert\",\"insert\":2},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Ciudadanos: \",{\"type\":\"insert\",\"insert\":3},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Podemos: \",{\"type\":\"insert\",\"insert\":4},\"\"]},{\"type\":\"paragraph\",\"content\":[\"IU: \",{\"type\":\"insert\",\"insert\":5},\"\"]},{\"type\":\"paragraph\",\"content\":[\"ERC: \",{\"type\":\"insert\",\"insert\":6},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Junts: \",{\"type\":\"insert\",\"insert\":7},\"\"]},{\"type\":\"paragraph\",\"content\":[\"EAJ-PNV: \",{\"type\":\"insert\",\"insert\":8},\"\"]},{\"type\":\"paragraph\",\"content\":[\"EH Bildu: \",{\"type\":\"insert\",\"insert\":9},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Coalición Canaria: \",{\"type\":\"insert\",\"insert\":10}]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sanchismo'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['federal_committee_balance'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_pp'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_cs'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_up'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_iu'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_erc'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_junts'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_pnv'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_bildu'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['rel_cc'] || 0);\"}}]}},\"election_lab.lab_baseline\":{\"id\":\"election_lab.lab_baseline\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 1;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_advisers.cs_channel\":{\"id\":\"sp_advisers.cs_channel\",\"title\":\"Work the Ciudadanos channel\",\"subtitle\":\"Talks with Ciudadanos advance; Podemos notices.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['cs_talks'] = (Q['cs_talks'] || 0) + 1;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 6;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 3;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Hernando knows Ciudadanos's parliamentary team well. The talks move a step forward.\",\"type\":\"paragraph\"}},\"sp_events.accept\":{\"id\":\"sp_events.accept\",\"onArrival\":[{\"$code\":\"Q['red_lines'] = 1;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 10;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 5;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 5;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 3;\"}],\"content\":{\"content\":\"The barons are satisfied. Talks with ERC and Convergència are now off the table, and everyone knows who wrote the rules.\",\"type\":\"paragraph\"}},\"sp_investiture.sign_cs\":{\"id\":\"sp_investiture.sign_cs\",\"title\":\"Sign a government agreement with Ciudadanos\",\"subtitle\":\"Ciudadanos will vote yes; Podemos will vote no.\",\"chooseIf\":{\"$code\":\"return ((((Q['cs_talks'] || 0) >= 2) && ((Q['pact_cs'] || 0)===0)) && ((Q['pact_up'] || 0)===0));\"},\"unavailableSubtitle\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Ciudadanos will not join an agreement that includes Podemos. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The talks with Ciudadanos are not far enough advanced.\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pact_up'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return (((Q['pact_up'] || 0)===0) && ((Q['cs_talks'] || 0) < 2));\"}}]},\"onArrival\":[{\"$code\":\"Q['pact_cs'] = 1;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 10;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 15;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 5;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 3;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 10;\\nQ['trade_unionists_dissent'] = (Q['trade_unionists_dissent'] || 0) + 5;\"}],\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.podemos\":{\"id\":\"sp_negotiations.podemos\",\"onArrival\":[{\"$code\":\"Q['up_talks'] = (Q['up_talks'] || 0) + 1;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 8;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 4;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 5;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 3;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Podemos's team arrives with a 98-page document and a list of ministries. \",{\"type\":\"conditional\",\"content\":\"The talks are now serious enough to sign something, if you want to.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['up_talks'] || 0) >= 2);\"}}]}},\"sp_party.convene\":{\"id\":\"sp_party.convene\",\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 8;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 2;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 3;\"}],\"content\":{\"content\":\"The meeting runs for five hours. You leave with their grudging support and the feeling that you now need their permission.\",\"type\":\"paragraph\"}},\"sp_start.responsible\":{\"id\":\"sp_start.responsible\",\"onArrival\":[{\"$code\":\"Q['posture'] = 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 3;\"}],\"content\":{\"content\":\"Refusing to back Rajoy while keeping every other door open reassures anti-PP voters and most of the party. Your critics will call it indecision.\",\"type\":\"paragraph\"}},\"credits.images\":{\"id\":\"credits.images\",\"title\":\"Image sources\",\"options\":[{\"id\":\"@credits\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Image sources\"},{\"type\":\"paragraph\",\"content\":\"Images are taken from Wikimedia Commons under open licences. Every image, with its author, licence and link, is listed in docs/assets.md in the game's repository.\"}]},\"library.system\":{\"id\":\"library.system\",\"goTo\":[{\"id\":\"library.menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The system of government\"},{\"type\":\"paragraph\",\"content\":\"Spain is a parliamentary monarchy. The King proposes a candidate for Prime Minister after consulting the parties. The candidate needs an absolute majority of the Congress of Deputies (176 of 350) in a first vote, or more yes than no votes in a second vote 48 hours later. Abstentions therefore matter.\"},{\"type\":\"paragraph\",\"content\":\"If no candidate is invested within two months of the first investiture vote, the Cortes are dissolved and a new election is held.\"},{\"type\":\"paragraph\",\"content\":\"A government can be removed only by a constructive motion of no confidence: an absolute majority must vote for a named alternative Prime Minister, who takes office immediately.\"},{\"type\":\"paragraph\",\"content\":\"The seventeen autonomous communities have their own parliaments and governments. Thirteen vote together each May with the municipal elections; Andalusia, Catalonia, the Basque Country and Galicia keep their own calendars.\"}]},\"main.deck_party\":{\"id\":\"main.deck_party\",\"title\":\"The party\",\"cardImage\":\"img/spain/deck_ferraz.jpg\",\"isDeck\":true,\"options\":[{\"id\":\"#sp_party\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"main\":{\"id\":\"main\",\"type\":\"scene\",\"title\":\"Next month\",\"setBg\":\"img/spain/bg_congreso_hemiciclo.jpg\",\"isHand\":true,\"onArrival\":[{\"$code\":\"if (Q.advisor_action_timer <= 0) {\\n    Q.pinnedCardsDescription = 'Advisers - an action is available.';\\n} else if (Q.advisor_action_timer == 1) {\\n    Q.pinnedCardsDescription = 'Advisers - next action in 1 month.';\\n} else {\\n    Q.pinnedCardsDescription = 'Advisers - next action in ' + Q.advisor_action_timer + ' months.';\\n}\"}],\"maxCards\":3,\"options\":[{\"id\":\"@main.deck_politics\"},{\"id\":\"@main.deck_party\"},{\"id\":\"#sp_advisor\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"Spain has an acting government. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":[\"The investiture clock is running: \",{\"type\":\"insert\",\"insert\":2},\" month(s) until the Cortes are dissolved. \"],\"predicate\":1},{\"type\":\"conditional\",\"content\":[\"A general election is called for \",{\"type\":\"insert\",\"insert\":4},\" \",{\"type\":\"insert\",\"insert\":5},\".\"],\"predicate\":3}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['investiture_clock'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['investiture_clock'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['election_year'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_year'] || 0);\"}}]}},\"root.start_menu_2\":{\"id\":\"root.start_menu_2\",\"options\":[{\"id\":\"@sp_start\",\"title\":\"New campaign (December 2015)\"},{\"id\":\"@election_lab\",\"title\":\"Election lab\"},{\"id\":\"@credits\",\"title\":\"Credits\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"root\":{\"id\":\"root\",\"type\":\"scene\",\"title\":\"Root Scene\",\"newPage\":true,\"goTo\":[{\"id\":\"post_event\",\"predicate\":{\"$code\":\"return ((Q['started'] || 0)===1);\"}},{\"id\":\"root.start_menu\",\"predicate\":{\"$code\":\"return ((Q['started'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"status.paramilitaries\":{\"id\":\"status.paramilitaries\",\"title\":\"Regions\",\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.regions) {\\n    window.SpainGame.renderRegions(Q, 'sp-side-regions');\\n}\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Regional governments\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-regions\\\"></div>\"}}]},\"election_lab.lab_up_merger\":{\"id\":\"election_lab.lab_up_merger\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 2;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_advisers.group\":{\"id\":\"sp_advisers.group\",\"title\":\"Hold the parliamentary group together\",\"subtitle\":\"Lower dissent among Institutionalists and Modernisers.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 6;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"A week of meetings with deputies, one by one. Nobody leaks for a while.\",\"type\":\"paragraph\"}},\"sp_events.soften\":{\"id\":\"sp_events.soften\",\"onArrival\":[{\"$code\":\"Q['red_lines'] = 1;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 2;\"}],\"content\":{\"content\":\"The final text bars any referendum, but leaves you to decide which parties you talk to. It is a draw, and both sides claim it.\",\"type\":\"paragraph\"}},\"sp_investiture.sign_up\":{\"id\":\"sp_investiture.sign_up\",\"title\":\"Sign a government agreement with Podemos\",\"subtitle\":\"Podemos will vote yes; Ciudadanos will vote no.\",\"chooseIf\":{\"$code\":\"return ((((Q['up_talks'] || 0) >= 2) && ((Q['pact_up'] || 0)===0)) && ((Q['pact_cs'] || 0)===0));\"},\"unavailableSubtitle\":{\"content\":[{\"type\":\"conditional\",\"content\":\"Podemos will not support a government built on a deal with Ciudadanos. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The talks with Podemos are not far enough advanced.\",\"predicate\":1}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['pact_cs'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return (((Q['pact_cs'] || 0)===0) && ((Q['up_talks'] || 0) < 2));\"}}]},\"onArrival\":[{\"$code\":\"Q['pact_up'] = 1;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 10;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 15;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 10;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + (12 + (8 * (Q['barons_veto'] || 0)));\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 6;\"}],\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.cs\":{\"id\":\"sp_negotiations.cs\",\"onArrival\":[{\"$code\":\"Q['cs_talks'] = (Q['cs_talks'] || 0) + 1;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 8;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 5;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 4;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 2;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 5;\\nQ['trade_unionists_dissent'] = (Q['trade_unionists_dissent'] || 0) + 2;\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"Albert Rivera's negotiators want labour-market flexibility, an end to the provincial councils and a hard line on Catalonia. \",{\"type\":\"conditional\",\"content\":\"An agreement is within reach.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['cs_talks'] || 0) >= 2);\"}}]}},\"sp_party.executive\":{\"id\":\"sp_party.executive\",\"onArrival\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 5;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 4;\\nQ['federal_executive_backing'] = 1;\"}],\"content\":{\"content\":\"Your executive backs you. The barons note that they were not asked.\",\"type\":\"paragraph\"}},\"sp_start.alternative\":{\"id\":\"sp_start.alternative\",\"onArrival\":[{\"$code\":\"Q['posture'] = 2;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 10;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 6;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 7;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 8;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 4;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\"}],\"content\":{\"content\":\"The members are energised. In Seville, Toledo and Mérida, regional presidents read the announcement with alarm.\",\"type\":\"paragraph\"}},\"credits.software\":{\"id\":\"credits.software\",\"title\":\"Software\",\"options\":[{\"id\":\"@credits\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Software\"},{\"type\":\"paragraph\",\"content\":\"Dendry and DendryNexus by Ian Millington and Autumn Chen. d3.js (BSD licence). d3-parliament by Geoffrey Brossard (MIT). jQuery (MIT).\"}]},\"credits\":{\"id\":\"credits\",\"type\":\"scene\",\"title\":\"Credits\",\"newPage\":true,\"options\":[{\"id\":\"@credits.data\",\"title\":\"Election data\"},{\"id\":\"@credits.images\",\"title\":\"Image sources\"},{\"id\":\"@credits.software\",\"title\":\"Software\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Credits\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"emphasis-2\",\"content\":\"Social Democracy: Spain 2015–2023\"},\" is a mod of \",{\"type\":\"emphasis-1\",\"content\":\"Social Democracy: An Alternate History\"},\" by Autumn Chen, released under the MIT licence. The game structure, the card system and much of the interface come from the original.\"]}]},\"library.elections\":{\"id\":\"library.elections\",\"goTo\":[{\"id\":\"library.menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"How elections work\"},{\"type\":\"paragraph\",\"content\":\"Each of Spain's 50 provinces is a constituency with at least two deputies; the other seats are shared by population. Ceuta and Melilla elect one each. Seats are allocated by the D'Hondt method, and a list needs 3% of the valid vote in a province, blank votes included.\"},{\"type\":\"paragraph\",\"content\":\"Small provinces have few seats, so the system rewards parties that are strong everywhere and parties concentrated in one region, and penalises parties with thinly spread national support.\"}]},\"library\":{\"id\":\"library\",\"type\":\"scene\",\"title\":\"Library\",\"newPage\":true,\"isSpecial\":true,\"goTo\":[{\"id\":\"library.menu\"}],\"content\":{\"type\":\"heading\",\"content\":\"The Library\"}},\"status.polls\":{\"id\":\"status.polls\",\"title\":\"Polls\",\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.poll) {\\n    window.SpainGame.renderPolls(Q, 'sp-side-polls');\\n}\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Polls\"},{\"type\":\"paragraph\",\"content\":\"Estimated vote and seats if an election were held now.\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-polls\\\"></div>\"}}]},\"status\":{\"id\":\"status\",\"type\":\"scene\",\"title\":\"Status\",\"newPage\":true,\"isSpecial\":true,\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame && Q.congress) {\\n    window.SpainGame.renderCongress(Q, 'sp-side-congress');\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Status\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"insert\",\"insert\":0},\" \",{\"type\":\"insert\",\"insert\":1},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Prime Minister: \",{\"type\":\"insert\",\"insert\":2},{\"type\":\"conditional\",\"content\":\"(acting) \",\"predicate\":3},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The PSOE is in government. \",\"predicate\":4},{\"type\":\"conditional\",\"content\":\"The PSOE is in opposition. \",\"predicate\":5},\"\"]},{\"type\":\"paragraph\",\"content\":[\"Sánchez's authority: \",{\"type\":\"insert\",\"insert\":6},\"/100\"]},{\"type\":\"paragraph\",\"content\":[\"Member morale: \",{\"type\":\"insert\",\"insert\":7},\"/100\"]},{\"type\":\"paragraph\",\"content\":[\"PSOE unity: \",{\"type\":\"insert\",\"insert\":8},\"/100\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"Dissolution in \",{\"type\":\"insert\",\"insert\":10},\" month(s) unless a candidate is invested. \"],\"predicate\":9},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":[\"General election: \",{\"type\":\"insert\",\"insert\":12},\" \",{\"type\":\"insert\",\"insert\":13},\" \"],\"predicate\":11},\"\"]},{\"type\":\"heading\",\"content\":\"Congress of Deputies\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-side-congress\\\"></div>\"}}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['year'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['pm'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['psoe_in_government'] || 0)===0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['sanchez_authority'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['member_morale'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['psoe_unity'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['investiture_clock'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['investiture_clock'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['election_year'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_year'] || 0);\"}}]}},\"election_lab.lab_vox\":{\"id\":\"election_lab.lab_vox\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 3;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_advisers.pnv\":{\"id\":\"sp_advisers.pnv\",\"title\":\"Sound out the PNV\",\"subtitle\":\"Better relations with the Basque nationalists.\",\"chooseIf\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0)===0);\"},\"unavailableSubtitle\":{\"content\":{\"type\":\"conditional\",\"content\":[\"\",{\"type\":\"insert\",\"insert\":1},\" month(s) before the next adviser action.\"],\"predicate\":0},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['advisor_action_timer'] || 0) > 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['advisor_action_timer'] || 0);\"}}]},\"onArrival\":[{\"$code\":\"Q['rel_pnv'] = (Q['rel_pnv'] || 0) + 10;\\nQ['advisor_action_timer'] = 2;\\nQ['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['last_advisor_action'] = 1;\"}],\"content\":{\"content\":\"Aitor Esteban is courteous and noncommittal. That, from the PNV, is a good sign.\",\"type\":\"paragraph\"}},\"sp_events.defy\":{\"id\":\"sp_events.defy\",\"onArrival\":[{\"$code\":\"Q['red_lines'] = 0;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 20;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 10;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 8;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 4;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 4;\"}],\"content\":{\"content\":\"The vote is close. You keep your freedom to negotiate, but Susana Díaz has counted her votes, and so have you.\",\"type\":\"paragraph\"}},\"sp_investiture.referendum\":{\"id\":\"sp_investiture.referendum\",\"title\":\"Offer the Catalan parties talks on their demands\",\"subtitle\":\"Could turn ERC and Convergència's votes into abstentions.\",\"viewIf\":{\"$code\":\"return (((Q['pact_cs'] || 0)===0) && ((Q['referendum_offer'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q['referendum_offer'] = 1;\\nQ['rel_erc'] = (Q['rel_erc'] || 0) + 15;\\nQ['rel_junts'] = (Q['rel_junts'] || 0) + 15;\\n if (((Q['red_lines'] || 0)===1) ) { Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 25; } \\n if (((Q['red_lines'] || 0)===1) ) { Q['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 12; } \\n if (((Q['red_lines'] || 0)===1) ) { Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 6; } \\n if (((Q['red_lines'] || 0)===0) ) { Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 10; }\"}],\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"You have broken the Federal Committee's resolution. The barons are openly discussing your removal. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The barons are furious, but the Federal Committee never bound you.\",\"predicate\":1}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['red_lines'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['red_lines'] || 0)===0);\"}}]}},\"sp_negotiations.both\":{\"id\":\"sp_negotiations.both\",\"onArrival\":[{\"$code\":\"Q['up_talks'] = (Q['up_talks'] || 0) + 0.5;\\nQ['cs_talks'] = (Q['cs_talks'] || 0) + 0.5;\\nQ['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 2;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 2;\"}],\"content\":{\"content\":\"Podemos will not share a table with Ciudadanos, and Ciudadanos will not sit in a government with Podemos. Your team shuttles between rooms. It makes you look like the centre of every solution, and it makes everyone suspicious of you.\",\"type\":\"paragraph\"}},\"sp_party.announce\":{\"id\":\"sp_party.announce\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 5;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 12;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 5;\"}],\"content\":{\"content\":\"You set the line on television. In Seville, the reaction is icy.\",\"type\":\"paragraph\"}},\"sp_start.stability\":{\"id\":\"sp_start.stability\",\"onArrival\":[{\"$code\":\"Q['posture'] = 3;\\nQ['rel_pp'] = (Q['rel_pp'] || 0) + 10;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 5;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 8;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 8;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 3;\"}],\"content\":{\"content\":\"Institutional voices welcome your responsibility. Among the members, the word \\\"abstention\\\" is already circulating, and your internal opponents take note.\",\"type\":\"paragraph\"}},\"sp_start\":{\"id\":\"sp_start\",\"type\":\"scene\",\"title\":\"The morning after\",\"newPage\":true,\"setBg\":\"img/spain/bg_congreso_hemiciclo.jpg\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.newGame(Q, 0);\\n}\"}],\"options\":[{\"id\":\"@sp_start.responsible\",\"title\":\"The responsible opposition: no to Rajoy, no promises yet\"},{\"id\":\"@sp_start.alternative\",\"title\":\"An alternative government: announce talks for a change of government\"},{\"id\":\"@sp_start.stability\",\"title\":\"Institutional stability: explore whether any agreement with the PP is possible\"}],\"content\":[{\"type\":\"heading\",\"content\":\"21 December 2015 — The morning after\"},{\"type\":\"paragraph\",\"content\":\"The general election has broken the old two-party pattern. Mariano Rajoy's People's Party has finished first with 123 seats, far short of the 176 needed for a majority. The PSOE is second with 90, its worst result since the restoration of democracy, but it has not collapsed. Podemos and its regional allies have 69 seats, Ciudadanos 40.\"},{\"type\":\"paragraph\",\"content\":[\"You are \",{\"type\":\"emphasis-2\",\"content\":\"Pedro Sánchez\"},\", Secretary-General of the PSOE since the 2014 primary. Your senior team has gathered at Ferraz. The party faces two opposite accusations: that it will rescue the PP, or that it will hand the country to Podemos. Regional presidents, former leaders and the parliamentary group all have their own ideas about what you should do next.\"]},{\"type\":\"paragraph\",\"content\":\"How do you position the PSOE this morning?\"}]},\"election_lab.lab_landslide\":{\"id\":\"election_lab.lab_landslide\",\"onArrival\":[{\"$code\":\"Q['spain_lab_scenario'] = 4;\"}],\"goTo\":[{\"id\":\"election_lab.lab_result\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_advisers.candidacy\":{\"id\":\"sp_advisers.candidacy\",\"title\":\"Seek investiture\",\"isPinnedCard\":true,\"cardImage\":\"img/spain/portrait_sanchez_2015.jpg\",\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return ((((Q['sanchez_nominated'] || 0)===1) && ((Q['psoe_in_government'] || 0)===0)) && ((Q['sanchez_leader'] || 0)===1));\"},\"goTo\":[{\"id\":\"sp_investiture\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_advisers\":{\"id\":\"sp_advisers\",\"type\":\"scene\",\"title\":\"Antonio Hernando\",\"isPinnedCard\":true,\"cardImage\":\"img/spain/portrait_hernando.jpg\",\"tags\":[\"sp_advisor\"],\"viewIf\":{\"$code\":\"return ((Q['sanchez_leader'] || 0)===1);\"},\"newPage\":true,\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderVote(Q, 'sp-hernando-count', 'sanchez');\\n}\"}],\"options\":[{\"id\":\"@sp_advisers.cs_channel\"},{\"id\":\"@sp_advisers.group\"},{\"id\":\"@sp_advisers.pnv\"},{\"id\":\"@root\",\"title\":\"Back\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Antonio Hernando\"},{\"type\":\"paragraph\",\"content\":\"Spokesperson of the parliamentary group and a central negotiator. Hernando lives by arithmetic: who votes yes, who abstains, who can be moved. Faction: Institutionalists. Loyal to the leadership, for now.\"},{\"type\":\"paragraph\",\"content\":\"His current count for your investiture:\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-hernando-count\\\"></div>\"}}]},\"sp_events.iglesias_offer\":{\"id\":\"sp_events.iglesias_offer\",\"title\":\"Iglesias's offer\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((((Q['year'] || 0)===2016) && ((Q['month'] || 0) >= 1)) && ((Q['month'] || 0) <= 3)) && ((Q['acting'] || 0)===1)) && ((Q['psoe_in_government'] || 0)===0)) && ((Q['rel_up'] || 0) >= 25));\"},\"maxVisits\":1,\"options\":[{\"id\":\"@sp_events.welcome\",\"title\":\"Welcome the offer and invite Podemos to formal talks\"},{\"id\":\"@sp_events.programme\",\"title\":\"Say talks must start from the programme, not from posts\"},{\"id\":\"@sp_events.reject\",\"title\":\"Reject it publicly as an ultimatum\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Pablo Iglesias makes an offer\"},{\"type\":\"paragraph\",\"content\":\"Leaving his audience with the King, Pablo Iglesias announces to the press that he is offering the PSOE a coalition government: Sánchez as Prime Minister, Iglesias as Vice-President, and Podemos ministers in key portfolios. You learn of it from the television.\"}],\"countVisitsMax\":1},\"sp_investiture.debate\":{\"id\":\"sp_investiture.debate\",\"title\":\"The debate\",\"options\":[{\"id\":\"@sp_investiture.speech_change\",\"title\":\"A government of change\"},{\"id\":\"@sp_investiture.speech_reform\",\"title\":\"A reformist government for all Spaniards\"},{\"id\":\"@sp_investiture.speech_attack\",\"title\":\"The case against Rajoy\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The debate\"},{\"type\":\"paragraph\",\"content\":\"Two days of speeches. What do you build your speech around?\"}]},\"sp_negotiations.pnv_cc\":{\"id\":\"sp_negotiations.pnv_cc\",\"onArrival\":[{\"$code\":\"Q['rel_pnv'] = (Q['rel_pnv'] || 0) + 8;\\nQ['rel_cc'] = (Q['rel_cc'] || 0) + 8;\"}],\"content\":{\"content\":\"The PNV wants its fiscal arrangements respected and transfers of powers to Euskadi; Coalición Canaria wants the islands' economic regime. Both are small, both are reliable, and both know what their votes are worth.\",\"type\":\"paragraph\"}},\"sp_party.formal_role\":{\"id\":\"sp_party.formal_role\",\"onArrival\":[{\"$code\":\"Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 15;\\nQ['regional_leaders_strength'] = (Q['regional_leaders_strength'] || 0) + 4;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 6;\\nQ['barons_veto'] = 1;\"}],\"content\":{\"content\":\"The barons join the negotiating structure. Nothing will be signed without them, which reassures them and limits you.\",\"type\":\"paragraph\"}},\"election_lab.lab_result\":{\"id\":\"election_lab.lab_result\",\"title\":\"Election lab result\",\"newPage\":true,\"onDisplay\":[{\"$code\":\"var keys = {1: 'baseline', 2: 'up_merger', 3: 'vox_breakthrough', 4: 'right_landslide'};\\nif (typeof window !== 'undefined' && window.SpainUI) {\\n    window.SpainUI.renderLab(keys[Q.spain_lab_scenario] || 'baseline');\\n}\"}],\"options\":[{\"id\":\"@election_lab\",\"title\":\"Try another scenario\"},{\"id\":\"@root.start_menu\",\"title\":\"Back to the main menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Simulated Congress of Deputies\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-lab\\\"></div>\"}}]},\"election_lab\":{\"id\":\"election_lab\",\"type\":\"scene\",\"title\":\"Election lab\",\"newPage\":true,\"options\":[{\"id\":\"@election_lab.lab_baseline\",\"title\":\"December 2015, no change\"},{\"id\":\"@election_lab.lab_up_merger\",\"title\":\"Unidos Podemos and a PP recovery\"},{\"id\":\"@election_lab.lab_vox\",\"title\":\"Vox breaks through as Ciudadanos collapses\"},{\"id\":\"@election_lab.lab_landslide\",\"title\":\"A PP–Vox landslide\"},{\"id\":\"@root.start_menu\",\"title\":\"Back to the main menu\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Election lab\"},{\"type\":\"paragraph\",\"content\":\"This page runs the Spanish electoral engine that the campaign will use. Votes are built from social classes, adjusted by region, and projected onto the 52 provinces. Seats are then allocated exactly as in Spain: D'Hondt in each province, a 3% threshold, and seats per province set by population.\"},{\"type\":\"paragraph\",\"content\":\"Fed the official vote counts, the engine reproduces every Congress from 2015 to 2023. The scenarios below are illustrations of the model, not historical results.\"}]},\"sp_events.welcome\":{\"id\":\"sp_events.welcome\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 10;\\nQ['up_talks'] = (Q['up_talks'] || 0) + 1;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 6;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 10;\\nQ['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) + 6;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 6;\"}],\"content\":{\"content\":\"Podemos claims the initiative. Your barons say you have been humiliated in public and thanked Iglesias for it.\",\"type\":\"paragraph\"}},\"sp_investiture.speech_change\":{\"id\":\"sp_investiture.speech_change\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) - 2;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\"}],\"goTo\":[{\"id\":\"sp_investiture.vote\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.catalans\":{\"id\":\"sp_negotiations.catalans\",\"onArrival\":[{\"$code\":\"Q['rel_erc'] = (Q['rel_erc'] || 0) + 8;\\nQ['rel_junts'] = (Q['rel_junts'] || 0) + 6;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 1;\\n if (((Q['red_lines'] || 0)===1) ) { Q['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 10; } \\n if (((Q['red_lines'] || 0)===1) ) { Q['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) - 4; }\"}],\"content\":{\"content\":{\"type\":\"paragraph\",\"content\":[\"ERC's spokesman repeats that their price is a referendum. \",{\"type\":\"conditional\",\"content\":\"Within hours, the barons know about the meeting and remind you of the Federal Committee's resolution.\",\"predicate\":0}]},\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['red_lines'] || 0)===1);\"}}]}},\"sp_party.membership\":{\"id\":\"sp_party.membership\",\"title\":\"Ask the members\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((((((Q['pact_cs'] || 0)===1) || ((Q['pact_up'] || 0)===1))) && ((Q['membership_round'] || 0) < (Q['formation_round'] || 0))) && ((Q['membership_timer'] || 0) <= 0)) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q.month_actions += 1; Q.membership_timer = 2; Q.membership_round = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_party.consult\",\"title\":\"Hold the consultation\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Ask the members\"},{\"type\":\"paragraph\",\"content\":\"An agreement has been signed. You could put it to a vote of the whole membership, something the PSOE has never done, before the Federal Committee can bury it.\"}]},\"sp_events.programme\":{\"id\":\"sp_events.programme\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) + 3;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 3;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 2;\"}],\"content\":{\"content\":\"You keep the door open without walking through it on Iglesias's terms. The commentators call it a good afternoon's work.\",\"type\":\"paragraph\"}},\"sp_investiture.speech_reform\":{\"id\":\"sp_investiture.speech_reform\",\"onArrival\":[{\"$code\":\"Q['rel_cs'] = (Q['rel_cs'] || 0) + 3;\\nQ['rel_pnv'] = (Q['rel_pnv'] || 0) + 2;\\nQ['rel_up'] = (Q['rel_up'] || 0) - 2;\"}],\"goTo\":[{\"id\":\"sp_investiture.vote\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.media\":{\"id\":\"sp_negotiations.media\",\"title\":\"The interview\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_politics\"],\"viewIf\":{\"$code\":\"return (((Q['media_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['media_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_negotiations.change\",\"title\":\"Change: Spain cannot have four more years of Rajoy\"},{\"id\":\"@sp_negotiations.reform\",\"title\":\"Reform and stability: a serious party for difficult times\"},{\"id\":\"@sp_negotiations.attack_podemos\",\"title\":\"Podemos is not the answer\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The interview\"},{\"type\":\"paragraph\",\"content\":\"A prime-time interview on La Sexta. What is the message?\"}]},\"sp_party.consult\":{\"id\":\"sp_party.consult\",\"onArrival\":[{\"$code\":\"Q['member_morale'] = (Q['member_morale'] || 0) + 8;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 6;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) + 3;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 4;\"}],\"content\":{\"content\":\"The members back the agreement by a wide margin. The barons cannot argue with the result; they argue instead about the question.\",\"type\":\"paragraph\"}},\"sp_party\":{\"id\":\"sp_party\",\"type\":\"scene\",\"title\":\"The regional presidents\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_party\"],\"viewIf\":{\"$code\":\"return (((Q['barons_timer'] || 0) <= 0) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['barons_timer'] = 2;\"}],\"options\":[{\"id\":\"@sp_party.convene\",\"title\":\"Convene the regional presidents before deciding anything\"},{\"id\":\"@sp_party.executive\",\"title\":\"Consult the Federal Executive first\"},{\"id\":\"@sp_party.announce\",\"title\":\"Announce your strategy, then inform them\"},{\"id\":\"@sp_party.formal_role\",\"title\":\"Offer the barons a formal role in the negotiations\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The regional presidents\"},{\"type\":\"paragraph\",\"content\":\"Susana Díaz in Andalusia, Emiliano García-Page in Castilla-La Mancha, Guillermo Fernández Vara in Extremadura, Javier Lambán in Aragón, Ximo Puig in Valencia, Javier Fernández in Asturias: each governs, each has their own electorate, and each has a view on what you should do in Madrid.\"}]},\"sp_events.reject\":{\"id\":\"sp_events.reject\",\"onArrival\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) - 12;\\nQ['rel_cs'] = (Q['rel_cs'] || 0) + 5;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 6;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 8;\\nQ['member_morale'] = (Q['member_morale'] || 0) - 3;\"}],\"content\":{\"content\":\"The barons applaud. Many members, who voted for change, do not.\",\"type\":\"paragraph\"}},\"sp_investiture.speech_attack\":{\"id\":\"sp_investiture.speech_attack\",\"onArrival\":[{\"$code\":\"Q['rel_pp'] = (Q['rel_pp'] || 0) - 8;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 4;\"}],\"goTo\":[{\"id\":\"sp_investiture.vote\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.change\":{\"id\":\"sp_negotiations.change\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.shiftSupport(Q, 'psoe', {workers: 2, students: 3, unemployed: 2}); window.SpainGame.updatePolls(Q); }\"}],\"onDeparture\":[{\"$code\":\"Q['progressives_dissent'] = (Q['progressives_dissent'] || 0) - 3;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 3;\"}],\"content\":{\"content\":\"Young and working voters respond. Your most cautious barons wince at the word \\\"change\\\".\",\"type\":\"paragraph\"}},\"sp_events.pp_round\":{\"id\":\"sp_events.pp_round\",\"title\":\"The King's consultations\",\"newPage\":true,\"faceImage\":\"img/spain/event_rajoy_sanchez.jpg\",\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((Q['acting'] || 0)===1) && ((Q['pp_asked'] || 0) < (Q['formation_round'] || 0))) && ((Q['time'] || 0) >= 2)) && ((Q['election_year'] || 0)===0)) && ((Q['investiture_votes'] || 0)===0));\"},\"onArrival\":[{\"$code\":\"Q.pp_asked = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_events.against\",\"title\":\"Vote against Rajoy\"},{\"id\":\"@sp_events.abstain\",\"title\":\"Abstain and let a PP government be formed\"},{\"id\":\"@sp_events.limited\",\"title\":\"Negotiate a limited agreement in exchange for abstention\"},{\"id\":\"@sp_events.other_candidate\",\"title\":\"Demand a different PP candidate\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Rajoy asks for support\"},{\"type\":\"paragraph\",\"content\":\"The King has finished his consultations and offered the nomination to the largest party's leader. Before deciding whether to accept, Rajoy calls you. He wants the PSOE to let him govern: a vote in favour, or at least an abstention.\"},{\"type\":\"paragraph\",\"content\":\"What will the PSOE do?\"}]},\"sp_investiture.vote\":{\"id\":\"sp_investiture.vote\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.holdInvestiture(Q, 'sanchez');\\n}\"}],\"goTo\":[{\"id\":\"sp_investiture.won\",\"predicate\":{\"$code\":\"return ((Q['inv_passes'] || 0)===1);\"}},{\"id\":\"sp_investiture.lost\",\"predicate\":{\"$code\":\"return ((Q['inv_passes'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_negotiations.reform\":{\"id\":\"sp_negotiations.reform\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.shiftSupport(Q, 'psoe', {professionals: 2, pensioners: 2, self_employed: 1}); window.SpainGame.updatePolls(Q); }\"}],\"onDeparture\":[{\"$code\":\"Q['institutionalists_dissent'] = (Q['institutionalists_dissent'] || 0) - 3;\\nQ['modernisers_dissent'] = (Q['modernisers_dissent'] || 0) - 2;\"}],\"content\":{\"content\":\"Older and middle-class voters hear a party of government. Some members hear a party afraid of its own shadow.\",\"type\":\"paragraph\"}},\"sp_events.against\":{\"id\":\"sp_events.against\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"no\\\"; Q.member_morale += 4; Q.rel_pp -= 6; Q.sanchez_authority += 2;\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_investiture.won\":{\"id\":\"sp_investiture.won\",\"title\":\"Prime Minister\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 15;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 10;\\nQ['sanchismo'] = (Q['sanchismo'] || 0) + 10;\\nQ['federal_committee_balance'] = (Q['federal_committee_balance'] || 0) + 8;\\nQ['sanchez_nominated'] = 0;\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Prime Minister\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\", abstentions \",{\"type\":\"insert\",\"insert\":2},\". Pedro Sánchez is invested President of the Government.\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_abstain'] || 0);\"}}]}},\"sp_negotiations.attack_podemos\":{\"id\":\"sp_negotiations.attack_podemos\",\"onArrival\":[{\"$code\":\"if (window.SpainGame) { window.SpainGame.shiftSupport(Q, 'psoe', {pensioners: 3, homemakers: 2, students: -2}); window.SpainGame.updatePolls(Q); }\"}],\"onDeparture\":[{\"$code\":\"Q['rel_up'] = (Q['rel_up'] || 0) - 10;\\nQ['regional_leaders_dissent'] = (Q['regional_leaders_dissent'] || 0) - 4;\\nQ['progressives_dissent'] = (Q['progressives_dissent'] || 0) + 4;\"}],\"content\":{\"content\":\"The barons enjoy it. Iglesias replies within the hour.\",\"type\":\"paragraph\"}},\"sp_negotiations\":{\"id\":\"sp_negotiations\",\"type\":\"scene\",\"title\":\"The negotiating team\",\"newPage\":true,\"isCard\":true,\"tags\":[\"sp_politics\"],\"viewIf\":{\"$code\":\"return (((((Q['negotiations_timer'] || 0) <= 0) && ((Q['acting'] || 0)===1)) && ((Q['psoe_in_government'] || 0)===0)) && ((Q['sanchez_leader'] || 0)===1));\"},\"onArrival\":[{\"$code\":\"Q['month_actions'] = (Q['month_actions'] || 0) + 1;\\nQ['negotiations_timer'] = 1;\"}],\"options\":[{\"id\":\"@sp_negotiations.podemos\",\"title\":\"Podemos: work towards a government agreement\"},{\"id\":\"@sp_negotiations.cs\",\"title\":\"Ciudadanos: work towards a reform agreement\"},{\"id\":\"@sp_negotiations.both\",\"title\":\"Both at once: try for a three-way arrangement\"},{\"id\":\"@sp_negotiations.pnv_cc\",\"title\":\"The PNV and Coalición Canaria\"},{\"id\":\"@sp_negotiations.catalans\",\"title\":\"Sound out ERC and Convergència\"},{\"id\":\"@easy_discard\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The negotiating team\"},{\"type\":\"paragraph\",\"content\":\"Antonio Hernando, Meritxell Batet, José Enrique Serrano, Jordi Sevilla, Rodolfo Ares and María Luisa Carcedo wait for instructions. Who do they sit down with this month?\"}]},\"sp_events.abstain\":{\"id\":\"sp_events.abstain\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"abstain\\\"; Q.member_morale -= 15; Q.progressives_dissent += 20; Q.trade_unionists_dissent += 10; Q.regional_leaders_dissent -= 8; Q.institutionalists_dissent -= 6; Q.rel_pp += 10; Q.sanchez_authority -= 10; Q.sanchismo -= 5;\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_investiture.lost\":{\"id\":\"sp_investiture.lost\",\"title\":\"Defeated\",\"onArrival\":[{\"$code\":\"Q.sanchez_nominated = 0;\\nif (Q.inv_yes >= 130) { Q.sanchez_authority += 2; } else { Q.sanchez_authority -= 6; }\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Defeated\"},{\"type\":\"paragraph\",\"content\":[\"Yes \",{\"type\":\"insert\",\"insert\":0},\", no \",{\"type\":\"insert\",\"insert\":1},\", abstentions \",{\"type\":\"insert\",\"insert\":2},\". The chamber rejects your candidacy in both ballots.\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"conditional\",\"content\":\"The two-month clock has started. If no one is invested before it runs out, the Cortes will be dissolved.\",\"predicate\":3}}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_yes'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_no'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['inv_abstain'] || 0);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['investiture_clock'] || 0) > 0);\"}}]}},\"sp_investiture\":{\"id\":\"sp_investiture\",\"type\":\"scene\",\"title\":\"The investiture debate\",\"newPage\":true,\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderVote(Q, 'sp-inv-count', 'sanchez');\\n}\"}],\"options\":[{\"id\":\"@sp_investiture.sign_cs\",\"title\":\"Sign a government agreement with Ciudadanos\"},{\"id\":\"@sp_investiture.sign_up\",\"title\":\"Sign a government agreement with Podemos\"},{\"id\":\"@sp_investiture.referendum\",\"title\":\"Offer the Catalan parties talks on their demands\"},{\"id\":\"@sp_investiture.debate\",\"title\":\"Go to the debate\"},{\"id\":\"@root\",\"title\":\"Not yet: keep negotiating\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The investiture debate\"},{\"type\":\"paragraph\",\"content\":\"The King has proposed you as candidate. Before you set the date, you can still change the arithmetic. This is the projected vote today:\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-inv-count\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":\"You need 176 yes votes in the first ballot, or more yes than no votes in the second.\"}]},\"sp_events.limited\":{\"id\":\"sp_events.limited\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"abstain\\\"; Q.member_morale -= 10; Q.progressives_dissent += 12; Q.institutionalists_dissent -= 4; Q.rel_pp += 6; Q.sanchez_authority -= 5;\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_events.other_candidate\":{\"id\":\"sp_events.other_candidate\",\"onArrival\":[{\"$code\":\"Q.psoe_stance_pp = \\\"no\\\"; Q.rel_pp -= 10; Q.sanchez_authority += 3; Q.institutionalists_dissent += 3;\"}],\"goTo\":[{\"id\":\"sp_events.pp_decides\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_events.pp_decides\":{\"id\":\"sp_events.pp_decides\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainParliament) {\\n    var v = window.SpainParliament.investiture(Q.congress, 'pp', Q);\\n    if (v.passes) {\\n        window.SpainGame.holdInvestiture(Q, 'pp');\\n        Q.pp_invested_now = 1;\\n    } else {\\n        Q.pp_invested_now = 0;\\n        Q.rajoy_declined = 1;\\n    }\\n}\"}],\"goTo\":[{\"id\":\"sp_events.pp_invested\",\"predicate\":{\"$code\":\"return ((Q['pp_invested_now'] || 0)===1);\"}},{\"id\":\"sp_events.pp_declines\",\"predicate\":{\"$code\":\"return ((Q['pp_invested_now'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_events.pp_invested\":{\"id\":\"sp_events.pp_invested\",\"title\":\"A PP government\",\"content\":[{\"type\":\"heading\",\"content\":\"A PP government\"},{\"type\":\"paragraph\",\"content\":\"With the PSOE's abstention, the PP's candidate is invested Prime Minister in the second vote. The country has a government. In the PSOE, the argument about who allowed it has only begun.\"}]},\"sp_events.pp_declines\":{\"id\":\"sp_events.pp_declines\",\"title\":\"Rajoy declines\",\"options\":[{\"id\":\"@sp_events.offer\",\"title\":\"Tell the King you are ready to seek the investiture\"},{\"id\":\"@sp_events.hold\",\"title\":\"Hold back and keep negotiating\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Rajoy declines the nomination\"},{\"type\":\"paragraph\",\"content\":\"Without the votes, Rajoy does something no candidate has done before: he declines the King's offer, and waits for others to fail. The initiative passes to you, if you want it.\"}]},\"sp_events.offer\":{\"id\":\"sp_events.offer\",\"onArrival\":[{\"$code\":\"Q['sanchez_nominated'] = 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 5;\\nQ['member_morale'] = (Q['member_morale'] || 0) + 4;\"}],\"content\":{\"content\":\"The King proposes you as candidate. The Speaker will set the date of the debate when you are ready. (Use the \\\"Seek investiture\\\" card.)\",\"type\":\"paragraph\"}},\"sp_events.hold\":{\"id\":\"sp_events.hold\",\"onArrival\":[{\"$code\":\"Q['sanchez_authority'] = (Q['sanchez_authority'] || 0) - 2;\"}],\"content\":{\"content\":\"You tell the King you need more time. Rajoy's strategy depends on everyone else's patience running out first.\",\"type\":\"paragraph\"}},\"sp_events.king_turns\":{\"id\":\"sp_events.king_turns\",\"title\":\"The King turns to you\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((((((Q['rajoy_declined'] || 0)===1) && ((Q['sanchez_nominated'] || 0)===0)) && ((Q['investiture_votes'] || 0)===0)) && ((Q['acting'] || 0)===1)) && ((Q['election_year'] || 0)===0)) && ((Q['king_asked'] || 0) < (Q['formation_round'] || 0))) && ((Q['time'] || 0) >= 3));\"},\"onArrival\":[{\"$code\":\"Q.king_asked = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_events.king_accept\",\"title\":\"Accept the nomination\"},{\"id\":\"@sp_events.king_refuse\",\"title\":\"Refuse: Rajoy must face the chamber first\"}],\"content\":[{\"type\":\"heading\",\"content\":\"The King turns to you\"},{\"type\":\"paragraph\",\"content\":\"After a second round of consultations, the King asks whether you will stand. If no one does, the investiture clock never starts and the country stays in limbo.\"}]},\"sp_events.king_accept\":{\"id\":\"sp_events.king_accept\",\"onArrival\":[{\"$code\":\"Q['sanchez_nominated'] = 1;\\nQ['sanchez_authority'] = (Q['sanchez_authority'] || 0) + 4;\"}],\"content\":{\"content\":\"You are the candidate. (Use the \\\"Seek investiture\\\" card when you are ready.)\",\"type\":\"paragraph\"}},\"sp_events.king_refuse\":{\"id\":\"sp_events.king_refuse\",\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.holdInvestiture(Q, 'pp');\\n}\\nQ.sanchez_authority -= 3;\"}],\"content\":{\"content\":\"The King proposes Rajoy, who this time goes to the vote and loses it. The two-month clock has started: if no one is invested, Spain votes again.\",\"type\":\"paragraph\"}},\"sp_events.dissolution\":{\"id\":\"sp_events.dissolution\",\"title\":\"The Cortes are dissolved\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['dissolution_due'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.dissolve(Q);\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The Cortes are dissolved\"},{\"type\":\"paragraph\",\"content\":[\"Two months have passed since the first investiture vote without a Prime Minister being elected. The King signs the decree of dissolution. Spain will vote again in \",{\"type\":\"insert\",\"insert\":0},\" \",{\"type\":\"insert\",\"insert\":1},\".\"]}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_year'] || 0);\"}}]}},\"sp_events.general_election\":{\"id\":\"sp_events.general_election\",\"title\":\"General election\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['general_election_due'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.runGeneralElection(Q);\\n}\"}],\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderCongress(Q, 'sp-election-result');\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":[\"General election: \",{\"type\":\"insert\",\"insert\":0},\" \",{\"type\":\"insert\",\"insert\":1},\"\"]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-election-result\\\"></div>\"},\"\"]},{\"type\":\"paragraph\",\"content\":{\"type\":\"insert\",\"insert\":2}}],\"stateDependencies\":[{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['month'] || 0);\"},\"qdisplay\":\"month\"},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['year'] || 0);\"}},{\"type\":\"insert\",\"fn\":{\"$code\":\"return (Q['election_verdict'] || 0);\"}}]}},\"sp_events.regional_elections\":{\"id\":\"sp_events.regional_elections\",\"title\":\"Regional elections\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((Q['has_regional_elections'] || 0)===1);\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.runDueRegionalElections(Q);\\n}\"}],\"onDisplay\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.renderRegionalResults(Q, 'sp-regional-results');\\n}\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Regional elections\"},{\"type\":\"paragraph\",\"content\":{\"type\":\"magic\",\"content\":\"<div id=\\\"sp-regional-results\\\"></div>\"}}]},\"sp_events.federal_committee\":{\"id\":\"sp_events.federal_committee\",\"title\":\"Revolt in the Federal Committee\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['revolt_possible'] || 0)===1) && ((Q['sanchez_leader'] || 0)===1)) && ((Q['revolt_round'] || 0) < (Q['formation_round'] || 0)));\"},\"onArrival\":[{\"$code\":\"Q.revolt_round = Q.formation_round || 1;\"}],\"options\":[{\"id\":\"@sp_events.fight\",\"title\":\"Fight it out in the Federal Committee\"},{\"id\":\"@sp_events.members\",\"title\":\"Resign and take your case to the members\"}],\"content\":[{\"type\":\"heading\",\"content\":\"Revolt in the Federal Committee\"},{\"type\":\"paragraph\",\"content\":\"Half of the Federal Executive resigns at once, intending to force your fall. The critics demand a caretaker committee and an end to your strategy.\"}]},\"sp_events.fight\":{\"id\":\"sp_events.fight\",\"onArrival\":[{\"$code\":\"Q.committee_won = (Q.federal_committee_balance + Q.member_morale / 5 >= 55) ? 1 : 0;\\nif (Q.committee_won) {\\n    Q.sanchez_authority += 10; Q.regional_leaders_dissent -= 10; Q.federal_committee_balance += 5;\\n} else {\\n    Q.sanchez_leader = 0;\\n    if (Q.in_leadership_window) {\\n        Q.leadership_exception_open = 1;\\n    }\\n}\"}],\"goTo\":[{\"id\":\"sp_events.fight_won\",\"predicate\":{\"$code\":\"return ((Q['committee_won'] || 0)===1);\"}},{\"id\":\"sp_events.ousted\",\"predicate\":{\"$code\":\"return ((Q['committee_won'] || 0)===0);\"}}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_events.fight_won\":{\"id\":\"sp_events.fight_won\",\"title\":\"You survive\",\"content\":[{\"type\":\"heading\",\"content\":\"You survive\"},{\"type\":\"paragraph\",\"content\":\"After a day of shouting in the corridors of Ferraz, the vote goes your way. Your critics will wait for another chance.\"}]},\"sp_events.members\":{\"id\":\"sp_events.members\",\"onArrival\":[{\"$code\":\"Q['sanchez_leader'] = 0;\\n if (((Q['in_leadership_window'] || 0)===1) ) { Q['leadership_exception_open'] = 1; }\"}],\"goTo\":[{\"id\":\"sp_events.ousted\"}],\"content\":{\"content\":\"\",\"type\":\"paragraph\"}},\"sp_events.ousted\":{\"id\":\"sp_events.ousted\",\"title\":\"Sánchez falls\",\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"Sánchez falls\"},{\"type\":\"paragraph\",\"content\":[\"You are no longer Secretary-General. \",{\"type\":\"conditional\",\"content\":\"A caretaker committee takes over Ferraz. Your seat in Congress, your car, your office: all gone. But the members have not spoken yet, and the next primary is due in May 2017.\",\"predicate\":0}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['leadership_exception_open'] || 0)===1);\"}}]}},\"sp_events.primary\":{\"id\":\"sp_events.primary\",\"title\":\"The primary\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return ((((Q['leadership_exception_open'] || 0)===1) && ((Q['year'] || 0) >= 2017)) && ((Q['month'] || 0) >= 5));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q.primary_won = (Q.member_morale + Q.sanchismo / 2 >= 60) ? 1 : 0;\\nQ.leadership_exception_open = 0;\\nif (Q.primary_won) {\\n    Q.sanchez_leader = 1; Q.sanchez_authority = 70; Q.sanchismo += 20; Q.member_morale += 10;\\n    Q.federal_committee_balance = 60;\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The primary\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"The members vote, and they vote for you. Against the barons, the elders and the apparatus, Pedro Sánchez is Secretary-General again. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"The members vote, and they do not vote for you.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['primary_won'] || 0)===0);\"}}]},\"countVisitsMax\":1},\"sp_events.deadlock_vote\":{\"id\":\"sp_events.deadlock_vote\",\"title\":\"The King forces a vote\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((((Q['acting'] || 0)===1) && ((Q['investiture_votes'] || 0)===0)) && ((Q['election_year'] || 0)===0)) && ((Q['time'] || 0) >= ((Q['formation_start_time'] || 0) + 4)));\"},\"onArrival\":[{\"$code\":\"if (typeof window !== 'undefined' && window.SpainGame) {\\n    window.SpainGame.holdInvestiture(Q, 'pp');\\n}\"}],\"content\":{\"content\":[{\"type\":\"heading\",\"content\":\"The King forces a vote\"},{\"type\":\"paragraph\",\"content\":\"Months have passed without a candidate facing the chamber, and without a first vote the constitutional clock cannot start. The King proposes the leader of the largest party once more, and this time he goes to the vote.\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"conditional\",\"content\":\"He loses it. The two-month clock has started: if no one is invested, the Cortes will be dissolved and Spain will vote again. \",\"predicate\":0},{\"type\":\"conditional\",\"content\":\"He wins it. Spain has a government.\",\"predicate\":1}]}],\"stateDependencies\":[{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===1);\"}},{\"type\":\"predicate\",\"fn\":{\"$code\":\"return ((Q['acting'] || 0)===0);\"}}]}},\"sp_events\":{\"id\":\"sp_events\",\"type\":\"scene\",\"title\":\"Federal Committee: the red lines\",\"newPage\":true,\"tags\":[\"sp_event\"],\"viewIf\":{\"$code\":\"return (((Q['red_lines_seen'] || 0)===0) && ((Q['year'] || 0)===2015));\"},\"maxVisits\":1,\"onArrival\":[{\"$code\":\"Q['red_lines_seen'] = 1;\"}],\"options\":[{\"id\":\"@sp_events.accept\",\"title\":\"Accept the red lines as written\"},{\"id\":\"@sp_events.soften\",\"title\":\"Accept the principle, but negotiate the wording\"},{\"id\":\"@sp_events.defy\",\"title\":\"Refuse: the leadership must be free to negotiate\"}],\"content\":[{\"type\":\"heading\",\"content\":\"28 December 2015 — The Federal Committee\"},{\"type\":\"paragraph\",\"content\":\"The regional barons arrive at Ferraz with a resolution already drafted. The PSOE will not negotiate with any party that supports a self-determination referendum for Catalonia, and Sánchez must bring any agreement back to the Federal Committee.\"},{\"type\":\"paragraph\",\"content\":\"Susana Díaz's allies call it a guarantee of the party's identity. Your team calls it a cage.\"}],\"countVisitsMax\":1}},\"qualities\":{},\"qdisplays\":{\"coalition_dissent\":{\"id\":\"coalition_dissent\",\"type\":\"qdisplay\",\"content\":[{\"max\":0,\"output\":\"very low\"},{\"min\":1,\"max\":1,\"output\":\"low\"},{\"min\":2,\"max\":2,\"output\":\"medium\"},{\"min\":3,\"max\":3,\"output\":\"high\"},{\"min\":4,\"output\":\"very high\"}]},\"dissent\":{\"id\":\"dissent\",\"type\":\"qdisplay\",\"content\":[{\"max\":4.999,\"output\":\"very low\"},{\"min\":4.999,\"max\":14.999,\"output\":\"low\"},{\"min\":14.999,\"max\":30.999,\"output\":\"medium\"},{\"min\":30.999,\"max\":49.999,\"output\":\"high\"},{\"min\":49.999,\"output\":\"very high\"}]},\"militancy\":{\"id\":\"militancy\",\"type\":\"qdisplay\",\"content\":[{\"max\":0.05,\"output\":\"Nonexistant\"},{\"min\":0.05,\"max\":0.14,\"output\":\"Very low\"},{\"min\":0.14,\"max\":0.24,\"output\":\"Low\"},{\"min\":0.24,\"max\":0.44,\"output\":\"Medium-low\"},{\"min\":0.44,\"max\":0.69,\"output\":\"Medium\"},{\"min\":0.69,\"max\":1,\"output\":\"High\"},{\"min\":1,\"output\":\"Very high\"}]},\"month\":{\"id\":\"month\",\"type\":\"qdisplay\",\"content\":[{\"min\":1,\"max\":1,\"output\":\"January\"},{\"min\":2,\"max\":2,\"output\":\"February\"},{\"min\":3,\"max\":3,\"output\":\"March\"},{\"min\":4,\"max\":4,\"output\":\"April\"},{\"min\":5,\"max\":5,\"output\":\"May\"},{\"min\":6,\"max\":6,\"output\":\"June\"},{\"min\":7,\"max\":7,\"output\":\"July\"},{\"min\":8,\"max\":8,\"output\":\"August\"},{\"min\":9,\"max\":9,\"output\":\"September\"},{\"min\":10,\"max\":10,\"output\":\"October\"},{\"min\":11,\"max\":11,\"output\":\"November\"},{\"min\":12,\"max\":12,\"output\":\"December\"}]},\"loyalty\":{\"id\":\"loyalty\",\"type\":\"qdisplay\",\"content\":[{\"max\":0.06,\"output\":\"completely disloyal\"},{\"min\":0.06,\"max\":0.19,\"output\":\"very disloyal\"},{\"min\":0.19,\"max\":0.31,\"output\":\"generally disloyal\"},{\"min\":0.31,\"max\":0.41,\"output\":\"mostly disloyal\"},{\"min\":0.41,\"max\":0.54,\"output\":\"divided\"},{\"min\":0.54,\"max\":0.71,\"output\":\"mostly loyal\"},{\"min\":0.71,\"max\":0.95,\"output\":\"generally loyal\"},{\"min\":0.95,\"output\":\"completely loyal\"}]},\"relationships\":{\"id\":\"relationships\",\"type\":\"qdisplay\",\"content\":[{\"max\":5,\"output\":\"hostile\"},{\"min\":5,\"max\":14.9,\"output\":\"frigid\"},{\"min\":14.9,\"max\":29.9,\"output\":\"cold\"},{\"min\":29.9,\"max\":39.9,\"output\":\"cool\"},{\"min\":39.9,\"max\":54.9,\"output\":\"neutral\"},{\"min\":54.9,\"max\":64.9,\"output\":\"warm\"},{\"min\":64.9,\"max\":74.9,\"output\":\"friendly\"},{\"min\":74.9,\"output\":\"very friendly\"}]},\"taxation\":{\"id\":\"taxation\",\"type\":\"qdisplay\",\"content\":[{\"max\":-6,\"output\":\"extremely low\"},{\"min\":-5,\"max\":-4,\"output\":\"very low\"},{\"min\":-3,\"max\":-2,\"output\":\"low\"},{\"min\":-1,\"max\":-1,\"output\":\"below baseline\"},{\"min\":0,\"max\":0,\"output\":\"moderate\"},{\"min\":1,\"max\":1,\"output\":\"above baseline\"},{\"min\":2,\"max\":3,\"output\":\"high\"},{\"min\":4,\"max\":5,\"output\":\"very high\"},{\"min\":6,\"output\":\"extremely high\"}]},\"strength\":{\"id\":\"strength\",\"type\":\"qdisplay\",\"content\":[{\"min\":0,\"max\":10,\"output\":\"weak\"},{\"min\":10,\"max\":25,\"output\":\"moderate\"},{\"min\":25,\"max\":40,\"output\":\"strong\"},{\"min\":40,\"max\":60,\"output\":\"very strong\"},{\"min\":60,\"output\":\"dominant\"}]}},\"tagLookup\":{\"sp_advisor\":{\"sp_advisers.candidacy\":true,\"sp_advisers\":true},\"sp_event\":{\"sp_events.iglesias_offer\":true,\"sp_events.pp_round\":true,\"sp_events.king_turns\":true,\"sp_events.dissolution\":true,\"sp_events.general_election\":true,\"sp_events.regional_elections\":true,\"sp_events.federal_committee\":true,\"sp_events.primary\":true,\"sp_events.deadlock_vote\":true,\"sp_events\":true},\"sp_party\":{\"sp_party.membership\":true,\"sp_party\":true},\"sp_politics\":{\"sp_negotiations.media\":true,\"sp_negotiations\":true}}}"};(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  'use strict';

  // To avoid the need to include any utility libraries when this is
  // used in a browser, define some helper functions we'd normally
  // rely on libraries for.

  var assert = function(mustBeTrue) {
    /* istanbul ignore if */
    if (!mustBeTrue) {
      throw new Error('Assertion failed.');
    }
  };

  var each = function(array, fn) {
    for (var i = 0; i < array.length; ++i) {
      fn(array[i]);
    }
  };

  var objEach = function(obj, fn) {
    for (var key in obj) {
      fn(key, obj[key]);
    }
  };

  var merge = function() {
    var result = {};
    for (var i = 0; i < arguments.length; ++i) {
      var obj = arguments[i];
      for (var key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  };

  // Credit: Taken from Lodash (MIT License). See CREDITS.
  var isObject = function(value) {
    var type = typeof value;
    return type === 'function' || (value && type === 'object') || false;
  };

  var makeFunctionFromSource = function(source) {
    source = source.trim();
    /*jshint -W054 */
    var fn = new Function('state', 'Q', source);
    /*jshint +W054 */
    fn.source = source;
    return fn;
  };

  var runActions = function(actions, context, state) {
    if (actions === undefined) {
      return;
    }
    each(actions, function(fn) {
      try {
        fn.call(context, state, state.qualities);
      } catch (err) {
        // Ignore errors. TODO: Log them somehow?
        console.log('Error:', err);
      }
    });
  };

  var runPredicate = function(predicate, default_, context, state) {
    var result = default_;
    if (predicate === undefined) {
      return result;
    }
    try {
      result = !!predicate.call(context, state, state.qualities);
    } catch (err) {
      // Ignore errors. TODO: Log them somehow?
      console.log('Error:', err);
    }
    return result;
  };

  var runExpression = function(expression, default_, context, state) {
    var result = default_;
    if (expression === undefined) {
      return result;
    }
    try {
      result = expression.call(context, state, state.qualities);
    } catch (err) {
      // Ignore errors. TODO: Log them somehow?
      console.log('Error in expression', expression, ':', err);
    }
    return result;
  };

  var convertJSONToGame = function(json, callback) {
    var reviver = function(key, value) {
      if (isObject(value) && value.$code !== undefined) {
        return makeFunctionFromSource(value.$code);
      } else {
        return value;
      }
    };

    try {
      var game = JSON.parse(json, reviver);
      return callback(null, game);
    } catch (err) {
      return callback(err);
    }
  };

  var simpleContent = function(text) {
    return [{type:'paragraph', content:text}];
  };

  var getCardinalNumber = function(value) {
    if (Math.floor(value) === value && value >= 0 && value <= 12) {
      // Integer, so use word.
      return ['zero', 'one', 'two', 'three', 'four', 'five', 'six',
              'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][value];
    } else {
      return value.toString();
    }
  };

  var getOrdinalNumber = function(value) {
    if (Math.floor(value) === value && value >= 0) {
      if (value <= 12) {
        return ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth',
                'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh',
                'twelfth'][value];
      } else {
        value = value.toString();
        if (/1[0-9]$/.test(value)) {
          return value + 'th';
        } else {
          var last = value.substr(value.length - 1, 1);
          switch (last) {
            case '1': return value + 'st';
            case '2': return value + 'nd';
            case '3': return value + 'rd';
            default: return value + 'th';
          }
        }
      }
    } else {
      return value.toString();
    }
  };

  var getFudgeDisplay = function(value) {
    if (Math.floor(value) === value) {
      if (value > 3) {
        return 'superb+' + (value - 3);
      } else if (value < -3) {
        return 'terrible' + (value + 3);
      } else {
        switch (value) {
          case  3: return 'superb';
          case  2: return 'great';
          case  1: return 'good';
          case  0: return 'fair';
          case -1: return 'mediocre';
          case -2: return 'poor';
          case -3: return 'terrible';
        }
      }
    } else {
      return value.toString();
    }
  };

  var getUserQDisplay = function(value, qdisplay) {
    for (var i = 0; i < qdisplay.content.length; ++i) {
      var case_ = qdisplay.content[i];
      var min = case_.min;
      var max = case_.max;
      if ((min === undefined || min <= value) &&
          (max === undefined || max >= value)) {
        if (case_.output !== undefined) {
          return case_.output;
        } else {
          return value.toString();
        }
      }
    }
    return value.toString();
  };

  // broad difficulty from https://fallenlondon.wiki/wiki/Broad_difficulty
  
  var calculateBroadDifficulty = function(quality, difficulty, scaler, random) {
    if (!scaler) {
      scaler = 0.6;
    }
    if (scaler > 1) {
      scaler = scaler/100;
    }
    var success_prob = scaler*(quality/difficulty);
    if (success_prob > 1) {
      success_prob = 1;
    }
    return success_prob;
 };

  // narrow difficulty from https://fallenlondon.wiki/wiki/Narrow_difficulty
  var calculateNarrowDifficulty = function(quality, difficulty, increment) {
    if (!increment) {
      increment = 0.1;
    }
    if (increment > 1) {
      increment = increment/100;
    }
    var success_prob = (quality - difficulty)*increment + 0.5;
    if (success_prob > 1) {
      success_prob = 1;
    } else if (success_prob < increment) {
      success_prob = increment;
    }
    return success_prob;
  };

  // this function actually does the roll for success.
  var rollDifficulty = function(success_prob, random) {
    var rn;
    if (random) {
      rn = random.random();

    } else {
      rn = Math.random();
    }
    if (rn < success_prob) {
      return true;
    }
    return false;   
  };


  // use the storynexus adjectives
  var displayDifficulty = function(success_prob) {
    if (success_prob <= 0.1) {
      return "almost impossible";
    } else if (success_prob <= 0.3) {
      return "high-risk";
    } else if (success_prob <= 0.4) {
      return "tough";
    } else if (success_prob <= 0.5) {
      return "very chancy";
    } else if (success_prob <= 0.6) {
      return "chancy";
    } else if (success_prob <= 0.7) {
      return "modest";
    } else if (success_prob <= 0.8) {
      return "very modest";
    } else if (success_prob <= 0.9) {
      return "low risk";
    } else {
      return "straightforward";
    }
  };


  // ------------------------------------------------------------------------

  // Objects with this interface are passed to a game state to have it
  // display content.
  var UserInterface = function() {};
  UserInterface.prototype.beginGame = function() {};
  UserInterface.prototype.displayContent = function(paragraphs, faceImage) {};
  // these are the dendrynexus display functions
  // displays the decks
  UserInterface.prototype.displayDecks = function(decks) {};
  // displays cards in hand
  UserInterface.prototype.displayHand = function(hand) {};
  // displays pinned cards (these are basically an alternate way of displaying choices)
  UserInterface.prototype.displayPinnedCards = function(cards) {};

  UserInterface.prototype.displayChoices = function(choices) {};
  UserInterface.prototype.displayGameOver = function() {
    this.displayContent(simpleContent('Game Over'));
  };
  UserInterface.prototype.removeChoices = function() {};
  // Called when the player makes a choice and new content is about to be
  // added (i.e. isn't called between output when the next scene is arrived
  // at via go-to).
  UserInterface.prototype.beginOutput = function() {};
  UserInterface.prototype.endOutput = function() {};
  UserInterface.prototype.newPage = function() {};
  UserInterface.prototype.setStyle = function(style) {};
  UserInterface.prototype.signal = function(data) {};
  UserInterface.prototype.setBg = function(img) {};
  UserInterface.prototype.setSprites = function(data) {};
  UserInterface.prototype.setSpriteStyle = function(loc, style) {};
  UserInterface.prototype.audio = function(audio) {};
  // Not part of the UI, but allows us to simply subclass.
  UserInterface.makeParentOf = function(OtherConstructor) {
    OtherConstructor.prototype = new UserInterface();
    OtherConstructor.constructor = OtherConstructor;
  };

  // ------------------------------------------------------------------------

  // An engine is given a user interface, the game and the current
  // game state (can be omitted). It is responsible for the logic of
  // the game.
  var DendryEngine = function(ui, game) {
    this.ui = ui;
    this.game = game;
  };

  DendryEngine.prototype.displayGameOver = function() {
    this.ui.displayGameOver();
    return this;
  };

  DendryEngine.prototype.displayChoices = function() {
    // TODO: dendrynexus - if the current scene is a hand, display the decks, hand, and pinned cards.
    var choices = this.getCurrentChoices();
    assert(choices);
    var scene = this.getCurrentScene();
    if (scene.isHand) {
      // separate choices into decks and pinned cards
      var decks = [];
      var pinnedCards = [];
      for (var c of choices) {
        var choiceScene = this.game.scenes[c.id];
        if (choiceScene.isDeck) {
          // if the deck has
          if (!this._drawFromDeck(c.id)) {
            c.canChoose = false;
            c.subtitle = c.unavailableSubtitle || "No cards available from deck.";
          } else {
            c.canChoose = true;
          }
          c.isDeck = true;
          c.image = choiceScene.cardImage;
          decks.push(c);
        } else if (choiceScene.isPinnedCard) {
          c.isDeck = false;
          c.image = choiceScene.cardImage;
          pinnedCards.push(c);
        }
      }
      if (!this.state.currentHands[this.state.sceneId]) {
        this.state.currentHands[this.state.sceneId] = [];
      }
      var currentHand = this.state.currentHands[this.state.sceneId];
      // TODO: check the viewIf/chooseIf conditions for all cards in the current hand, and filter them if they no longer work...
      var handIds = {};
      for (var card of currentHand) {
        handIds[card.id] = card;
      }
      handIds = this.__filterViewable(handIds);
      for (var i = 0; i < currentHand.length; i++) {
        while (currentHand[i] && !handIds[currentHand[i].id]) {
          currentHand.splice(i, 1);
        }
      }
      this.ui.displayDecks(decks);
      this.ui.displayHand(currentHand, scene.maxCards);
      this.ui.displayPinnedCards(pinnedCards);
    } else {
      if (this.state.enableTranscript) {
        this.transcript.push(choices);
      }
      this.ui.displayChoices(choices);
    }
    return this;
  };

  DendryEngine.prototype.displaySceneContent = function(restorePage) {
    var scene = this.getCurrentScene();
    assert(scene);
    // TODO: displaying images
    var faceImage = null;
    if (scene.faceImage) {
      faceImage = scene.faceImage;
    }
    var sceneSignal = scene.signal || this.game.sceneSignal;
    if (sceneSignal !== undefined) {
      this.ui.signal({signal:sceneSignal,
                      event:'scene-display',
                      id:this.state.sceneId});
    }
    if (restorePage) {
      this.ui.newPage();
      this.ui.displayContent(this.state.tempCurrentContent, faceImage);
      this.state.currentContent = this.state.tempCurrentContent.slice();
    } else if (scene.newPage) {
      this.ui.newPage();
      this.state.currentContent = [];
    }
    this.ui.setStyle(scene.style);
    this.ui.removeChoices();

    if (scene.content !== undefined && !restorePage) {
      var displayContent = this._makeDisplayContent(scene.content, true);
      if (this.state.enableTranscript) {
        this.transcript = this.transcript.concat(displayContent);
      }
      this.state.currentContent = this.state.currentContent.concat(displayContent);
      this.ui.displayContent(displayContent, faceImage);
    }
    this._runActions(scene.onDisplay);

    return this;
  };

  DendryEngine.prototype.choose = function(choiceIndex) {
    var choices = this.choiceCache;

    // Check for valid choice.
    assert(choices);
    if (choices.length <= choiceIndex) {
      throw new Error('No choice at index ' + choiceIndex + ', only ' +
                      choices.length + ' choices are available.');
    }

    // Commit the choice.
    var choice = choices[choiceIndex];
    if (!choice.canChoose) {
      throw new Error('Attempted to choose index ' + choiceIndex + ', but ' +
                      'that choice is unavailable.');
    }

    var id = choice.id;
    if (this.state.enableTranscript) {
      this.transcript.push('> ' + choice.title);
    }

    delete this.choiceCache;
    this.goToScene(id);

    return this;
  };

  DendryEngine.prototype.chooseSceneId = function(sceneId) {
    delete this.choiceCache;
    this.goToScene(id);

    return this;
  };

  // TODO: dendrynexus - draw card
  DendryEngine.prototype.drawCard = function(deckId) {
    var currentSceneId = this.state.sceneId;
    var scene = this.getCurrentScene();
    assert(scene);
    
    var currentHand = this.state.currentHands[currentSceneId];
    // return a message saying that there are too many cards
    if (scene.maxCards <= currentHand.length) {
      return {id: null, title: 'no_space_in_hand'};
    }
    // get an available card from deckId
    // card is {id: id, title: title}
    var card = this._drawFromDeck(deckId);
    // distinguish between the "no space left in hand" and "no card in deck" situations?
    if (!card) {
      return {id: null, title: 'no_card_in_deck'};
    }
    this.state.lastDrawnCard = card;
    var image = this.game.scenes[card.id].cardImage;
    card.image = image;
    this.state.currentHands[currentSceneId].push(card);

    // display the hand
    this.ui.displayHand(this.state.currentHands[currentSceneId], scene.maxCards);
    return card;
  };


  // dendrynexus - play a card (remove it from the current hand)
  // should this be the code for pinned cards as well?
  DendryEngine.prototype.playCard = function(cardId) {
    var currentSceneId = this.state.sceneId;
    var currentHand = this.state.currentHands[currentSceneId];
    // remove card from hand
    for (var i = 0; i < currentHand.length; i++) {
      if (currentHand[i].id == cardId) {
        currentHand.splice(i, 1);
        break;
      }
    }
    this.state.lastPlayedCard = this.game.scenes[cardId];
    delete this.choiceCache;
    this.goToScene(cardId);
  };

  DendryEngine.prototype.playPinnedCard = function(cardId) {
    delete this.choiceCache;
    this.goToScene(cardId);
  };

  DendryEngine.prototype.goToScene = function(id) {
    this.state.sceneIdsSinceGoTo = [];
    this.ui.beginOutput();
    this.__changeScene(id);
    this.ui.endOutput();
  };

  DendryEngine.prototype.beginGame = function(rndSeeds) {
    this.random = rndSeeds ? Random.fromSeeds(rndSeeds) : Random.fromUnique();
    this.state = {
      sceneId: null,
      sceneIdsSinceGoTo: [],
      rootSceneId: this.game.rootScene || this.game.firstScene || 'root',
      gameOver: false,
      visits: {},
      qualities: {},
      currentRandomState: null,
      currentContent: [],
      // tempCurrentContent is used for when the
      // player visits the stats or settings pages in order to remember
      // where the previous page was?
      tempCurrentContent: [],
      // prevSpecialSceneId is only set when visiting scene tagged with
      // isSpecial = true, and is the scene before the special scene.
      prevSpecialSceneId: null,
      prevSceneId: null,
      // every time a top-level scene changes,
      // this record the last-visited qualified id within that scene.
      prevTopSceneId: null,
      // jumpScene is defined within a scene file, indicating the scene that
      // @jumpScene will go to. Basically it's used to make subroutines.
      jumpSceneId: null,
      // achievements is a dict of all the current achievements.
      // persist achievements in the browser through localstorage?
      achievements: {},
      // current background image
      bg: null,
      // sceneStack is used for goSub
      sceneStack: [],
      // true if just popped out of a returnScene
      justReturned: false,
      // just returned from a goSubStart
      justReturnedStart: false,
      // just returned from a goSubEnd
      justReturnedEnd: false,
      // sprites is a mapping from location to file
      sprites: {},
      // dendrynexus stuff
      // mapping from sceneId to list of sceneIds - indicating the current hand in each of those scenes.
      currentHands: {},
      // last drawn card
      lastDrawnCard: null,
      lastPlayedCard: null,

      enableTranscript: false,
      // whether or not to disable saves
      disableSaves: false,
    };
    // TODO: transcript
    this.transcript = [];

    this._setUpQualities();
    this._loadAchievements();

    this.ui.beginGame();

    var id = this.game.firstScene || this.state.rootSceneId;
    this.goToScene(id);

    return this;
  };

  DendryEngine.prototype._loadAchievements = function() {
    if (typeof localStorage !== 'undefined') {
        if (localStorage[this.game.title + '_achievements']) {
            this.state.achievements = JSON.parse(
                localStorage[this.game.title + '_achievements']);
            // add a special quality named 'achievement_'
            for (var achievement in this.state.achievements) {
                this.state.qualities['achievement_' + achievement] = 1;
            }
        }
    }
  };

  DendryEngine.prototype.gameOver = function() {
    this.state.gameOver = true;
    this.displayGameOver();
    return this;
  };

  DendryEngine.prototype.isGameOver = function() {
    return this.state.gameOver;
  };

  DendryEngine.prototype.getCurrentScene = function() {
    var scene = this.game.scenes[this.state.sceneId];
    assert(scene !== undefined);
    return scene;
  };

  // Returns the choices for the current scene. Choices are objects
  // with an id and a title property, not to be confused with the
  // option objects in a scene (though options are used to generate
  // choices). Choices are compiled from the options belonging to the
  // current scene.
  DendryEngine.prototype.getCurrentChoices = function() {
    return this.choiceCache;
  };

  // Sets the current state of the engine from an exportable state.
  DendryEngine.prototype.setState = function(state) {
    // Set the state.
    this.state = state;
    this._setUpQualities();
    this.random = Random.fromState(this.state.currentRandomState);
    this._loadAchievements();

    // Display the current state.
    if (this.isGameOver()) {
      this.displayGameOver();
    } else {
      var scene = this.getCurrentScene();
      this.choiceCache = this._compileChoices(scene);
      this.ui.newPage();
      this.ui.removeChoices();
      this.ui.displayContent(this.state.currentContent);
      this.displayChoices();
      this.ui.setSprites(this.state.sprites);
      this.ui.setBg(this.state.bg);
    }
    return this;
  };

  // Returns a data structure for exporting without any accessors or
  // complex classes.
  DendryEngine.prototype.getExportableState = function() {
    // Because we only have complex state in the qualities (they have
    // accessors), and because we save with JSON (which calls
    // accessors correctly), we don't have to worry about giving the
    // actual state. Note that, if you want to keep this object, however,
    // you want to clone it somehow (turning it to and from json,
    // for example), otherwise it will change as the engine updates.
    return this.state;
  };

  // ------------------------------------------------------------------------

  DendryEngine.prototype._getQDisplay = function(value, qDisplayId) {
    switch (qDisplayId) {
    case 'cardinal': case 'number':
      return getCardinalNumber(value);
    case 'ordinal':
      return getOrdinalNumber(value);
    case 'fudge':
      return getFudgeDisplay(value);
    default:
      var qdisplay = this.game.qdisplays[qDisplayId];
      assert(qdisplay !== undefined);
      return getUserQDisplay(value, qdisplay);
    }
  };

  DendryEngine.prototype._evaluateStateDependencies = function(defs) {
    var result = [];

    for (var i = 0; i < defs.length; ++i) {
      var value;
      var def = defs[i];
      var fn = def.fn;
      switch (def.type) {
      case 'insert':
        value = this._runExpression(fn);
        if (def.qdisplay) {
          value = this._getQDisplay(value, def.qdisplay);
        } else {
          value = value.toString();
        }
        break;

      default:
        assert(def.type === 'predicate');
        value = this._runPredicate(fn);
        break;
      }

      // Recurse the resolution into the resulting value, if needed.
      if (value.stateDependencies !== undefined) {
        // We have to resolve the nested state dependencies.
        value = this._makeDisplayContent(value, false);
      }
      result.push(value);
    }
    return result;
  };

  DendryEngine.prototype._mergeStateEvalsInArray = function(array, evals) {
    if (!Array.isArray(array)) {
      array = [array];
    }
    var result = [];
    for (var i = 0; i < array.length; ++i) {
      result = result.concat(this._mergeStateEvals(array[i], evals));
    }
    return result;
  };

  DendryEngine.prototype._mergeStateEvals = function(content, evals) {
    if (content.type === undefined) {
      return [content];
    }

    var result;
    switch (content.type) {
    case 'conditional':
      if (evals[content.predicate]) {
        result = this._mergeStateEvalsInArray(content.content, evals);
      } else {
        result = [];
      }
      break;
    case 'insert':
      result = evals[content.insert];
      break;
    default:
      var newE = {type:content.type};
      newE.content = this._mergeStateEvalsInArray(content.content, evals);
      result = [newE];
      break;
    }
    return result;
  };

  DendryEngine.prototype._makeDisplayContent = function(content, useParas) {
    // Raw content can just be returned.
    if (content.content === undefined) {
      if (Array.isArray(content)) {
        return content;
      } else if (useParas) {
        return [{type:'paragraph', content:content}];
      } else {
        return [content];
      }
    } else if (content.stateDependencies === undefined &&
               content.type !== undefined) {
      return [content];
    }

    // Merge in dependencies if we have them
    var stateDepDefs = content.stateDependencies;
    var displayContent = content.content;
    if (stateDepDefs && stateDepDefs.length > 0) {
      var evals = this._evaluateStateDependencies(stateDepDefs);
      if (!Array.isArray(displayContent)) {
        displayContent = [displayContent];
      }
      displayContent = this._mergeStateEvalsInArray(
        displayContent, evals
      );
    }
    return displayContent;
  };

  DendryEngine.prototype._setUpQualities = function() {
    var _Q = this._qualitiesAccessorsPrivate = {};
    var Q = this.state.qualities;
    var that = this;
    objEach(this.game.qualities, function(id, quality) {
      var min = quality.min;
      var max = quality.max;
      var signal = quality.signal || that.game.qualitySignal;
      var predicate = quality.isValid;
      var needsAccessors = (
        min !== undefined ||
        max !== undefined ||
        signal !== undefined ||
        predicate !== undefined
      );
      if (needsAccessors) {
        if (Q[id] !== undefined) {
          _Q[id] = Q[id];
        }
        Q.__defineGetter__(id, function() {
          return _Q[id];
        });
        Q.__defineSetter__(id, function(value) {
          if (min !== undefined && value < min) {
            value = min;
          }
          if (max !== undefined && value > max) {
            value = max;
          }
          var was = _Q[id];
          _Q[id] = value;

          // Check if the new value is not allowed.
          if (!that._runPredicate(predicate, true)) {
            // Reverse the change.
            _Q[id] = value = was;
          }

          // Signal after the change is made.
          if (signal !== undefined && value !== was) {
            var signalObj = {
              signal: signal,
              event: 'quality-change',
              id: id,
              now: value
            };
            if (was !== undefined) {
              signalObj.was = was;
            }
            that.ui.signal(signalObj);
          }
        });
      }
      if (quality.initial !== undefined && Q[id] === undefined) {
        Q[id] = quality.initial;
      }
    });
  };

  DendryEngine.prototype._runActions = function(actions) {
    runActions(actions, this, this.state);
  };

  DendryEngine.prototype._runPredicate = function(predicate, default_) {
    return runPredicate(predicate, default_, this, this.state);
  };

  DendryEngine.prototype._runExpression = function(expression, default_) {
    return runExpression(expression, default_, this, this.state);
  };

  DendryEngine.prototype.__changeScene = function(id) {
    if (this.state.justReturned) {
        this.state.justReturned = false;
    }
    var scene = null;
    var restorePage = false;
    // if id is 'prevScene', go to the previous scene.
    if (id == 'prevScene') {
      if (this.prevSceneId === null) {
        // this really only comes up on the very first scene of the game.
      }
      scene = this.game.scenes[this.state.prevSceneId];
      id = this.state.prevSceneId;
      assert(scene);
    } else if (id == 'prevTopScene') {
      scene = this.game.scenes[this.state.prevTopSceneId];
      id = this.state.prevTopSceneId;
      assert(scene);
    } else if (id == 'jumpScene') {
      scene = this.game.scenes[this.state.jumpSceneId];
      id = this.state.jumpSceneId;
      assert(scene);
    } else if (id === 'backSpecialScene') {
      scene = this.game.scenes[this.state.prevSpecialSceneId];
      id = this.state.prevSpecialSceneId;
      restorePage = true;
      assert(scene);
      // if prevSpecialSceneId is null, this indicates that
      // we're not within a specialScene, and we can set a jump point.
      this.state.prevSpecialSceneId = null;
    } else {
      scene = this.game.scenes[id];
      assert(scene);
    }


    // Leave previous scene.
    var fromId = this.state.sceneId;
    if (!!fromId) {
      this.state.prevSceneId = fromId;
      // TODO: this doesn't necessarily work... there should be
      // a different classification of top scenes
      if (scene.isTop) {
        this.state.prevTopSceneId = fromId;
      }
      if (scene.isSpecial && this.state.prevSpecialSceneId === null) {
        this.state.tempCurrentContent = this.state.currentContent.slice();
        this.state.prevSpecialSceneId = fromId;
      }
      var from = this.getCurrentScene();
      this._runActions(from.onDeparture);
      var fromSignal = from.signal || this.game.sceneSignal;
      if (fromSignal !== undefined) {
        this.ui.signal({signal:fromSignal,
                        event:'scene-departure',
                        id:this.state.sceneId,
                        'to':id});
      }
    }

    // Arrive at current scene.
    this.state.sceneId = id;
    this.state.sceneIdsSinceGoTo.push(id);

    if (scene.setRoot) {
      this.state.rootSceneId = id;
    }
    if (scene.setJump) {
      this.state.jumpSceneId = scene.setJump;
    }

    if (scene.countVisitsMax !== undefined) {
      if (this.state.visits[id] === undefined) {
        this.state.visits[id] = 1;
      } else if (this.state.visits[id] < scene.countVisitsMax) {
        this.state.visits[id]++;
      }
    }

    if (!restorePage && !this.state.justReturned) {
        // If we go back from a special scene (e.g. the stats page),
        // we probably don't want to run the scene actions again.
        this._runActions(scene.onArrival);
        // TODO: After running onArrival, we should run call if call has
        if (scene.call) {
          var callScene = this.game.scenes[scene.call];
          this._runActions(callScene.onArrival);
        }
    }
    var sceneSignal = scene.signal || this.game.sceneSignal;
    if (sceneSignal !== undefined) {
      var signal = {
        signal: sceneSignal,
        event: 'scene-arrival',
        id: id
      };
      if (!!fromId) {
        signal.from = fromId;
      }
      this.ui.signal(signal);
    }

    // We're done with any code that might generate random numbers
    // (except go-to, which will recurse into this method anyway), so we
    // can store the seed which can be used to replay the behavior
    // from here.
    this.state.currentRandomState = this.random.getState();
    //if (!this.state.justReturned) {
        // if the state has just returned from a goSub, we don't display
        // the content?
        // TODO: i'm not sure what the best logic for this is...
        // Maybe the text pre-gosub should be displayed only after the goSub?
    this.displaySceneContent(restorePage);
    //}
    // display background
    if (scene.setBg) {
        this.state.bg = scene.setBg;
        this.ui.setBg(scene.setBg);
    }
    if (scene.setSprites) {
        this.state.sprites = scene.setSprites;
        this.ui.setSprites(scene.setSprites);
    }
    if (scene.audio) {
        this.ui.audio(scene.audio);
    }
    // TODO: there has got to be a better way of doing this.
    if (scene.setTopLeftStyle) {
        this.ui.setSpriteStyle('topLeft', scene.setTopLeftStyle);
    }
    if (scene.setTopRightStyle) {
        this.ui.setSpriteStyle('topRight', scene.setTopRightStyle);
    }
    if (scene.setBottomLeftStyle) {
        this.ui.setSpriteStyle('bottomLeft', scene.setBottomLeftStyle);
    }
    if (scene.setBottomRightStyle) {
        this.ui.setSpriteStyle('bottomRight', scene.setBottomRightStyle);
    }
    // update achievement
    if (scene.achievement) {
        this.achieve(scene.achievement);

    }

    // Check if we have any reason to leave the scene, or end the game.
    var done = false;
    if (scene.gameOver === true) {
      done = true;
      this.gameOver();
    } else if (scene.goSubEnd && !this.state.justReturnedEnd) {
      // goSub
      var validSubs = [];
      for (var s1 = 0; s1 < scene.goSub.length; ++s1) {
        var sub = scene.goSub[s1];
        if (sub.predicate === undefined ||
            this._runPredicate(sub.predicate)) {
          validSubs.push(sub.id);
        }
      }
    } else if (scene.goTo) {
      // Find all valid gotos.
      var validGoToIds = [];
      for (var i = 0; i < scene.goTo.length; ++i) {
        var goTo = scene.goTo[i];
        if (goTo.predicate === undefined ||
            this._runPredicate(goTo.predicate)) {
          validGoToIds.push(goTo.id);
        }
      }
      if (validGoToIds.length === 1) {
        done = true;
        this.__changeScene(validGoToIds[0]);
      } else if (validGoToIds.length > 1) {
        var randomNumber = this.random.uint32();
        var choice = randomNumber % validGoToIds.length;
        var chosenGoToId = validGoToIds[choice];
        done = true;
        this.__changeScene(chosenGoToId);
      }
    } else if (scene.goToRef) {
      // do some gotoref
      var validRefs = [];
      for (var s = 0; s < scene.goToRef.length; ++s) {
        var ref = scene.goToRef[s];
        if (ref.predicate === undefined ||
            this._runPredicate(ref.predicate)) {
          validRefs.push(ref.id);
        }
      }
      if (validRefs.length === 1) {
        done = true;
        this.__changeScene(this.state.qualities[validRefs[0]]);
      } else if (validRefs.length > 1) {
        var c = this.random.uint32() % validRefs.length;
        var chosenRef = validRefs[c];
        done = true;
        this.__changeScene(this.state.qualities[chosenRef]);
      }
    }

    // dendrynexus: calculate checks
    // WHAT IF scenes have gotos and checks. huh. don't do that. Let's just say that is undefined behavior.
    var hasCheck = false;
    var successProb, isSuccess;
    if (scene.checkQuality && scene.broadDifficulty && scene.checkSuccessGoTo && scene.checkFailureGoTo) {
      var scaler = 0.6;
      if (scene.difficultyScaler) {
        scaler = scene.difficultyScaler;
      }
      successProb = calculateBroadDifficulty(this.state.qualities[scene.checkQuality] || 0, scene.broadDifficulty, scaler);
      hasCheck = true;
    } else if (scene.checkQuality && scene.narrowDifficulty && scene.checkSuccessGoTo && scene.checkFailureGoTo) {
      var increment = 0.1;
      if (scene.difficultyIncrement) {
        increment = scene.difficultyIncrement;
      }
      successProb = calculateNarrowDifficulty(this.state.qualities[scene.checkQuality] || 0, scene.narrowDifficulty, increment);
      hasCheck = true;
    }
    if (hasCheck) {
      isSuccess = rollDifficulty(successProb, this.random); 
      // logic for changing the scene on success/failure of the check
      done = true;
      if (isSuccess) {
        this.__changeScene(scene.checkSuccessGoTo);
      } else {
        this.__changeScene(scene.checkFailureGoTo);
      }
    }

    // If we've not ended, nor found a valid go-to, then we try choices.
    if (!done) {
      this.choiceCache = this._compileChoices(scene);
      if (this.choiceCache === null) {
        // Explicitly disallowing game over keeps us stuck here.
        if (scene.gameOver !== false) {
          this.gameOver();
        }
      } else {
        this.displayChoices();
      }
    }
  };

  DendryEngine.prototype.achieve = function(achievementName) {
    this.state.achievements[achievementName] = 1;
    // add a special quality named 'achievement_'
    this.state.qualities['achievement_' + achievementName] = 1;
    // add a new quality indicating that the achievement has been done for the current game
    this.state.qualities['game_achievement_' + achievementName] = 1;
    // set localStorage for achievement
    if (typeof localStorage !== 'undefined') {
      localStorage[this.game.title + '_achievements'] = JSON.stringify(this.state.achievements);
    }
  };

  DendryEngine.prototype.__getChoiceSelectionData = function(idToInfoMap) {
    var result = [];
    for (var id in idToInfoMap) {
      var optionScene = this.game.scenes[id];
      var optionInfo = idToInfoMap[id];

      optionInfo.order = optionInfo.order || optionScene.order || 0;
      optionInfo.priority = optionInfo.priority || optionScene.priority || 1;
      // Because 'null' is a valid frequency, we can't use || to do this.
      if (optionInfo.frequency === undefined) {
        optionInfo.frequency = optionScene.frequency;
        if (optionInfo.frequency === undefined) {
          optionInfo.frequency = 100;
        }
      }
      optionInfo.selectionPriority = 0; // Used by __filterByPriority

      result.push(optionInfo);
    }
    return result;
  };

  DendryEngine.prototype.__filterViewable = function(idToInfoMap) {
    var result = {};
    for (var id in idToInfoMap) {
      var thisScene = this.game.scenes[id];

      // This id fails if it is past its max visits.
      var maxVisits = thisScene.maxVisits;
      if (maxVisits !== undefined) {
        var visits = this.state.visits[id] || 0;
        if (visits >= maxVisits) {
          continue;
        }
      }

      // Fiter out scenes that can't be viewed.
      var canView = this._runPredicate(thisScene.viewIf, true);
      if (!canView) {
        continue;
      }

      // It passes otherwise.
      result[id] = idToInfoMap[id];
    }
    return result;
  };

  DendryEngine.prototype.__getChoiceIdsFromOptions = function(options) {
    var that = this;

    var choices = {};
    each(options, function(option) {
      // Filter out options that can't be viewed.
      if (!that._runPredicate(option.viewIf, true)) {
        return;
      }

      if (option.id.substr(0, 1) === '@') {
        // This is an id, use it.
        var trimmedId = option.id.substring(1);
        var choice = merge(option, {id:trimmedId});
        choices[trimmedId] = choice;
      } else {
        assert(option.id.substr(0, 1) === '#');
        // This is a tag, add all matching ids.
        var ids = that.game.tagLookup[option.id.substring(1)];
        objEach(ids, function(id) {
          if (choices[id] === undefined) {
            choices[id] = merge(option, {id:id});
          }
        });
      }
    });
    return choices;
  };

  // Code based on Undum (MIT License). See CREDITS.
  DendryEngine.prototype.__filterByPriority = function(choices,
                                                       minChoices,
                                                       maxChoices) {
    assert(minChoices === null ||
           maxChoices === null ||
           maxChoices >= minChoices);
    var that = this;

    var committed = [];
    var candidates = [];
    var choice;

    // Work in descending priority order.
    choices.sort(function(a, b) {
      return b.priority - a.priority;
    });

    // First phase: we make sure we have at least our minimum number
    // of choices, and that we consider the minimum possible number of
    // priorities to reach that minimum.
    var lastPriority;
    for (var i = 0; i < choices.length; ++i) {
      choice = choices[i];
      if (choice.priority !== lastPriority) {
        if (lastPriority !== undefined) {
          // Priority has decreased, use the candidates if there are enough.
          if (minChoices === null || i >= minChoices) {
            break;
          }
        }

        // We're going on, so commit our current candidates.
        committed.push.apply(committed, candidates);
        candidates = [];
        lastPriority = choice.priority;
      }
      candidates.push(choice);
    }

    // Second phase: we commit as many candidates as we can without
    // exceeding our maximum.
    // TODO: think about tag choices vs builtin choices
    var committedChoices = committed.length;
    var totalChoices = committedChoices + candidates.length;
    if (maxChoices === null || maxChoices >= totalChoices) {
      // We can use all the candidates without exceeding our maximum.
      committed.push.apply(committed, candidates);
    } else {
      // Take a subset of the candidates, using their relative frequency.
      each(candidates, function(choice) {
        if (choice.frequency === null) {
          choice.selectionPriority = 0; // Always choose.
        } else {
          choice.selectionPriority = that.random.random() / choice.frequency;
        }
      });
      candidates.sort(function(a, b) {
        return a.selectionPriority - b.selectionPriority;
      });
      var extraChoices = maxChoices - committedChoices;
      var chosen = candidates.slice(0, extraChoices);
      committed.push.apply(committed, chosen);
    }

    return committed;
  };

  DendryEngine.prototype.__getChoiceDisplayData = function(choicesSelected) {
    var choiceOutput = [];
    var numChoosable = 0;

    for (var i = 0; i < choicesSelected.length; ++i) {
      var choice = choicesSelected[i];
      var choiceScene = this.game.scenes[choice.id];

      // Figure out if this choice can be chosen.
      var canChoose = true;
      if (choice.chooseIf) {
        canChoose = this._runPredicate(choice.chooseIf, true);
      }
      if (canChoose && choiceScene.chooseIf) {
        canChoose = this._runPredicate(choiceScene.chooseIf, true);
      }

      var title = choice.title || choiceScene.title;
      assert(title);

      var subtitle = null;
      if (!canChoose) {
        subtitle = choice.unavailableSubtitle ||
                   choiceScene.unavailableSubtitle;
      }
      if (!subtitle) {
        subtitle = choice.subtitle || choiceScene.subtitle;
      }


      var finalChoice = {
        id:choice.id,
        canChoose:canChoose,
        title:this._makeDisplayContent(title, false)
      };
      if (subtitle) {
        finalChoice.subtitle = this._makeDisplayContent(subtitle, false);
      }
      // dendrynexus - add success/failure probabilities, and challenges.
      var successProb;
      if (choiceScene.checkQuality && choiceScene.broadDifficulty && choiceScene.checkSuccessGoTo && choiceScene.checkFailureGoTo) {
        var scaler = 0.6;
        if (choiceScene.difficultyScaler) {
          scaler = choiceScene.difficultyScaler;
        }
        successProb = calculateBroadDifficulty(this.state.qualities[choiceScene.checkQuality] || 0, choiceScene.broadDifficulty, scaler);
        finalChoice.checkQuality = choiceScene.checkQuality;
        finalChoice.successProb = successProb;
        finalChoice.difficulty = displayDifficulty(successProb);
      } else if (choiceScene.checkQuality && choiceScene.narrowDifficulty && choiceScene.checkSuccessGoTo && choiceScene.checkFailureGoTo) {
        var increment = 0.1;
        if (choiceScene.difficultyIncrement) {
          increment = choiceScene.difficultyIncrement;
        }
        successProb = calculateNarrowDifficulty(this.state.qualities[choiceScene.checkQuality] || 0, choiceScene.narrowDifficulty, increment);
        finalChoice.checkQuality = choiceScene.checkQuality;
        finalChoice.successProb = successProb;
        finalChoice.difficulty = displayDifficulty(successProb);
      }

      choiceOutput.push(finalChoice);
      if (canChoose) {
        ++numChoosable;
      }
    }

    return {choices:choiceOutput, numChoosable:numChoosable};
  };

  DendryEngine.prototype._compileChoices = function(scene) {
    assert(scene);

    var options = scene.options;
    var choiceOutput = [];
    var numChoosable = 0;
    if (options !== undefined) {

      var choiceIds = this.__getChoiceIdsFromOptions(options);
      choiceIds = this.__filterViewable(choiceIds);

      var validChoiceData = this.__getChoiceSelectionData(choiceIds);
      var minChoices = scene.minChoices || null;
      var maxChoices = scene.maxChoices || null;
      validChoiceData = this.__filterByPriority(validChoiceData,
                                                minChoices, maxChoices);

      // Sort the result into display order.
      validChoiceData.sort(function(a, b) {
        return a.order - b.order;
      });

      // Now we've chosen our selection, get the final displayable data.
      var data = this.__getChoiceDisplayData(validChoiceData);
      choiceOutput = data.choices;
      numChoosable = data.numChoosable;
    }

    if (numChoosable === 0) {
      // We have no choosable options, so add the default option (NB:
      // this may take us over the max-choices limit).
      var root = this.state.rootSceneId;
      if (root !== this.state.sceneId) {
        var rootSceneChoose = this.game.scenes[root].chooseIf;
        if (!rootSceneChoose || this._runPredicate(rootSceneChoose, true)) {
          choiceOutput.push({id:root, title:'Continue...', canChoose:true});
          ++numChoosable;
        }
      }
    }
    if (numChoosable > 0) {
      return choiceOutput;
    } else {
      return null;
    }
  };


  // dendrynexus - this returns a single available card from the given deck, formatted as an object of the type {id: id, title: title}
  DendryEngine.prototype._drawFromDeck = function(deckId) {
    var scene = this.game.scenes[deckId];
    var viewableScenes = this._compileChoices(scene);
    if (!viewableScenes) {
      return null;
    }
    var choosableScenes = [];
    var currentHand = this.state.currentHands[this.state.sceneId];
    if (!currentHand) {
        currentHand = [];
    }
    currentHand = currentHand.map((x)=>x.id);
    for (var x of viewableScenes) {
      var choiceScene = this.game.scenes[x.id];
      // filter for whether the card is in the hand
      if (x.canChoose && choiceScene.isCard &&  currentHand.indexOf(x.id) < 0) {
        choosableScenes.push(x);
      }
    }
    if (!choosableScenes) {
      return null;
    }
    var randomNumber = this.random.uint32();
    var choice = randomNumber % choosableScenes.length;
    // this.state.currentRandomState = this.random.getState();
    return choosableScenes[choice];
  };

  // ------------------------------------------------------------------------

  // Marsaglia, George (July 2003). 'Xorshift RNGs'.
  // Journal of Statistical Software 8 (14).
  var Random = function(v, w, x, y, z) {
    this.getState = function() {
      return [v, w, x, y, z];
    };
    var uint32Multiply = function(a, b) {
      var aHigh = (a >> 16) & 0xffff;
      var aLow = a & 0xffff;
      var bHigh = (b >> 16) & 0xffff;
      var bLow = b & 0xffff;
      var prodHigh = ((aHigh * bLow) + (aLow * bHigh)) & 0xffff;
      return ((prodHigh << 16) >>> 0) + (aLow * bLow);
    };
    this.uint32 = function() {
      var t = (x ^ (x >>> 7)) >>> 0;
      x = y;
      y = z;
      z = w;
      w = v;
      v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
      return uint32Multiply((y + y + 1), v) >>> 0;
    };
    this.random = function() {
      return this.uint32() * 2.3283064365386963e-10;
    };
  };

  var __next = 1;
  Random.fromUnique = function() {
    var seed = new Date().getTime();
    return Random.fromSeeds([seed, __next++]);
  };

  Random.fromTime = function() {
    return Random.fromSeeds([new Date().getTime()]);
  };

  Random.fromSeeds = function(seeds) {
    var v = 886756453;
    var w = 88675123;
    var x = 123456789;
    var y = 362436069;
    var z = 521288629;

    // The seed hashing function is based on Mash 0.9 (MIT License).
    // See CREDITS.
    var hashSeed = function(data) {
      data = data.toString();
      var n = 0xefc8249d;
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000;
      }
      return (n >>> 0) * 2.3283064365386963e-10;
    };

    for (var i = 0; i < seeds.length; i++) {
      var hashedSeed = hashSeed(seeds[i]) * 0x100000000;
      v ^= hashedSeed;
      w ^= hashedSeed;
      x ^= hashedSeed;
      y ^= hashedSeed;
      z ^= hashedSeed;
    }
    return new Random(v, w, x, y, z);
  };

  Random.fromState = function(state) {
    return new Random(state[0], state[1], state[2], state[3], state[4]);
  };

  // ------------------------------------------------------------------------

  module.exports = {
    makeFunctionFromSource: makeFunctionFromSource,
    runActions: runActions,
    runPredicate: runPredicate,
    runExpression: runExpression,
    convertJSONToGame: convertJSONToGame,
    simpleContent: simpleContent,

    getCardinalNumber: getCardinalNumber,
    getOrdinalNumber: getOrdinalNumber,
    getUserQDisplay: getUserQDisplay,
    getFudgeDisplay: getFudgeDisplay,

    DendryEngine: DendryEngine,
    UserInterface: UserInterface,
    NullUserInterface: UserInterface,

    Random: Random
  };
}());

},{}],2:[function(require,module,exports){
/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function($) {
  'use strict';

  var contentToHTML = require('./content/html');
  var engine = require('../engine');

  var BrowserUserInterface = function(game, $content) {
    this.game = game;
    this.$content = $content;
    this._registerEvents();

    this.dendryEngine = new engine.DendryEngine(this, game);
    // TODO: refactor how the settings work - move it all within a single object
    this.base_settings = {'disable_bg': false, 'animate':false, 'animate_bg': true, 'disable_audio': false, 'show_portraits': true};
    this.disable_bg = false;
    this.animate = false;
    this.animate_bg = true;
    this.disable_audio = false;
    // backgrounds and portraits are 100% optional, and most games will not use them.
    this.show_portraits = true;
    this.fade_time = 600;
    this.bg_fade_out_time = 200;
    this.bg_fade_in_time = 1000;
    this.sound_fade_time = 2000;
    this.contentToHTML = contentToHTML;

    // sprites
    this.spriteLocs = {'topLeft': 1, 'topRight': 1, 'bottomLeft': 1, 'bottomRight': 1};
    // current HTMLAudioElement
    this.currentAudio = null;
    // current audio url
    this.currentAudioURL = '';
    this.audioQueue = [];
    // playlist is used for shuffling...
    this.audioPlaylist = [];
    // flag for determining if we're on a new page, up until the first choice.
    this.onNewPage = false;

    // for saving
    this.save_prefix = game.title + '_' + game.author + '_save';
    this.max_slots = 8; // max save slots
    this.DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric', 
                 month: 'short', 
                 day: 'numeric' };
  };
  engine.UserInterface.makeParentOf(BrowserUserInterface);

  // ------------------------------------------------------------------------
  // Main API

  //load a game as a json file from a url, and then run the game...
  BrowserUserInterface.prototype.loadGame = function(url) {
      var that = this;
      if (!url.endsWith('.json')) { 
          if (url.endsWith('/')) { 
              url = url + 'game.json';
          } else { 
              url = url + '/game.json';
          } 
      } 
      fetch(url)
      .then(response => response.text())
      .then(json => { 
          game = engine.convertJSONToGame(json, function(err, game) {
              if (err) {
                throw err;
              }
              return game;
          });
          that.game = game;
          that.dendryEngine = new engine.DendryEngine(that, game);
          that.dendryEngine.beginGame();
      })
      .catch(err => console.log(err));
  };


  BrowserUserInterface.prototype.displayContent = function(paragraphs, faceImage) {
    var $html = $(contentToHTML.convert(paragraphs));
    // TODO: maybe face image visibility should be controlled by a different setting?
    var hasImage = false;
    if (faceImage && this.show_portraits && !this.disable_bg) {
        hasImage = true;
        // convert faceImage into an html object
        console.log(faceImage);
        //var cardEl = $('<div>').addClass('face-figure');
        var cardEl = document.createElement('div');
        cardEl.className = "face-figure";
        //var $image = $('<img>').addClass('face-img').attr({src : faceImage});
        var image = new Image();
        image.className = "face-img";
        cardEl.appendChild(image);
        $html.splice(1, 0, cardEl);
        image.src = faceImage;
        /*
        if (!this.animate) {
            var that = this;
            image.onload = function() {
                that.$content.append($html);
                console.log('image loaded');
            };
            image.src = faceImage;
        }
        */
    }
    if (this.animate) {
        $html.fadeIn(this.fade_time);
        this.$content.append($html);
    } else {
        if (!hasImage) {
            this.$content.append($html);
        } else {
            this.$content.append($html);
        }
    }
    $html.focus();
    // allow user to add custom stuff on display content (for sidebar in this case)
    if (window && window.onDisplayContent) {
        window.onDisplayContent();
    }
  };

  BrowserUserInterface.prototype.displayGameOver = function() {
    var $p = $('<p>').text(this.getGameOverMsg()).addClass('game-over');
    if (this.animate) {
        $p.fadeIn(this.fade_time);
        this.$content.append($p);
    } else {
        this.$content.append($p);
    }
    $p.focus();
  };

  BrowserUserInterface.prototype.displayChoices = function(choices) {
    var $ul = $('<ul>').addClass('choices');
    for (var i = 0; i < choices.length; ++i) {
      var choice = choices[i];

      var title = contentToHTML.convertLine(choice.title);
      var subtitle = "";
      if (choice.subtitle !== undefined) {
        subtitle = contentToHTML.convertLine(choice.subtitle);
      }

      var $li = $('<li>');
      var $titleHolder = $li;
      if (choice.canChoose) {
        $titleHolder = $('<a>').attr({href: '#', 'data-choice': i});
        $li.html($titleHolder);
      } else {
        $titleHolder.addClass('unavailable');
      }
      $titleHolder.html(title);
      if (choice.checkQuality && choice.difficulty && choice.successProb !== undefined) {
        if (subtitle) {
          subtitle += '<br>';
        }
        subtitle += 'Check: ' + choice.checkQuality + '<br>';
        subtitle += 'Difficulty: ' + choice.difficulty + ' (' + Math.floor(choice.successProb*100) + '%)';
      }
      if (subtitle) {
        $li.append($('<div>').addClass('subtitle').html(subtitle));
      }

      $ul.append($li);
    }
    if (this.animate) {
        $ul.fadeIn(this.fade_time);
        this.$content.append($ul);
    }
    else {
        this.$content.append($ul);
    }
    $ul.focus();
    if (this.onNewPage) {
      this.onNewPage = false;
      if (window && window.onNewPage) {
        window.onNewPage();
      }
    }
  };

  BrowserUserInterface.prototype.newPage = function() {
    if (this.animate) {
        var $content = this.$content;
        this.$content.empty();
        this.$content.children().fadeOut(this.fade_time, function() {
        });
    } else {
        this.$content.empty();
    }
    this.onNewPage = true;

  };

  BrowserUserInterface.prototype.setStyle = function(style) {
    this.$content.removeClass();
    if (style !== undefined) {
      this.$content.addClass(style);
    }
  };

  BrowserUserInterface.prototype.removeChoices = function() {
    $('.choices', this.$content).remove();
    $('.hidden', this.$content).remove();
  };

  BrowserUserInterface.prototype.beginOutput = function() {
    $("#read-marker", this.$content).remove();
    this.$content.append($('<hr>').attr('id', 'read-marker'));
  };

  BrowserUserInterface.prototype.endOutput = function() {
    var $marker = $("#read-marker");
    if (this.animate) {
        if ($marker.length > 0) {
          $('html, body').animate({scrollTop: $marker.offset().top}, this.fade_time);
        } else {
          $('html, body').animate({scrollTop: 0}, this.fade_time);
        }
    }
  };

  BrowserUserInterface.prototype.signal = function(data) {
    // TODO: implement signals - signals contain signal, event, and id
    console.log(data);
    var signal = data.signal;
    var event = data.event; // scene-arrival, scene-display, scene-departure, quality-change
    var scene_id = data.id;
    // TODO: handle this in the game.js for each specific game
    if (window && window.handleSignal) {
        window.handleSignal(signal, event, scene_id);
    }
  };

  // dendrynexus displays
  // displays the hand.
  BrowserUserInterface.prototype.displayHand = function(hand, maxCards) {
    if (window && window.displayHand) {
      window.displayHand(hand, maxCards);
      return null;
    }
    var handDescription = 'Hand - click a card to play.';
    if (window.handDescription) {
      handDescription = window.handDescription;
    }
    if (this.dendryEngine.state.qualities.handDescription) {
      handDescription = this.dendryEngine.state.qualities.handDescription;
    }
    var $handEl = $('.hand');
    var hasOldHand = false;
    if ($handEl.length == 0) {
        $handEl = $('<ul>').addClass('hand');
        this.$content.append($('<hr>'));
        this.$content.append($('<p>').addClass('hand-description').text(handDescription));
    } else {
        $handEl.empty();
        hasOldHand = true;
    }
    // display the hand
    for (var i = 0; i < maxCards; i++) {
      var $cardEl = $('<li>').addClass('card-in-hand');
      if (hand[i]) {
        var card = hand[i];
        // create an <a> element, with an image nested inside.
        var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
        var $title = $('<span>').addClass('card-caption').text(card.title);
        // if there is an image, set the image; otherwise, set image to a gradient?
        if (card.image) {
          var $cardImage = $('<img>').addClass('card-img').attr({src: card.image});
          $cardLink.append($cardImage);
        } else {
        }
        if (card.subtitle) {
          var $cardSubtitle = $('<span>').addClass('card-tooltip').text(card.subtitle);
          $cardLink.append($cardSubtitle);
        }
        $cardEl.append($cardLink);
        $cardEl.append($title);
        $handEl.append($cardEl);
      } else {
        var $blankCardDiv = $('<div>').addClass('blank-card');
        $cardEl.append($blankCardDiv);
      }
      $handEl.append($cardEl);
    }
    if (!hasOldHand) {
        this.$content.append($handEl);
    }
  };


  BrowserUserInterface.prototype.displayDecks = function(decks) {
    if (window && window.displayDecks) {
      window.displayDecks(decks);
      return null;
    }
    var deckDescription = 'Decks - click a deck to draw a card.';
    if (window.deckDescription) {
      deckDescription = window.deckDescription;
    }
    if (this.dendryEngine.state.qualities.deckDescription) {
      deckDescription = this.dendryEngine.state.qualities.deckDescription;
    }
    this.$content.append($('<hr>'));
    this.$content.append($('<p>').addClass('deck-description').text(deckDescription));
    var $decksEl = $('<ul>').addClass('decks');
    for (var deck of decks) {
      var $deckEl = $('<li>').addClass('deck');
      // create an <a> element, with an image nested inside.
      var $deckLink = $('<a>').addClass('card').attr({href: '#', 'card-id': deck.id, title: deck.title});
      var $title = $('<span>').addClass('card-caption').text(deck.title);
      // if there is an image, set the image; otherwise, set image to a gradient?
      if (deck.image) {
        var $deckImage = $('<img>').addClass('card-img').attr({src: deck.image});
        $deckLink.append($deckImage);
      } else {
        // TODO: set alternative background for $deckLink to a gradient
      }
      if (deck.subtitle) {
        // if there's a subtitle, create a tooltip
        var $deckSubtitle = $('<span>').addClass('card-tooltip').text(deck.subtitle);
        $deckLink.append($deckSubtitle);
      }
      if (!deck.canChoose) {
        $deckEl = $deckEl.addClass('unavailable-card');
      }
      $deckEl.append($deckLink);
      $deckEl.append($title);
      $decksEl.append($deckEl);
    }
    this.$content.append($decksEl);
  };

  // displays pinned cards for dendrynexus
  BrowserUserInterface.prototype.displayPinnedCards = function(cards) {
    if (cards.length == 0) {
      return null;
    }
    if (window && window.displayPinnedCards) {
      window.displayPinnedCards(cards);
      return null;
    }
    var pinnedCardsDescription = 'Pinned cards - click a card to play.';
    if (window.pinnedCardsDescription) {
      pinnedCardsDescription = window.pinnedCardsDescription;
    }
    if (this.dendryEngine.state.qualities.pinnedCardsDescription) {
      pinnedCardsDescription = this.dendryEngine.state.qualities.pinnedCardsDescription;
    }
    this.$content.append($('<hr>'));
    this.$content.append($('<p>').addClass('pinned-text-description').text(pinnedCardsDescription));
    var $cardsEl = $('<ul>').addClass('pinned-cards');
    for (var card of cards) {
      var $cardEl = $('<li>').addClass('pinned-card');
      // create an <a> element, with an image nested inside.
      var $cardLink = $('<a>').addClass('card').attr({href: '#', 'card-id': card.id, title: card.title});
      var $title = $('<span>').addClass('card-caption').text(card.title);
      // if there is an image, set the image; otherwise, set image to a gradient?
      if (card.image) {
        var $cardImage = $('<img>').addClass('card-img').attr({src: card.image});
        $cardLink.append($cardImage);
      } else {
      }
      if (card.subtitle) {
        var $cardSubtitle = $('<span>').addClass('card-tooltip').text(card.subtitle);
        $cardLink.append($cardSubtitle);
      }
      $cardEl.append($cardLink);
      $cardEl.append($title);
      $cardsEl.append($cardEl);
    }
    this.$content.append($cardsEl);
  };

  // visual extensions

  BrowserUserInterface.prototype.setBg = function(image_url) {
      if (this.disable_bg) {
            $('#bg1').addClass('content_hidden');
            $('#bg1').removeClass('content_visible');
            $('#bg1').css('background-image', 'none'); 
      }
      else if (!image_url || image_url == 'none' || image_url == 'null') {
          if (this.animate_bg) {
            $('#bg1').addClass('content_hidden');
            $('#bg1').removeClass('content_visible');
            setTimeout(function() {
                $('#bg1').css('background-image', 'none'); 
                $('#bg1').removeClass('content_hidden');
                $('#bg1').addClass('content_visible');
            },
            100);
          } else {
              $('#bg1').css('background-image', 'none'); 
          }
      } else if (image_url.startsWith('#') || image_url.startsWith('rgba(') || image_url.startsWith('rgb(')) {
          if (this.animate_bg) {
            $('#bg1').fadeOut(this.bg_fade_out_time, function() {
                $('#bg1').css('background-image', 'none'); 
                $('#bg1').css('background-color', image_url);
            });
            $('#bg1').fadeIn(this.bg_fade_in_time, function() {
                $('#bg2').css('background-image', 'none'); 
            });
            console.log('changing background color ' + image_url);
          } else {
              $('#bg1').css('background-image', 'none'); 
              $('#bg1').css('bacground-color', image_url);
          }
      } else if (image_url.startsWith('linear-gradient(')) {
          if (this.animate_bg) {
            $('#bg1').fadeOut(this.bg_fade_out_time, function() {
                $('#bg1').css('background-image', image_url); 
            });
            $('#bg1').fadeIn(this.bg_fade_in_time, function() {
                $('#bg2').css('background-image', image_url); 
            });
            console.log('changing background gradient ' + image_url);
          } else {
              $('#bg1').css('background-image', image_url); 
          }
      } else {
          if (this.animate_bg) {
            $('#bg1').fadeOut(this.bg_fade_out_time, function() {
                $('#bg1').css('background-image', 'url("' + image_url + '")'); 
            });
            $('#bg1').fadeIn(this.bg_fade_in_time, function() {
                $('#bg2').css('background-image', $('#bg1').css('background-image'));
            });
      } else {
          $('#bg1').css('background-image', 'url("' + image_url + '")'); 
      }
    }
  };

  // set sprites given data
  // data is a list of two-element lists, where the first element is location
  // (one of topLeft, topRight, bottomLeft, bottomRight)
  // and the second element is the sprite.
  BrowserUserInterface.prototype.setSprites = function(data) {
      if (window && window.setSprites) {
          window.setSprites(data);
          return;
      }
      if (!this.show_portraits || data == 'none' || data == 'clear') {
          $('#topLeftSprite').children().fadeOut(this.fade_time, function() {$('#topLeftSprite').empty();});
          $('#topRightSprite').children().fadeOut(this.fade_time, function() {$('#topRightSprite').empty();});
          $('#bottomLeftSprite').children().fadeOut(this.fade_time, function() {$('#bottomLeftSprite').empty();});
          $('#bottomRightSprite').children().fadeOut(this.fade_time, function() {$('#bottomRightSprite').empty();});
          return;
      } else {
          if (data instanceof Array) {
              for (var i = 0; i < data.length; i++) {
                  var loc = data[i][0];
                  var img = data[i][1];
                  this.setSprite(loc, img);
              }
          } else if (data) {
                for (var key in Object.keys(data)) {
                  sprites.push([key, data[key]]);
              }
          }
      }
  };

  BrowserUserInterface.prototype.setSprite = function(loc, img) {
      if (!this.show_portraits) {
          return;
      }
      if (window && window.setSprite) {
          window.setSprite(loc, img);
          return;
      }
      loc = loc.toLowerCase();
      var targetSprite;
      if (loc == 'topleft') {
          targetSprite = $('#topLeftSprite');
      } else if (loc == 'topright') {
          targetSprite = $('#topRightSprite');
      } else if (loc == 'bottomleft') {
          targetSprite = $('#bottomLeftSprite');
      } else if (loc == 'bottomright') {
          targetSprite = $('#bottomRightSprite');
      }
      //targetSprite.empty();
      if (img == 'none' || img == 'clear') {
          delete this.dendryEngine.state.sprites[loc];
          targetSprite.fadeOut(this.fade_time, function() {targetSprite.empty();});
          return;
      } else {
          this.dendryEngine.state.sprites[loc] = img;
          targetSprite.fadeOut(this.fade_time, function() {
              targetSprite.emtpy();
              var image = new Image();
              image.src = img;
              targetSprite.append(image);
              console.log('fadeIn');
              targetSprite.fadeIn(this.fade_time);
          });
      }
  };

  BrowserUserInterface.prototype.setSpriteStyle = function(loc, style) {
      if (window && window.setSpriteStyle) {
          window.setSpriteStyle(loc, style);
          return;
      }
      var targetSprite;
      if (loc == 'topleft') {
          targetSprite = $('#topLeftSprite');
      } else if (loc == 'topright') {
          targetSprite = $('#topRightSprite');
      } else if (loc == 'bottomleft') {
          targetSprite = $('#bottomLeftSprite');
      } else if (loc == 'bottomright') {
          targetSprite = $('#bottomRightSprite');
      } else {
          return;
      }
      targetSprite.css(style);
  };

  // play audio with js
  // audio is a space-separated string with at least one entry.
  // the first entry will be a file url.
  // the second-nth entries are words describing how the file will be played:
  // 'queue' for playing the music next after the current audio ends
  // 'loop' if this music will loop indefinitely.
  // 'nofade' if the sound will be played instantly without a fadein or fadeout.
  // TODO: have a list of audio files...
  BrowserUserInterface.prototype.audio = function(audio) {
      if (this.disable_audio) {
          if (this.currentAudio) {
              this.currentAudio.pause();
              this.currentAudio.loop = false;
          }
          return;
      }
      var audioData = audio.split(' ');
      var audioFiles = [];
      var isLoop = false;
      var isQueue = false;
      var noFade = false;
      var isShuffle = false;
      var isClear = false;
      for (var name of audioData) {
          if (name == 'loop') {
              isLoop = true;
          } else if (name == 'queue') {
              isQueue = true;
          } else if (name == 'nofade') {
              noFade = true;
          } else if (name == 'shuffle') {
              isShuffle = true;
          } else if (name == 'clear') {
              isClear = true;
          } else {
              audioFiles.push(name);
          }
      }
      if (isClear) {
          this.audioPlaylist = [];
      }
      if (audioFiles.length >= 1 || isShuffle) {
          this.audioPlaylist = this.audioPlaylist.concat(audioFiles);
      }
      var audioFile = audioFiles[0];
      var currentAudio = this.currentAudio;
      var fadeTime = this.sound_fade_time;
      var loopCurrent = false;
      var playlist = this.audioPlaylist;
      // stop playing
      if (audioFile == 'null' || audioFile == 'none') {
          if (this.currentAudio) {
              $(currentAudio).animate({volume: 0},
                  this.sound_fade_time,
                  function() {
                      currentAudio.pause();
              });
              this.currentAudio.loop = false;
          }
      } else {
          // fadeout current audio, then fade-in new audio
          console.log('new audio:', audioFile, 'current audio:',  this.currentAudioURL);
          if (this.currentAudio && (this.currentAudioURL == audioFile || isQueue || isShuffle)) {
              if (!currentAudio.ended && !currentAudio.paused) {
                  console.log('adding music to queue');
                  this.audioQueue.push(audioFile);
                  var audioQueue = this.audioQueue;
                  this.currentAudio.onended = function() {
                      var newAudio;
                      if (isQueue) {
                          newAudio = audioQueue.pop();
                          console.log('playing from queue');
                      } else if (isShuffle) {
                          var index = Math.floor(Math.random()*playlist.length);
                          newAudio = playlist[index];
                          console.log('playing from playlist');
                      }
                      if (newAudio) {
                          currentAudio.src = newAudio;
                          console.log('Now playing', newAudio);
                          currentAudio.play();
                          $(currentAudio).animate({volume: 1},
                              fadeTime);
                          window.dendryUI.currentAudioURL = newAudio;
                      }
                  };
              } else {
                  this.currentAudioURL = audioFile;
                  currentAudio.src = audioFile;
                  console.log('Fading in new audio');
                  currentAudio.volume = 0;
                  currentAudio.play();
                  $(currentAudio).animate({volume: 1},
                      fadeTime);
                  this.currentAudio.onended = function() {
                      var newAudio;
                      if (isQueue) {
                          newAudio = audioQueue.pop();
                          console.log('playing from queue');
                      } else if (isShuffle) {
                          var index = Math.floor(Math.random()*playlist.length);
                          newAudio = playlist[index];
                          console.log('playing from playlist');
                      }
                      if (newAudio) {
                          currentAudio.src = newAudio;
                          console.log('Now playing', newAudio);
                          currentAudio.play();
                          $(currentAudio).animate({volume: 1},
                              fadeTime);
                          window.dendryUI.currentAudioURL = newAudio;
                      }
                  };
              }
          } else if (this.currentAudio) {
              // not queue or shuffle, so we stop playing the current audio.
              this.currentAudioURL = audioFile;
              console.log('currentAudio present,  fading out current audio');
              // reset the current audio function
              currentAudio.onended = function() {};
              if (noFade) {
                  currentAudio.pause();
                  currentAudio.src = audioFile;
                  currentAudio.play();
              } else {
                  $(currentAudio).animate({volume: 0},
                      this.sound_fade_time,
                      function() {
                          console.log(currentAudio);
                          currentAudio.src = audioFile;
                          console.log('Fading in new audio');
                          currentAudio.play();
                          $(currentAudio).animate({volume: 1},
                              fadeTime);
                  });
              }
          } else if (!this.currentAudio) {
              this.currentAudio = new Audio(audioFile);
              this.currentAudio.volume = 0;
              this.currentAudio.play();
              $(this.currentAudio).animate({volume: 1}, this.sound_fade_time);
              currentAudio = this.currentAudio;
              if (isShuffle) {
                  this.currentAudio.onended = function() {
                    var index = Math.floor(Math.random()*playlist.length);
                    var newAudio = playlist[index];
                    if (newAudio) {
                       currentAudio.src = newAudio;
                       console.log('playing from shuffle');
                       console.log('Now playing', newAudio);
                       currentAudio.play();
                       $(currentAudio).animate({volume: 1},
                              fadeTime);
                          // asdkfl;;sajd;lkjafdsdsaf;kjldjsfa;kl
                       window.dendryUI.currentAudioURL = newAudio;
                    }
                  };
              }
          }
          if (isLoop) {
              this.currentAudio.loop = true;
          } else {
              this.currentAudio.loop = false;
          }
          // https://stackoverflow.com/questions/7451508/html5-audio-playback-with-fade-in-and-fade-out
      }
  };

  BrowserUserInterface.prototype.saveSettings = function() {
    if (typeof localStorage !== 'undefined') {
        localStorage[this.game.title + '_animate'] = this.animate;
        localStorage[this.game.title + '_disable_bg'] = this.disable_bg;
        localStorage[this.game.title + '_animate_bg'] = this.animate_bg;
        localStorage[this.game.title + '_show_portraits'] = this.show_portraits;
        localStorage[this.game.title + '_disable_audio'] = this.disable_audio;
    }
  };

  // TODO: this could be much cleaner...
  BrowserUserInterface.prototype.loadSettings = function(defaultSettings) {
    var defaults = {animate: false, disable_bg: false, animate_bg: true, 
                    show_portraits: true, disable_audio: false};
    if (typeof localStorage !== 'undefined') {
        for (var prop in defaults) {
            if (defaults.hasOwnProperty(prop)) {
                var lsKey = this.game.title + '_' + prop;
                if (lsKey in localStorage) {
                    this[prop] = localStorage[lsKey] != 'false';
                } else {
                    if (defaultSettings && defaultSettings.hasOwnProperty(prop)) {
                        this[prop] = defaultSettings[prop];
                    } else {
                        this[prop] = defaults[prop];
                    }
                }
            }
        }
    }
  };

  BrowserUserInterface.prototype.toggle_audio = function(enable_audio) {
      if (enable_audio) {
          this.disable_audio = false;
          if (this.currentAudio) {
              this.currentAudio.play();
          }
      } else {
          if (this.currentAudio) {
              this.currentAudio.pause();
              this.currentAudio.loop = false;
          }
          this.disable_audio = true;
      }
  };


  // save functions
  BrowserUserInterface.prototype.autosave = function() {
      var oldData = localStorage[this.save_prefix+'_a0'];
      if (oldData) {
          localStorage[this.save_prefix+'_a1'] = oldData;
          localStorage[this.save_prefix+'_timestamp_a1'] = localStorage[this.save_prefix+'_timestamp_a0'];
      }
      var slot = 'a0';
      var saveString = JSON.stringify(this.dendryEngine.getExportableState());
      localStorage[this.save_prefix + '_' + slot] = saveString;
      var scene = this.dendryEngine.state.sceneId;
      var date = new Date(Date.now());
      date = scene + '\n(' + date.toLocaleString(undefined, this.DateOptions) + ')';
      localStorage[this.save_prefix +'_timestamp_' + slot] = date;
      this.populateSaveSlots(slot + 1, 2);
  };

  BrowserUserInterface.prototype.quickSave = function() {
    var saveString = JSON.stringify(this.dendryEngine.getExportableState());
    localStorage[this.save_prefix + '_q'] = saveString;
    window.alert('Saved.');
  };

  BrowserUserInterface.prototype.saveSlot = function(slot) {
    var saveString = JSON.stringify(this.dendryEngine.getExportableState());
    localStorage[this.save_prefix + '_' + slot] = saveString;
    var scene = this.dendryEngine.state.sceneId;
    var date = new Date(Date.now());
    date = scene + '\n(' + date.toLocaleString(undefined, this.DateOptions) + ')';
    localStorage[this.save_prefix + '_timestamp_' + slot] = date;
    this.populateSaveSlots(slot + 1, 2);
  };

  BrowserUserInterface.prototype.quickLoad = function() {
    if (localStorage[this.save_prefix + '_q']) {
      var saveString = localStorage[this.save_prefix + '_q'];
      this.dendryEngine.setState(JSON.parse(saveString));
      window.alert('Loaded.');
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.loadSlot = function(slot) {
    if (localStorage[this.save_prefix + '_' + slot]) {
      var saveString = localStorage[this.save_prefix + '_' + slot];
      this.dendryEngine.setState(JSON.parse(saveString));
      this.hideSaveSlots();
      window.alert('Loaded.');
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.deleteSlot = function(slot) {
    if (localStorage[this.save_prefix + '_' + slot]) {
      localStorage[this.save_prefix + '_' + slot] = '';
      localStorage[this.save_prefix + '_timestamp_' + slot] = '';
      this.populateSaveSlots(slot + 1, 2);
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.exportSlot = function(slot) {
    if (localStorage[this.save_prefix + '_' + slot]) {
      var data = localStorage[this.save_prefix + '_' + slot];
      var a = document.createElement("a");
      var file = new Blob([data], {type: 'text/plain'});
      a.href = URL.createObjectURL(file);
      a.download = 'save.txt';
      a.click();
    } else {
      window.alert('No save available.');
    }
  };

  BrowserUserInterface.prototype.importSave = function(doc_id) {
      var that = this;
      function onFileLoad(e) {
          var data = e.target.result;
          that.dendryEngine.setState(JSON.parse(data));
          that.hideSaveSlots();
          window.alert('Loaded.');
      }
      var uploader = document.getElementById(doc_id);
      var reader = new FileReader();
      var file = uploader.files[0];
      console.log(uploader.files);
      reader.onload = onFileLoad;
      reader.readAsText(file);
  };

  BrowserUserInterface.prototype.populateSaveSlots = function(max_slots, max_auto_slots) {
    // this fills in the save information
    var that = this;
    function createLoadListener(i) {
      return function(evt) {
        that.loadSlot(i);
      };
    }
    function createSaveListener(i) {
      return function(evt) {
        that.saveSlot(i);
      };
    }
    function createDeleteListener(i) {
      return function(evt) {
        that.deleteSlot(i);
      };
    }
    function createExportListener(i) {
      return function(evt) {
        that.exportSlot(i);
      };
    }
      function populateSlot(id) {
          var save_element = document.getElementById('save_info_' + id);
          var save_button = document.getElementById('save_button_' + id);
          var delete_button = document.getElementById('delete_button_' + id);
          if (localStorage[that.save_prefix + '_' + id]) {
              var timestamp = localStorage[that.save_prefix+'_timestamp_' + id];
              save_element.textContent = timestamp;
              save_button.textContent = "Load";
              save_button.onclick = createLoadListener(id);
              delete_button.onclick = createDeleteListener(id);
          } else {
              save_button.textContent = "Save";
              save_element.textContent = "Empty";
              save_button.onclick = createSaveListener(id);
          }
          try {
              var export_button = document.getElementById('export_button_' + id);
              if (localStorage[that.save_prefix + '_' + id]) {
                  export_button.onclick = createExportListener(id);
              }
          } catch(error) {
          }

      }
      for (var i = 0; i < max_slots; i++) {
          populateSlot(i);
      }
      for (i = 0; i < max_auto_slots; i++) {
          populateSlot('a'+i);
      }

  };

  BrowserUserInterface.prototype.showSaveSlots = function() {
    if (this.dendryEngine.state.disableSaves) {
        window.alert('Saving and loading is currently disabled.');
        return;
    }
    var save_element = document.getElementById('save');
    save_element.style.display = 'block';
    this.populateSaveSlots(this.max_slots, 2);
    var that = this;
    if (!save_element.onclick) {
      save_element.onclick = function(evt) {
        var target = evt.target;
        var save_element = document.getElementById('save');
        if (target == save_element) {
          that.hideSaveSlots();
        }
      };
    }
  };

  BrowserUserInterface.prototype.hideSaveSlots = function() {
    var save_element = document.getElementById('save');
    save_element.style.display = 'none';
  };


  // functions for dealing with options
  BrowserUserInterface.prototype.setOption = function(option, toggle) {
      this[option] = toggle; 
      this.saveSettings();
  };

  BrowserUserInterface.prototype.populateOptions = function() {
    var disable_bg = this.disable_bg;
    var animate = this.animate;
    var animate_bg = this.animate_bg;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (animate_bg) {
        $('#animate_bg_yes')[0].checked = true;
    } else {
        $('#animate_bg_no')[0].checked = true;
    }
  };

  BrowserUserInterface.prototype.showOptions = function() {
      var save_element = document.getElementById('options');
      this.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  this.hideOptions();
              }
          };
      }
  };

  // ------------------------------------------------------------------------
  // Additional methods

  BrowserUserInterface.prototype.getGameOverMsg = function() {
    return 'Game Over (reload to read again)';
  };

  BrowserUserInterface.prototype._registerEvents = function() {
    var that = this;
    this.$content.on('click', 'ul.choices li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = parseInt($(this).attr('data-choice'));
      that.dendryEngine.choose(choice);
      return false;
    });
    this.$content.on('click', 'ul.choices li', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $('a', this).click();
      return false;
    });
    // dendrynexus - onclick for decks and cards
    this.$content.on('click', 'ul.decks li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = $(this).attr('card-id');
      that.dendryEngine.drawCard(choice);
      return false;
    });
    this.$content.on('click', 'ul.hand li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = $(this).attr('card-id');
      that.dendryEngine.playCard(choice);
      return false;
    });
    this.$content.on('click', 'ul.pinned-cards li a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var choice = $(this).attr('card-id');
      that.dendryEngine.playPinnedCard(choice);
      return false;
    });
  };

  // ------------------------------------------------------------------------
  // Run when loaded.

  var main = function() {
    engine.convertJSONToGame(window.game.compiled, function(err, game) {
      if (err) {
        throw err;
      }

      var ui = new BrowserUserInterface(game, $('#content'));
      window.dendryUI = ui;
      // Allow the ui system to be customized before use.
      if (window.dendryModifyUI !== undefined) {
        // If it returns true, then we don't need to begin the game.
        var dontStart = window.dendryModifyUI(ui);
        if (dontStart) {
          return;
        }
      }
      ui.dendryEngine.beginGame();
    });
  };
  $(main);

}(jQuery));

},{"../engine":1,"./content/html":3}],3:[function(require,module,exports){
/* dendry
 * http://github.com/idmillington/dendry
 *
 * MIT License
 */
/*jshint indent:2 */
(function() {
  'use strict';

  var _contentObjectToHTML = function(contentObj) {
    if (contentObj.type === undefined) {
      // if the game defines the function window.displayText, then that function is called to format the text.
      // this is used for game-specific formatting.
      if (typeof(window) !== "undefined" && window.displayText) {
          contentObj = window.displayText(contentObj);
      }
      return contentObj;
    } else {
      switch (contentObj.type) {
      case 'emphasis-1':
        return '<em>' + _contentToHTML(contentObj.content) + '</em>';
      case 'emphasis-2':
        return '<strong>' + _contentToHTML(contentObj.content) + '</strong>';
      case 'emphasis-3':
        return '<code>' + _contentToHTML(contentObj.content) + '</code>';
      case 'hidden':
        return '<span class="hidden">' + _contentToHTML(contentObj.content) +
          '</span>';
      case 'line-break':
        return '<br>';

      // We can't handle elements that require state-dependency.
      // raw html for magic
      case 'magic':
        return contentObj.content;
      case 'insert':
        /* falls through */
      case 'conditional':
        throw new Error(
          contentObj.type + ' should have been evaluated by now.'
          );
      }
    }
  };

  var _contentToHTML = function(content) {
    if (Array.isArray(content)) {
      var result = [];
      for (var i = 0; i < content.length; ++i) {
        var contentObj = content[i];
        result.push(_contentObjectToHTML(contentObj));
      }
      return result.join('');
    } else {
      return _contentObjectToHTML(content);
    }
  };

  var _paragraphsToHTML = function(paragraphs) {
    var result = [];
    for (var i = 0; i < paragraphs.length; ++i) {
      var paragraph = paragraphs[i];
      switch (paragraph.type) {
      case 'heading':
        result.push('<h1>');
        result.push(_contentToHTML(paragraph.content));
        result.push('</h1>');
        break;
      case 'paragraph':
        result.push('<p>');
        result.push(_contentToHTML(paragraph.content));
        result.push('</p>');
        break;
      case 'quotation':
        result.push('<blockquote>');
        result.push(_contentToHTML(paragraph.content));
        result.push('</blockquote>');
        break;
      case 'attribution':
        result.push('<blockquote class="attribution">');
        result.push(_contentToHTML(paragraph.content));
        result.push('</blockquote>');
        break;
      case 'magic':
        result.push(paragraph.content);
        break;
      case 'hrule':
        result.push('<hr>');
        break;
      }
    }
    return result.join('');
  };

  module.exports = {
    convert: _paragraphsToHTML,
    convertLine: _contentToHTML
  };
}());

},{}]},{},[2]);
