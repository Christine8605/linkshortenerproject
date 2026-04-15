---
name: links-monthly-chart
description: Query the database for all links created in the past 12 months and generate a bar chart PNG showing the count per month. Use this skill whenever the user asks to visualize link creation history, chart links by month, plot link statistics, or generate a monthly links report/chart. Always invoke this skill for any request involving a chart, graph, or visualization of link data over time.
---

# Links Monthly Chart Skill

Generate a bar chart PNG showing links created per month for the past 12 months, using live data from the project's Neon Postgres database.

## Steps

1. **Find the database URL** by reading `.env.local` in the project root. The variable is `DATABASE_URL`.

2. **Install required Python packages** if not already present:

   ```
   pip install psycopg2-binary matplotlib python-dotenv
   ```

3. **Run the plotting script** located at `scripts/plot_links.py` (relative to this skill directory), passing the project root as the working directory:

   ```
   python .agents/skills/links-monthly-chart/scripts/plot_links.py
   ```

   The script auto-reads `.env.local` from the current directory, so run it from the project root.

4. **Output**: The chart is saved as `links-per-month.png` in the current working directory (project root). Report the file path to the user.

## What the script does

- Reads `DATABASE_URL` from `.env.local` in the CWD
- Connects to Neon Postgres using `psycopg2`
- Runs a SQL query grouping `links` by calendar month for the past 12 months (including months with zero links)
- Plots a bar chart with `matplotlib`:
  - X-axis: month labels (e.g., `Apr 2025`, `May 2025`, …, `Apr 2026`)
  - Y-axis: number of links created that month (integer ticks)
  - Bars are filled in a blue color scheme
- Saves the figure as `links-per-month.png` at 150 DPI

## Error handling

- If `DATABASE_URL` is missing from `.env.local`, the script exits with a clear message.
- If the `links` table doesn't exist or the query fails, the error is surfaced verbatim so the user can debug.

## Notes

- The `.env.local` file is never printed or logged — only read into memory to extract the URL.
- Months with no links are still included on the chart (with a bar height of 0).
- The script supports both `postgres://` and `postgresql://` URL schemes.
