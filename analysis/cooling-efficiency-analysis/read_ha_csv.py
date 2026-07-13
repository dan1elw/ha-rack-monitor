import pandas as pd

def read_ha_csv(file_path: str) -> pd.DataFrame:
    df = pd.read_csv(file_path)
    df["last_changed"] = pd.to_datetime(df["last_changed"], utc=True)
    df["state"] = pd.to_numeric(df["state"], errors="coerce")
    return df

if __name__ == "__main__":
    df = read_ha_csv("analysis/cooling-efficiency-analysis/data/2026-07-13-rack-temp.csv")
    print(df.head())
    print(df.dtypes)
