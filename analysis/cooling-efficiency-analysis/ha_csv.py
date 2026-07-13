import pandas as pd

# read home assistant csv export and convert to pandas dataframe
def read_ha_csv(file_path: str) -> pd.DataFrame:
    df = pd.read_csv(file_path)
    df["last_changed"] = pd.to_datetime(df["last_changed"], utc=True)
    df["state"] = pd.to_numeric(df["state"], errors="coerce")
    return df

# slice a dataframe by a time range given in schema "2026-07-13 09:25"
def slice_timerange(
    df: pd.DataFrame,
    start: str | pd.Timestamp,
    end: str | pd.Timestamp,
) -> pd.DataFrame:
    start = pd.Timestamp(start, tz="UTC")
    end = pd.Timestamp(end, tz="UTC")
    return df[(df["last_changed"] >= start) & (df["last_changed"] <= end)].reset_index(drop=True)

# rename entities in a dataframe based on a mapping dictionary
def rename_entities(df: pd.DataFrame, mapping: dict[str, str]) -> pd.DataFrame:
    df = df.copy()
    df["entity_id"] = df["entity_id"].replace(mapping)
    return df

if __name__ == "__main__":
    df = read_ha_csv("analysis/cooling-efficiency-analysis/data/2026-07-13-rack-temp.csv")
    print(df.head())
    print(df.dtypes)
