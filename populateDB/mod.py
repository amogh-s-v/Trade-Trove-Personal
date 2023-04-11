import pandas as pd

# Read the input XLSX file into a pandas DataFrame
df = pd.read_excel('prods_mod.xlsx')

# Drop duplicate rows based on the "product_name" column
df.drop_duplicates(subset='product_name', keep='first', inplace=True)

# Write the updated data to a new XLSX file
df.to_excel('output.xlsx', index=False)
