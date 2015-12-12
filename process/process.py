__author__ = 'brurokbr'

import pandas as pd
import numpy as np
import glob


# Specify data file for matching with threat intel
data = 'raw/data.csv'

# Includes Malc0de, emerging threats and Zeus Tracker as examples
url_malc0de = 'http://malc0de.com/bl/IP_Blacklist.txt'
url_et = 'http://rules.emergingthreats.net/blockrules/compromised-ips.txt'
url_zeus = 'https://zeustracker.abuse.ch/blocklist.php?download=ipblocklist'
url_zeus_domains = 'https://zeustracker.abuse.ch/blocklist.php?download=domainblocklist'

#Convert to DataFrames
df_malc0de = pd.read_table(url_malc0de, index_col=None, skiprows=7, header=0, names=['actor'])
df_et = pd.read_table(url_et, index_col=None, skiprows=5, header=0, names=['actor'])
df_zeus = pd.read_table(url_zeus, index_col=None, skiprows=6, header=0, names=['actor'])
df_zeus_domains = pd.read_table(url_zeus_domains, index_col=None, skiprows=6, header=0, names=['actor'])


# Alternatively, put a bunch threat intel CSVs in the "intel" directory
# # Read all threat intel from intel folder, change column headers to actor, reference, type
# intel_path ='intel'
# all = glob.glob(intel_path + "/*.csv")
# ti_combine = pd.DataFrame()
# ti_list_ = []
# for file_ in all:
#     new_frame = pd.read_csv(file_,index_col=None, header=0, names=['actor'])
#     ti_list_.append(new_frame)
# ti_combine = pd.concat(ti_list_)


# # Combine dataframes
ti_combine = pd.concat([df_malc0de, df_et, df_zeus, df_zeus_domains], axis=0)

# Read raw network data
df_data = pd.read_csv(data, keep_default_na=False, na_values=[''], skiprows=1, names=['datetime','source', 'target'], parse_dates=['datetime'])

# Find and combine hits
ti_src = pd.merge(left=df_data, right=ti_combine, left_on='source', right_on='actor')
ti_tgt = pd.merge(left=df_data, right=ti_combine, left_on='target', right_on='actor')
hits_combine = pd.concat([ti_src, ti_tgt], axis=0)

# Merge or Concatenate TI hits and raw data
# enriched = pd.merge([df_data, hits_combine], axis=0)
enriched = pd.merge(left=df_data,right=hits_combine, how='left', left_on=['epoch','source', 'target'], right_on=['epoch','source', 'target'])

# Add columns for src and tgt hits, clean up dataframe and timestamps
enriched['src_hit'] = np.where(enriched['source']==enriched['actor'], 'true', '')
enriched['target_hit'] = np.where(enriched['target']==enriched['actor'], 'true', '')
enriched = enriched.drop('actor', 1)
enriched['Event Time'] = enriched['epoch'].astype('int').astype('datetime64[s]')
enriched = enriched[['Event Time', 'source', 'target', 'src_hit', 'target_hit']]


# Write enriched file to csv
enriched.to_csv('../examples/output.csv', columns = ['Event Time', 'source', 'target', 'src_hit', 'target_hit'],
                header = ['Event Time', 'sourceAddress', 'destinationAddress', 'src_hit', 'target_hit'], index=False)

