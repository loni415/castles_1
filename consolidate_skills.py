import os
import hashlib
import time
import shutil
from pathlib import Path

# Paths
HOME = "/home/mebuntu"
MASTER_DIR = Path(HOME) / ".agents" / "skills"
ARCHIVE_DIR = Path("/mnt/d/Coding/castles_6jun/archive/duplicates_similar_not_exact")
LOG_FILE = Path("/mnt/d/Coding/castles_6jun/archive/consolidation_log.md")

# Ensure archive exists
ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)

def get_md5(path):
    hash_md5 = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def find_skills():
    skills = []
    # Using os.walk for reliability across filesystem
    for root, dirs, files in os.walk(HOME):
        # Prune large/irrelevant dirs
        if any(x in root for x in ["node_modules", ".git", "venv", ".cache", ".local/share"]):
            continue
        
        for file in files:
            if file == "SKILL.md":
                path = Path(root) / file
                try:
                    mtime = path.stat().st_mtime
                    md5 = get_md5(path)
                    name = path.parent.name
                    skills.append({
                        "name": name,
                        "path": str(path),
                        "md5": md5,
                        "mtime": mtime
                    })
                except Exception as e:
                    print(f"Error processing {path}: {e}")
    return skills

def consolidate():
    all_skills = find_skills()
    grouped = {}
    for s in all_skills:
        name = s["name"]
        if name not in grouped:
            grouped[name] = []
        grouped[name].append(s)

    to_purge = []
    to_archive = []
    masters = {}

    log_entries = ["# Skill Consolidation Log\n"]

    for name, versions in grouped.items():
        if len(versions) == 1:
            continue
        
        log_entries.append(f"## Skill: {name}")
        
        # Determine Master (Priority: 1. In ~/.agents/skills, 2. Newest)
        agent_versions = [v for v in versions if MASTER_DIR.as_posix() in v["path"]]
        if agent_versions:
            master = sorted(agent_versions, key=lambda x: x["mtime"], reverse=True)[0]
        else:
            master = sorted(versions, key=lambda x: x["mtime"], reverse=True)[0]
        
        masters[name] = master
        log_entries.append(f"**MASTER**: `{master['path']}` (Hash: {master['md5'][:8]})")

        for v in versions:
            if v["path"] == master["path"]:
                continue
            
            # Exact Duplicate?
            if v["md5"] == master["md5"]:
                to_purge.append(v["path"])
                log_entries.append(f"- [PURGE] Exact duplicate: `{v['path']}`")
            else:
                to_archive.append(v)
                log_entries.append(f"- [MOVE] Similar but not exact: `{v['path']}` (Hash: {v['md5'][:8]})")
        
        log_entries.append("")

    # Execute Moves to Archive
    archive_commands = []
    for v in to_archive:
        dest_name = f"{v['name']}_{v['md5'][:8]}.md"
        dest_path = ARCHIVE_DIR / dest_name
        archive_commands.append(f"cp '{v['path']}' '{dest_path}'")
        # After copy, we can delete the original safely since it's now in the vault
        to_purge.append(v["path"])

    # Final report
    with open(LOG_FILE, "w") as f:
        f.write("\n".join(log_entries))
    
    print(f"Found {len(all_skills)} skills.")
    print(f"To Purge: {len(to_purge)}")
    print(f"To Archive: {len(to_archive)}")
    
    # Generate Shell Script
    with open("cleanup_skills.sh", "w") as f:
        f.write("#!/bin/bash\n")
        f.write("# Archive commands\n")
        for cmd in archive_commands:
            f.write(f"{cmd}\n")
        f.write("\n# Purge commands\n")
        for p in to_purge:
            f.write(f"rm '{p}'\n")

if __name__ == "__main__":
    consolidate()
