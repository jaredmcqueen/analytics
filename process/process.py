__author__ = 'brurokbr'

import pandas as pd
import numpy as np
import glob

data = 'raw/data.csv'

# Read all threat intel from intel folder, change column headers to actor, reference, type
path ='intel'
all = glob.glob(path + "/*.csv")
ti_combine = pd.DataFrame()
ti_list_ = []
for file_ in all:
    new_frame = pd.read_csv(file_,index_col=None, header=0, names=['actor', 'reference', 'type'])
    ti_list_.append(new_frame)
ti_combine = pd.concat(ti_list_)

# Read raw network data
df_data = pd.read_csv(data, keep_default_na=False, na_values=[""])

# Find and combine hits
ti_src = pd.merge(left=df_data, right=ti_combine, left_on='source', right_on='actor')
ti_tgt = pd.merge(left=df_data, right=ti_combine, left_on='target', right_on='actor')
hits_combine = pd.concat([ti_src, ti_tgt], axis=0)

# Concatenate TI hits and raw data
enriched = pd.concat([df_data, hits_combine], axis=0)

# Add columns for src and tgt hit
enriched['src_hit'] = np.where(enriched['source']==enriched['actor'], 'true', 'N/A')
enriched['target_hit'] = np.where(enriched['target']==enriched['actor'], 'true', 'N/A')
enriched = enriched.drop('actor', 1)
enriched = enriched[['epoch', 'source', 'target', 'src_hit', 'target_hit', 'reference', 'type']]

# Write enriched file to csv
enriched.to_csv('../examples/output.csv', columns = ['epoch', 'source', 'target', 'src_hit', 'target_hit',
                                                     'reference', 'type'], header=['Event Time', 'sourceAddress',
                                                     'destinationAddress', 'src_hit', 'target_hit', 'reference',
                                                     'type'], index=False)