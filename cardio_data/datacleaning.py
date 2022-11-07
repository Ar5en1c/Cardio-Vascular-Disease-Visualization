# %%
# Imports
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re

# %%
# Read files
albumin_df = pd.read_csv('albumin.txt', sep='|')
creatinine_df = pd.read_csv('creatinine.txt', sep='|')
height_df = pd.read_csv('height.txt', sep='|')
hypertension_df = pd.read_csv('hypertension.txt', sep='|')
weight_df = pd.read_csv('weight.txt', sep='|')

# print(albumin_df.info(), '\n')
# print(creatinine_df.info(), '\n')
# print(height_df.info(), '\n')
# print(weight_df.info(), '\n')
# print(hypertension_df.info(), '\n')

# %%
# open hemoglobin file, replace ',' with '.'
f = open('../glycosylated_hemoglobin.txt','r')
filedata = f.read()
f.close()
newdata = filedata.replace(",",".")

# Create new file, read df from new file
f = open('hemoglobin.txt','w')
f.write(newdata)
f.close()

# Read hemoglobin to df
hemoglobin_df = pd.read_csv('hemoglobin.txt', sep='|')
hemoglobin_df.info()

# %%
hypertension_df.info()

# %%
# clean data 

data_frames = [albumin_df, creatinine_df, height_df, hypertension_df, weight_df, hemoglobin_df]

for frame in data_frames:
    if 'RESULT' in list(frame.columns):
        frame = frame[frame['RESULT'].notna()]
        frame['RESULT'] = frame['RESULT'].str.replace(',', '.') 
        frame['result'] = frame['RESULT'].apply(lambda x: re.findall(r"[-+]?(?:\d*\.\d+|\d+)", x))
        frame = frame[frame["result"].str.len() != 0]
        frame['result'] = frame['result'].apply(lambda x: x[0])
        frame['result'] = frame['result'].astype(float)
        frame.drop(['RESULT'], axis=1, inplace=True)
    frame['PAT_ID'] = frame['PAT_ID'].astype(str)
    frame['PAT_ID'] = frame['PAT_ID'].str.replace('\W', '')
    frame['DATE'] = pd.to_datetime(frame['DATE'])
    print(frame.info())

# %%
diagnostics_df = pd.read_csv('../diagnostics_10192022.txt', sep='|')
print(diagnostics_df.info(), '\n')


# %%
demographics_df = pd.read_csv('../demogra_10192022 1.txt', sep='|', encoding = 'unicode_escape')
print(demographics_df.info(), '\n')

# %%
CVDCodes_df = pd.read_excel('../CARDIOVASCULAR_CODES.xlsx', index_col=None)
print(CVDCodes_df.info(), '\n')

# %%
creatinine_df['PAT_ID'] = creatinine_df['PAT_ID'].astype('string')
creatinine_df['RESULT'] = creatinine_df['RESULT'].astype('string')
creatinine_df['TYPE_DOC'] = creatinine_df['TYPE_DOC'].astype('string')
creatinine_df['DATE'] = creatinine_df['DATE'].astype('string')
creatinine_df['FORM_NUMBER'] = creatinine_df['FORM_NUMBER'].astype('string')

creatinine_df['PAT_ID'] = creatinine_df['PAT_ID'].str.strip()
creatinine_df['RESULT'] = creatinine_df['RESULT'].str.strip()
creatinine_df['TYPE_DOC'] = creatinine_df['TYPE_DOC'].str.strip()
creatinine_df['FORM_NUMBER'] = creatinine_df['FORM_NUMBER'].str.strip()
creatinine_df['DATE'] = creatinine_df['DATE'].str.lstrip()
creatinine_df['DATE'] = creatinine_df['DATE'].str.rstrip()

creatinine_df['isNumeric'] = list(map(lambda x: x.isnumeric(), creatinine_df['PAT_ID']))

creatinine_df = creatinine_df[creatinine_df['isNumeric'] == True]

# %%
albumin_df['PAT_ID'] = albumin_df['PAT_ID'].astype('string')
albumin_df['RESULT'] = albumin_df['RESULT'].astype('string')
albumin_df['CEX_RES_SECUENCE'] = albumin_df['CEX_RES_SECUENCE'].astype('string')
albumin_df['TYPE_DOC'] = albumin_df['TYPE_DOC'].astype('string')
albumin_df['DATE'] = albumin_df['DATE'].astype('string')
albumin_df['FORM_NUMBER'] = albumin_df['FORM_NUMBER'].astype('string')

albumin_df['PAT_ID'] = albumin_df['PAT_ID'].str.strip()
albumin_df['RESULT'] = albumin_df['RESULT'].str.strip()
albumin_df['TYPE_DOC'] = albumin_df['TYPE_DOC'].str.strip()
albumin_df['CEX_RES_SECUENCE'] = albumin_df['CEX_RES_SECUENCE'].str.strip()
albumin_df['FORM_NUMBER'] = albumin_df['FORM_NUMBER'].str.strip()
albumin_df['DATE'] = albumin_df['DATE'].str.lstrip()
albumin_df['DATE'] = albumin_df['DATE'].str.rstrip()

# %%
hemoglobin_df['PAT_ID'] = hemoglobin_df['PAT_ID'].astype('string')
hemoglobin_df['RESULT'] = hemoglobin_df['RESULT'].astype('string')
hemoglobin_df['CEX_RES_SECUENCE'] = hemoglobin_df['CEX_RES_SECUENCE'].astype('string')
hemoglobin_df['TYPE_DOC'] = hemoglobin_df['TYPE_DOC'].astype('string')
hemoglobin_df['DATE'] = hemoglobin_df['DATE'].astype('string')
hemoglobin_df['FORM_NUMBER'] = hemoglobin_df['FORM_NUMBER'].astype('string')
hemoglobin_df['hemoglobin'] = hemoglobin_df['hemoglobin'].astype('string')

hemoglobin_df['PAT_ID'] = hemoglobin_df['PAT_ID'].str.strip()
hemoglobin_df['RESULT'] = hemoglobin_df['RESULT'].str.strip()
hemoglobin_df['hemoglobin'] = hemoglobin_df['hemoglobin'].str.strip()
hemoglobin_df['TYPE_DOC'] = hemoglobin_df['TYPE_DOC'].str.strip()
hemoglobin_df['CEX_RES_SECUENCE'] = hemoglobin_df['CEX_RES_SECUENCE'].str.strip()
hemoglobin_df['FORM_NUMBER'] = hemoglobin_df['FORM_NUMBER'].str.strip()
hemoglobin_df['DATE'] = hemoglobin_df['DATE'].str.lstrip()
hemoglobin_df['DATE'] = hemoglobin_df['DATE'].str.rstrip()

# %%
height_df['PAT_ID'] = height_df['PAT_ID'].astype('string')
height_df['HEIGHT'] = height_df['HEIGHT'].astype('string')
height_df['TYPE_DOC'] = height_df['TYPE_DOC'].astype('string')
height_df['DATE'] = height_df['DATE'].astype('string')
height_df['CORRETALLA'] = height_df['CORRETALLA'].astype('string')
height_df['ENCUTALLA'] = height_df['ENCUTALLA'].astype('string')

weight_df['PAT_ID'] = weight_df['PAT_ID'].astype('string')
weight_df['WEIGHT'] = weight_df['WEIGHT'].astype('string')
weight_df['TYPE_DOC'] = weight_df['TYPE_DOC'].astype('string')
weight_df['DATE'] = weight_df['DATE'].astype('string')
weight_df['CORRE_PESO'] = weight_df['CORRE_PESO'].astype('string')
weight_df['ENCUENTRO_PESO'] = weight_df['ENCUENTRO_PESO'].astype('string')

hypertension_df['PAT_ID'] = hypertension_df['PAT_ID'].astype('string')
hypertension_df['MTV_CORRELATION'] = hypertension_df['MTV_CORRELATION'].astype('string')
hypertension_df['TYPE_DOC'] = hypertension_df['TYPE_DOC'].astype('string')
hypertension_df['DATE'] = hypertension_df['DATE'].astype('string')
hypertension_df['TABENCUENTRO'] = hypertension_df['TABENCUENTRO'].astype('string')
hypertension_df['SYSTOLIC_PRESSURE'] = hypertension_df['SYSTOLIC_PRESSURE'].astype('string')
hypertension_df['DIASTOLIC_PRESSURE'] = hypertension_df['DIASTOLIC_PRESSURE'].astype('string')

# %%
height_df['PAT_ID'] = height_df['PAT_ID'].str.strip()
height_df['HEIGHT'] = height_df['HEIGHT'].str.strip()
height_df['CORRETALLA'] = height_df['CORRETALLA'].str.strip()
height_df['TYPE_DOC'] = height_df['TYPE_DOC'].str.strip()
height_df['ENCUTALLA'] = height_df['ENCUTALLA'].str.strip()
height_df['DATE'] = height_df['DATE'].str.lstrip()
height_df['DATE'] = height_df['DATE'].str.rstrip()

weight_df['PAT_ID'] = weight_df['PAT_ID'].str.strip()
weight_df['WEIGHT'] = weight_df['WEIGHT'].str.strip()
weight_df['CORRE_PESO'] = weight_df['CORRE_PESO'].str.strip()
weight_df['TYPE_DOC'] = weight_df['TYPE_DOC'].str.strip()
weight_df['ENCUENTRO_PESO'] = weight_df['ENCUENTRO_PESO'].str.strip()
weight_df['DATE'] = weight_df['DATE'].str.lstrip()
weight_df['DATE'] = weight_df['DATE'].str.rstrip()


hypertension_df['PAT_ID'] = hypertension_df['PAT_ID'].str.strip()
hypertension_df['MTV_CORRELATION'] = hypertension_df['MTV_CORRELATION'].str.strip()
hypertension_df['SYSTOLIC_PRESSURE'] = hypertension_df['SYSTOLIC_PRESSURE'].str.strip()
hypertension_df['DIASTOLIC_PRESSURE'] = hypertension_df['DIASTOLIC_PRESSURE'].str.strip()
hypertension_df['TYPE_DOC'] = hypertension_df['TYPE_DOC'].str.strip()
hypertension_df['TABENCUENTRO'] = hypertension_df['TABENCUENTRO'].str.strip()
hypertension_df['DATE'] = hypertension_df['DATE'].str.lstrip()
hypertension_df['DATE'] = hypertension_df['DATE'].str.rstrip()

# %%
demographics_df.dropna()

demographics_df['PAT_ID'] = demographics_df['PAT_ID'].astype('string')
demographics_df['PK_USER'] = demographics_df['PK_USER'].astype('string')
demographics_df['ID_TYPE'] = demographics_df['ID_TYPE'].astype('string')
demographics_df['TYPE_USER'] = demographics_df['TYPE_USER'].astype('string')
demographics_df['DEATH_DATE'] = demographics_df['DEATH_DATE'].astype('string')
demographics_df['BIRTH_DATE'] = demographics_df['BIRTH_DATE'].astype('string')
demographics_df['AGE'] = demographics_df['AGE'].astype('string')
demographics_df['SEX'] = demographics_df['SEX'].astype('string')
demographics_df['DVP_REG_CODE'] = demographics_df['DVP_REG_CODE'].astype('string')
demographics_df['DVP_PRO_CODEO'] = demographics_df['DVP_PRO_CODEO'].astype('string')
demographics_df['CENTER_ID'] = demographics_df['CENTER_ID'].astype('string')

demographics_df['PAT_ID'] = demographics_df['PAT_ID'].str.strip()
demographics_df['PK_USER'] = demographics_df['PK_USER'].str.strip()
demographics_df['ID_TYPE'] = demographics_df['ID_TYPE'].str.strip()
demographics_df['TYPE_USER'] = demographics_df['TYPE_USER'].str.strip()
demographics_df['DEATH_DATE'] = demographics_df['DEATH_DATE'].str.strip()
demographics_df['BIRTH_DATE'] = demographics_df['BIRTH_DATE'].str.strip()
demographics_df['AGE'] = demographics_df['AGE'].str.strip()
demographics_df['SEX'] = demographics_df['SEX'].str.strip()
demographics_df['DVP_REG_CODE'] = demographics_df['DVP_REG_CODE'].str.strip()
demographics_df['DVP_PRO_CODEO'] = demographics_df['DVP_PRO_CODEO'].str.strip()
demographics_df['CENTER_ID'] = demographics_df['CENTER_ID'].str.strip()

demographics_df = demographics_df[:][1:]
demographics_df = demographics_df[demographics_df['PAT_ID'].isna() == False]

demographics_df['isNumeric'] = list(map(lambda x: x.isnumeric(), demographics_df['PAT_ID']))
demographics_df = demographics_df[demographics_df['isNumeric'] == True]

# %%
CVDCodes_df['DIA_TEXT'] = CVDCodes_df['DIA_TEXT'].astype('string')
CVDCodes_df['DIA_CODE'] = CVDCodes_df['DIA_CODE'].astype('string')
CVDCodes_df['DIA_TEXT'] = CVDCodes_df['DIA_TEXT'].str.strip()
CVDCodes_df['DIA_CODE'] = CVDCodes_df['DIA_CODE'].str.strip()

# %%
diagnostics_df['PK_USER'] = diagnostics_df['PK_USER'].astype('string')
diagnostics_df['DIA_CODE'] = diagnostics_df['DIA_CODE'].astype('string')

# %%
diagnostics_df['PK_USER'] = diagnostics_df['PK_USER'].str.strip()
diagnostics_df['DIA_CODE'] = diagnostics_df['DIA_CODE'].str.strip()

# %%
hypertension_df['isNumeric'] = list(map(lambda x: x.isnumeric(), hypertension_df['PAT_ID']))
hypertension_df = hypertension_df[hypertension_df['isNumeric'] == True]

weight_df['isNumeric'] = list(map(lambda x: x.isnumeric(), weight_df['PAT_ID']))
weight_df = weight_df[weight_df['isNumeric'] == True]

# %%
albumin_df = albumin_df.rename(columns={"RESULT": "albumin"})
creatinine_df = creatinine_df.rename(columns={"RESULT": "creatinine"})

# %%
albumin_df.set_index('PAT_ID')
creatinine_df.set_index('PAT_ID')
hemoglobin_df.set_index('PAT_ID')
hypertension_df.set_index('PAT_ID')
weight_df.set_index('PAT_ID')
height_df.set_index('PAT_ID')
demographics_df.set_index('PAT_ID')

# %%
albumin_df.to_csv(r'../cleaned_data/albumin.csv', sep=',', encoding='utf-8', header='true')
creatinine_df.to_csv(r'../cleaned_data/creatinine.csv', sep=',', encoding='utf-8', header='true')
hemoglobin_df.to_csv(r'../cleaned_data/hemoglobin.csv', sep=',', encoding='utf-8', header='true')
hypertension_df.to_csv(r'../cleaned_data/hypertension.csv', sep=',', encoding='utf-8', header='true')
weight_df.to_csv(r'../cleaned_data/weight.csv', sep=',', encoding='utf-8', header='true')
height_df.to_csv(r'../cleaned_data/height.csv', sep=',', encoding='utf-8', header='true')
demographics_df.to_csv(r'../cleaned_data/demographics.csv', sep=',', encoding='utf-8', header='true')
CVDCodes_df.to_csv(r'../cleaned_data/cvd_codes.csv', sep=',', encoding='utf-8', header='true')
diagnostics_df.to_csv(r'../cleaned_data/diagnostics.csv', sep=',', encoding='utf-8', header='true')


# %%
# result1 = pd.merge(albumin_df, creatinine_df, how="inner", on=["PAT_ID", "PAT_ID"])

# %%
# result2 = pd.merge(hemoglobin_df, creatinine_df, how="inner", on=["PAT_ID", "PAT_ID"])

# %%
# result3 = pd.merge(result2, albumin_df, how="inner", on=["PAT_ID", "PAT_ID"])


