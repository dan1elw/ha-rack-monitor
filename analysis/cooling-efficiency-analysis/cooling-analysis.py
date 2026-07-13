import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import pandas as pd

from ha_csv import read_ha_csv, rename_entities, slice_timerange


def plot_temperatures(df: pd.DataFrame) -> None:
    pivoted = df.pivot_table(
        index="last_changed", columns="entity_id", values="state", aggfunc="mean"
    )
    pivoted.columns = [col.split(".")[-1].replace("_", " ") for col in pivoted.columns]
    pivoted = pivoted.interpolate(method="time")

    fig, ax = plt.subplots(figsize=(12, 5))

    x = pivoted.index.to_numpy()
    for col in pivoted.columns:
        ax.plot(x, pivoted[col].to_numpy(), linewidth=1.2, label=col)

    ax.set_xlabel("Time (UTC)")
    ax.set_ylabel("Temperature (°C)")
    ax.set_title("Rack Monitor — Temperature over Time")
    ax.legend(framealpha=0.9)
    ax.grid(True, linestyle="--", linewidth=0.5, alpha=0.7)
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M"))
    ax.xaxis.set_major_locator(mdates.AutoDateLocator())
    fig.autofmt_xdate()

    plt.tight_layout()
    plt.show()


def plot_temperatures_compared(
    df1: pd.DataFrame,
    df2: pd.DataFrame,
    df3: pd.DataFrame,
    labels: tuple[str, str, str] = ("Slice 1", "Slice 2", "Slice 3"),
) -> None:
    slices = [df1, df2, df3]
    sensor_colors = ["#111111", "#FF00AA", "#14EF10"]  # magenta, green, black — per sensor
    slice_linestyles = ["-", "--", ":"]

    def to_pivoted(df: pd.DataFrame) -> pd.DataFrame:
        p = df.pivot_table(
            index="last_changed", columns="entity_id", values="state", aggfunc="mean"
        )
        p.columns = [col.split(".")[-1].replace("_", " ") for col in p.columns]
        p = p.interpolate(method="time")
        p.index = (p.index - p.index[0]).total_seconds() / 60
        return p

    fig, ax = plt.subplots(figsize=(12, 5))

    sensor_color_map: dict[str, str] = {}

    for i, (df, label, ls) in enumerate(zip(slices, labels, slice_linestyles)):
        pivoted = to_pivoted(df)
        for j, sensor in enumerate(pivoted.columns):
            if sensor not in sensor_color_map:
                sensor_color_map[sensor] = sensor_colors[j % len(sensor_colors)]
            ax.plot(
                pivoted.index.to_numpy(),
                pivoted[sensor].to_numpy(),
                linestyle=ls,
                color=sensor_color_map[sensor],
                linewidth=1.4,
                label=f"{label} — {sensor}",
            )

    ax.set_xlabel("Time elapsed (min)")
    ax.set_ylabel("Temperature (°C)")
    ax.set_title("Rack Monitor — Temperature Comparison — 2026-07-13")
    ax.legend(framealpha=0.9, fontsize=8)
    ax.grid(True, linestyle="--", linewidth=0.5, alpha=0.7)
    plt.tight_layout()
    plt.savefig("analysis/cooling-efficiency-analysis/2026-07-13/2026-07-13-temp-compare.svg")
    plt.show()


if __name__ == "__main__":
    df = read_ha_csv("analysis/cooling-efficiency-analysis/2026-07-13/2026-07-13-rack-temp.csv")
    df = rename_entities(
        df,
        {
            "sensor.buro_rack_monitor_rack_temp_1": "T1",
            "sensor.buro_rack_monitor_rack_temp_2": "T2",
            "sensor.buro_rack_monitor_intake_temp": "Intake",
        },
    )

    df_slice_test_1 = slice_timerange(df, "2026-07-13 08:25", "2026-07-13 09:25")
    df_slice_test_2 = slice_timerange(df, "2026-07-13 10:10", "2026-07-13 11:10")
    df_slice_test_3 = slice_timerange(df, "2026-07-13 12:54", "2026-07-13 13:54")

    plot_temperatures_compared(
        df_slice_test_1,
        df_slice_test_2,
        df_slice_test_3,
        labels=("Test1 - 30%", "Test2 - 60%", "Test3 - 100%"))
