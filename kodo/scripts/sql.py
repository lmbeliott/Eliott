#!/usr/bin/env python3
"""Exécute un fichier SQL (ou une requête) sur le projet Supabase via l'API de gestion.
Le jeton est injecté par le proxy de l'environnement ; en local, définir SUPABASE_ACCESS_TOKEN.
   python3 scripts/sql.py supabase/migrations/xxx.sql
   python3 scripts/sql.py -q "select 1"
"""
import json, os, sys, urllib.request

REF = os.environ.get("SUPABASE_PROJECT_REF", "bskgiaejgvbjpixijruk")
query = sys.argv[2] if sys.argv[1] == "-q" else open(sys.argv[1], encoding="utf-8").read()
req = urllib.request.Request(
    f"https://api.supabase.com/v1/projects/{REF}/database/query",
    data=json.dumps({"query": query}).encode(),
    headers={"Content-Type": "application/json", "User-Agent": "kodo-scripts",
             **({"Authorization": f"Bearer {os.environ['SUPABASE_ACCESS_TOKEN']}"} if os.environ.get("SUPABASE_ACCESS_TOKEN") else {})},
    method="POST",
)
try:
    with urllib.request.urlopen(req) as r:
        body = r.read().decode()
        try:
            print(json.dumps(json.loads(body), ensure_ascii=False, indent=1)[:20000])
        except ValueError:
            print(body[:20000])
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:4000])
    sys.exit(1)
