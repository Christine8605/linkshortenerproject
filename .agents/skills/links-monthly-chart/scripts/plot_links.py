"""
Generate a bar chart PNG of links created per month for the past 12 months.
Reads DATABASE_URL from .env.local in the current working directory.
Outputs: links-per-month.png in the current working directory.
"""

import os
import sys
from pathlib import Path
from datetime import date

# Load .env.local then .env as fallback
try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=Path(".env.local"))
    if not os.environ.get("DATABASE_URL"):
        load_dotenv(dotenv_path=Path(".env"))
except ImportError:
    pass  # fallback: parse manually

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    # Try parsing .env.local and .env manually
    for env_filename in (".env.local", ".env"):
        env_file = Path(env_filename)
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                line = line.strip()
                if line.startswith("DATABASE_URL="):
                    DATABASE_URL = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
        if DATABASE_URL:
            break

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env.local")
    sys.exit(1)

# Normalize URL scheme for psycopg2
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

import psycopg2
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

today = date.today()

sql = """
WITH months AS (
    SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
    ) AS month_start
)
SELECT
    to_char(m.month_start, 'Mon YYYY') AS month_label,
    m.month_start,
    COUNT(l.id) AS link_count
FROM months m
LEFT JOIN links l
    ON date_trunc('month', l.created_at) = m.month_start
GROUP BY m.month_start
ORDER BY m.month_start;
"""

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()
except Exception as e:
    print(f"ERROR: Database query failed: {e}")
    sys.exit(1)

labels = [row[0] for row in rows]
counts = [int(row[2]) for row in rows]

fig, ax = plt.subplots(figsize=(12, 6))
bars = ax.bar(labels, counts, color="#3b82f6", edgecolor="#1d4ed8", linewidth=0.5)

ax.set_title("Links Created Per Month (Last 12 Months)", fontsize=16, fontweight="bold", pad=16)
ax.set_xlabel("Month", fontsize=12, labelpad=8)
ax.set_ylabel("Number of Links", fontsize=12, labelpad=8)

# Integer y-axis ticks
max_count = max(counts) if counts else 1
ax.yaxis.set_major_locator(plt.MaxNLocator(integer=True))
ax.set_ylim(0, max(max_count * 1.15, 1))

ax.tick_params(axis="x", rotation=45)
ax.grid(axis="y", linestyle="--", alpha=0.5)

for bar, count in zip(bars, counts):
    if count > 0:
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + max(max_count * 0.01, 0.05),
            str(count),
            ha="center",
            va="bottom",
            fontsize=9,
        )

plt.tight_layout()
output_path = Path("links-per-month.png")
plt.savefig(output_path, dpi=150)
plt.close()

print(f"Chart saved to: {output_path.resolve()}")
