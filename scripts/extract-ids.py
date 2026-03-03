import json
import os
import glob

# Search for the file
search_paths = [
    "/vercel/share/v0-project/scripts/games_appid.json",
    os.path.join(os.getcwd(), "scripts", "games_appid.json"),
]

# Also search recursively
found = glob.glob("/vercel/**/games_appid.json", recursive=True)
search_paths.extend(found)
found2 = glob.glob("/home/**/games_appid.json", recursive=True)
search_paths.extend(found2)

raw = None
for p in search_paths:
    print(f"Trying: {p} exists: {os.path.exists(p)}")
    if os.path.exists(p):
        with open(p, "r") as f:
            raw = f.read()
        print(f"Found at: {p}")
        break

if not raw:
    # List directories to understand the environment
    for d in ["/vercel", "/home/user", os.getcwd()]:
        if os.path.exists(d):
            print(f"\nContents of {d}:")
            for item in os.listdir(d)[:20]:
                print(f"  {item}")
    exit(1)

games = json.loads(raw)
ids = sorted([g["appid"] for g in games])

lines = [
    f"// {len(ids)} Steam Game IDs - auto-generated",
    f"export const STEAM_GAME_IDS: number[] = [{','.join(str(i) for i in ids)}]",
    "",
    "export function getRandomGameId(): number {",
    "  const index = Math.floor(Math.random() * STEAM_GAME_IDS.length)",
    "  return STEAM_GAME_IDS[index]",
    "}",
    "",
]

out_paths = [
    "/vercel/share/v0-project/lib/steam-games.ts",
    os.path.join(os.getcwd(), "lib", "steam-games.ts"),
]

for op in out_paths:
    try:
        with open(op, "w") as f:
            f.write("\n".join(lines))
        print(f"Wrote {len(ids)} game IDs to {op}")
        break
    except Exception as e:
        print(f"Could not write to {op}: {e}")
