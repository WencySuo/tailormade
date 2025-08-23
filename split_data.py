import polars as pl

splits = {'train': 'credit_card_transaction_train.csv', 'test': 'credit_card_transaction_test.csv'}
train_df = pl.read_csv('hf://datasets/pointe77/credit-card-transaction/' + splits['train'])
test_df = pl.read_csv('hf://datasets/pointe77/credit-card-transaction/' + splits['test'])
df = pl.concat([train_df, test_df], ignore_index=True)

df.write_csv("credit_card_transaction.csv")

print(df.head())
print(df.shape)
