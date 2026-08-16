#!/usr/bin/env python3
"""Validate data/diseases.json structure so the app and contributors stay consistent."""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "diseases.json"

REQUIRED = ["id", "name", "category", "overview", "symptoms", "examinations", "treatments", "prevention"]
LIST_FIELDS = ["symptoms", "examinations", "treatments", "prevention"]
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def main() -> int:
    if not DATA.exists():
        print(f"ERROR: {DATA} not found")
        return 1

    try:
        data = json.loads(DATA.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON in {DATA.name}: {exc}")
        return 1

    if not isinstance(data, list) or not data:
        print("ERROR: diseases.json must be a non-empty array")
        return 1

    errors = []
    seen_ids = set()
    seen_names = set()

    for index, item in enumerate(data):
        prefix = f"item[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix}: expected an object")
            continue

        for field in REQUIRED:
            if field not in item:
                errors.append(f"{prefix}: missing required field '{field}'")
                continue
            value = item[field]
            if field in LIST_FIELDS:
                if not isinstance(value, list) or not value:
                    errors.append(f"{prefix}: '{field}' must be a non-empty list")
                else:
                    for i, line in enumerate(value):
                        if not isinstance(line, str) or not line.strip():
                            errors.append(f"{prefix}: '{field}[{i}]' must be a non-empty string")
            elif not isinstance(value, str) or not value.strip():
                errors.append(f"{prefix}: '{field}' must be a non-empty string")

        if not ID_RE.match(str(item.get("id", ""))):
            errors.append(f"{prefix}: id must match {ID_RE.pattern!r}, got {item.get('id')!r}")
        elif item["id"] in seen_ids:
            errors.append(f"{prefix}: duplicate id {item['id']!r}")
        seen_ids.add(item.get("id"))

        name = item.get("name")
        if name in seen_names:
            errors.append(f"{prefix}: duplicate name {name!r}")
        seen_names.add(name)

        aliases = item.get("aliases", [])
        if not isinstance(aliases, list) or any(not isinstance(a, str) or not a.strip() for a in aliases):
            errors.append(f"{prefix}: 'aliases' must be a list of non-empty strings")

    if errors:
        print(f"FAILED with {len(errors)} issue(s):")
        for err in errors:
            print(f"  - {err}")
        return 1

    print(f"OK: {len(data)} disease entries validated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
