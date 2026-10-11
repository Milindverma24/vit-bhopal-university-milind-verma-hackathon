import sys
from pathlib import Path

# Add backend to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.services.ingestion.synthetic_generator import SyntheticDataGenerator

if __name__ == "__main__":
    print("Generating deterministic synthetic financial datasets...")
    SyntheticDataGenerator.save_synthetic_files()
    print("Synthetic datasets successfully generated under data/synthetic/")
