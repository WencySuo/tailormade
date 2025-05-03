# Install dependencies as needed:
# pip install kagglehub[pandas-datasets]
import kagglehub
from kagglehub import KaggleDatasetAdapter

# Set the path to the file you'd like to load
file_path = "~/Downloads/aug_personal_transactions_with_UserId.csv"

# Load the latest version
df = kagglehub.load_dataset(
  KaggleDatasetAdapter.PANDAS,
  "shyakanobledavid/personal-transactions-userid-new-transactions",
  file_path,
  # Provide any additional arguments like 
  # sql_query or pandas_kwargs. See the 
  # documenation for more information:
  # https://github.com/Kaggle/kagglehub/blob/main/README.md#kaggledatasetadapterpandas
)
for user_id, group in df.groupby('userId'):
    output_filename = f"user_{user_id}.csv"
    group.to_csv(output_filename, index=False)
    print(f"Wrote {output_filename}")