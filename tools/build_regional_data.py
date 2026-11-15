#!/usr/bin/env python3
"""Build out/html/spain/regional_data.js from official regional election results.

Source: https://github.com/rricote/histEleccionesAutonomicas (official
results by province and municipality for every autonomous community).  Only
the numbers are extracted.

Usage:
    git clone --depth 1 https://github.com/rricote/histEleccionesAutonomicas /tmp/hea
    python3 tools/build_regional_data.py /tmp/hea/data

Communities that elect by island or by sub-provincial district (Balearic
Islands, Canary Islands, Asturias) are rebuilt from municipality results
using DISTRICT_MUNICIPALITIES below.  Murcia's five pre-2019 districts are
not rebuilt (the game starts after the 2015 election and Murcia used a
single district from 2019).
"""
import json
import re
import sys
from pathlib import Path

SOURCE_URL = "https://github.com/rricote/histEleccionesAutonomicas"
SOURCE_COMMIT = "4059a2a97950d8a2f2c7636b31859f66cba4194f"
FIRST, LAST = "2011-01-01", "2023-12-31"

# Source folder -> region name used by the game (matches election_data.js).
REGIONS = {
    "andalucia": "Andalucía", "aragon": "Aragón", "asturias": "Asturias",
    "baleares": "Baleares", "canarias": "Canarias", "cantabria": "Cantabria",
    "castilla-la-mancha": "Castilla-La Mancha", "castilla-y-leon": "Castilla y León",
    "cataluna": "Cataluña", "comunidad-valenciana": "Comunidad Valenciana",
    "extremadura": "Extremadura", "galicia": "Galicia", "la-rioja": "La Rioja",
    "madrid": "Madrid", "murcia": "Región de Murcia", "navarra": "Navarra",
    "pais-vasco": "País Vasco",
}

# Ballot label -> game party id (labels not listed keep "x:" + label).
PARTY_MAP = {
    "PSOE": "psoe", "PP": "pp", "Cs": "cs", "Vox": "vox",
    "Podemos": "up", "UP": "up", "Comuns": "up", "ICV-EUiA": "up",
    "IU": "iu", "MM": "mp", "MP": "mp",
    "ERC": "erc", "CUP": "cup", "CiU": "junts", "Junts": "junts", "JxSí": "jxsi",
    "PNV": "pnv", "EH Bildu": "bildu", "GBai": "geroa", "NaBai": "geroa",
    "UPN": "upn", "NA+": "upn", "BNG": "bng",
    "CCa": "cc", "AHI-CC": "cc", "AHI-CCa": "cc", "NCa": "nc", "ASG": "asg", "AHI": "ahi",
    "PRC": "prc", "PAR": "par", "CHA": "cha", "FORO": "foro", "Compromís": "compromis",
    "Més": "mes", "PSM": "mes", "El Pi": "elpi", "MxMe": "mxme",
    "UPL": "upl", "XAV": "xav", "SY": "sy", "TE": "te", "UPyD": "upyd",
    "PorA": "up", "AA": "aa",
}

# Municipality name -> district, for island/sub-provincial districts.
ISLANDS_BALEARES = {
    "Menorca": ["Alaior", "Ciutadella de Menorca", "Ferreries", "Maó-Mahón", "Es Mercadal",
                "Sant Lluís", "Es Castell", "Es Migjorn Gran"],
    "Eivissa": ["Eivissa", "Sant Antoni de Portmany", "Sant Josep de sa Talaia",
                "Sant Joan de Labritja", "Santa Eulària des Riu"],
    "Formentera": ["Formentera"],
}
ISLANDS_CANARIAS = {
    "Lanzarote": ["Arrecife", "Haría", "San Bartolomé", "Teguise", "Tías", "Tinajo", "Yaiza"],
    "Fuerteventura": ["Antigua", "Betancuria", "La Oliva", "Pájara", "Puerto del Rosario",
                      "Tuineje"],
    "La Palma": ["Barlovento", "Breña Alta", "Breña Baja", "Fuencaliente de la Palma",
                 "Garafía", "Los Llanos de Aridane", "El Paso", "Puntagorda", "Puntallana",
                 "San Andrés y Sauces", "Santa Cruz de la Palma", "Tazacorte", "Tijarafe",
                 "Villa de Mazo"],
    "La Gomera": ["Agulo", "Alajeró", "Hermigua", "San Sebastián de la Gomera",
                  "Valle Gran Rey", "Vallehermoso"],
    "El Hierro": ["Frontera", "Valverde", "El Pinar de El Hierro"],
}
DISTRICTS_ASTURIAS = {
    "Occidental": ["Allande", "Boal", "Cangas del Narcea", "Castropol", "Coaña", "Cudillero",
                   "Degaña", "El Franco", "Grandas de Salime", "Ibias", "Illano",
                   "Muros de Nalón", "Navia", "Pesoz", "Pravia", "Salas",
                   "San Martín de Oscos", "Santa Eulalia de Oscos", "San Tirso de Abres",
                   "Somiedo", "Soto del Barco", "Tapia de Casariego", "Taramundi", "Tineo",
                   "Valdés", "Vegadeo", "Villanueva de Oscos", "Villayón"],
    "Oriental": ["Amieva", "Cabrales", "Cabranes", "Cangas de Onís", "Caravia", "Colunga",
                 "Llanes", "Nava", "Onís", "Parres", "Peñamellera Alta", "Peñamellera Baja",
                 "Piloña", "Ponga", "Ribadedeva", "Ribadesella", "Villaviciosa"],
}
DISTRICT_MUNICIPALITIES = {
    "baleares": (ISLANDS_BALEARES, "Mallorca"),
    "canarias": (ISLANDS_CANARIAS, None),  # default by province code below
    "asturias": (DISTRICTS_ASTURIAS, "Central"),
}
CANARIAS_DEFAULT = {"35": "Gran Canaria", "38": "Tenerife"}


# Corrections where the source disagrees with the official result.
CORRECTIONS = {
    # Source lists Badajoz with 35 seats; the Asamblea has 65 (Badajoz 36).
    ("Extremadura", "2023-05-28"): {
        "district_seats": {"Badajoz": 36},
        "seats": {"psoe": 28, "pp": 28, "vox": 5, "up": 4},
    },
}


def load(path):
    text = Path(path).read_text(encoding="utf-8")
    return json.loads(text[text.index("]=") + 2:].rstrip().rstrip(";"))


def party_id(label):
    return PARTY_MAP.get(label, "x:" + label)


CLASHES = set()


def lists_from(votes, names):
    """Ballot lists, largest first. If two labels map to the same party id
    in one district, the smaller list keeps its own "x:" id."""
    out = []
    used = set()
    for idx, n in sorted(votes.items(), key=lambda kv: -kv[1]):
        label = names[int(idx)]
        pid = party_id(label)
        if pid in used:
            CLASHES.add((pid, label))
            pid = "x:" + label
        used.add(pid)
        out.append([pid, label, n])
    return out


def municipality_districts(folder, election, names):
    mapping, default = DISTRICT_MUNICIPALITIES[folder]
    lookup = {m: d for d, ms in mapping.items() for m in ms}
    districts = {}
    found = set()
    for mun in election["mun"]:
        prov_code, _, name, _, _, blank, _, flat = mun
        if name in lookup:
            d = lookup[name]
            found.add(name)
        elif default:
            d = default
        else:
            d = CANARIAS_DEFAULT[prov_code]
        dist = districts.setdefault(d, {"blank": 0, "votes": {}})
        dist["blank"] += blank
        for i in range(0, len(flat), 2):
            dist["votes"][str(flat[i])] = dist["votes"].get(str(flat[i]), 0) + flat[i + 1]
    missing = set(lookup) - found
    assert not missing, f"{folder}: municipalities not found: {sorted(missing)}"
    return {
        d: {"blank": v["blank"], "lists": lists_from(v["votes"], names)}
        for d, v in sorted(districts.items())
    }


def main(data_dir):
    data_dir = Path(data_dir)
    out = {
        "source": {
            "description": "Official regional election results, via histEleccionesAutonomicas",
            "url": SOURCE_URL, "commit": SOURCE_COMMIT,
        },
        "regions": {},
    }
    for folder, region in REGIONS.items():
        names = [p[0] for p in load(data_dir / folder / "parties.json.js")["parties"]]
        elections = {}
        for f in sorted((data_dir / folder).glob("*.json.js")):
            date = f.name[:10]
            if not re.match(r"\d{4}-\d{2}-\d{2}$", date) or not FIRST <= date <= LAST:
                continue
            e = load(f)
            if folder in DISTRICT_MUNICIPALITIES:
                districts = municipality_districts(folder, e, names)
            else:
                districts = {}
                for prov in e["prov"]:
                    districts[prov["n"]] = {
                        "seats": sum(prov.get("s", {}).values()),
                        "blank": prov["bl"],
                        "lists": lists_from(prov["v"], names),
                    }
            seats = {}
            for idx, n in e["s"].items():
                pid = party_id(names[int(idx)])
                seats[pid] = seats.get(pid, 0) + n
            fix = CORRECTIONS.get((region, date))
            if fix:
                for d, n in fix.get("district_seats", {}).items():
                    districts[d]["seats"] = n
                seats = fix.get("seats", seats)
            elections[date] = {"districts": districts, "seats": seats}
        out["regions"][region] = elections

    target = Path(__file__).resolve().parent.parent / "out" / "html" / "spain" / "regional_data.js"
    body = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    target.write_text(
        "// Generated by tools/build_regional_data.py - do not edit by hand.\n"
        "(function (root) {\n"
        "  var DATA = " + body + ";\n"
        "  if (typeof module !== 'undefined' && module.exports) { module.exports = DATA; }\n"
        "  else { root.SPAIN_REGIONAL_DATA = DATA; }\n"
        "})(this);\n",
        encoding="utf-8",
    )
    print(f"wrote {target} ({target.stat().st_size // 1024} KiB)")
    for pid, label in sorted(CLASHES):
        print(f"  kept separate: {label!r} (would duplicate {pid})")


if __name__ == "__main__":
    main(sys.argv[1])
