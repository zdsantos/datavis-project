import pdftotext
import csv
import pandas as pd
import os
from flask import Flask
app = Flask(__name__)

@app.route("/")
def createTable():
    filenameDoc = []
    filenameDis = []

    for file in os.listdir("test"):
        if file.endswith(".pdf"):
            if "_Exercicio_Docencia_" in file:
                print(os.path.join("/test", file))
                filenameDoc.append(os.path.join("test", file))

    for file in os.listdir("test"):
        if file.endswith(".pdf"):
            if "_Exercicio_Docencia_" not in file:
                print(os.path.join("/test", file))
                filenameDis.append(os.path.join("test", file))

    def docencia(filename):
        dt = []

        for j in range(len(filename)):
            with open(filename[j], "rb") as f:
                pdf = pdftotext.PDF(f)

            questoes = []
            for i in range(16, 29):
                questoes.append(pdf[1].split("\n")[i].split())

            for k in range(len(questoes)):
                for l in range(len(questoes[k])):
                    questoes[k][l] = questoes[k][l].replace(",", ".")
                    questoes[k][l] = questoes[k][l].replace("12", "10")
                    questoes[k][l] = questoes[k][l].replace("13", "11")
                    questoes[k][l] = float(questoes[k][l])

            ' '.join(pdf[1].split("\n")[7].split())
            aux = ' '.join(pdf[1].split("\n")[7].split())
            aux2 = aux.lower()

            fonte = []
            for i in range(len(questoes)):
                fonte.append(aux2)

            aux3 = "docente"

            tipo = []
            for i in range(len(questoes)):
                tipo.append(aux3.lower())

            year = []
            for i in range(len(questoes)):
                year.append(pdf[1].split("\n")[8].split()[2])

            dt.append(pd.DataFrame(
                [[questoes[i][0], fonte[i], tipo[i], year[i]] + questoes[i][1:] for (i, n) in enumerate(questoes)],
                columns=["q", "fonte", "tipo", "ano", "ct", "c", "d", "dt", "nsa"]))

        list_df = []
        for array in dt:
            list_df.append(array.drop(array.index[[9, 10]]))

        finaldoc = pd.concat(list_df)

        return finaldoc

    def discente(filename):
        dt = []

        for j in range(len(filename)):
            with open(filename[j], "rb") as f:
                pdf = pdftotext.PDF(f)

            ' '.join(pdf[1].split("\n")[6].split())
            aux = ' '.join(pdf[1].split("\n")[6].split())
            aux2 = aux.lower()
            fonte = []
            for i in range(11):
                fonte.append(aux2)

            aux3 = pdf[1].split("\n")[4].split()[-1][:-1]
            tipo = []
            for i in range(11):
                tipo.append(aux3.lower())

            year = []
            for i in range(11):
                year.append(pdf[1].split("\n")[7].split()[2])

            questoes = []
            for i in range(15, 26):
                questoes.append(pdf[1].split("\n")[i].split())

            dt.append(pd.DataFrame(
                [[questoes[i][0], fonte[i], tipo[i], year[i]] + questoes[i][1:] for (i, n) in enumerate(questoes)],
                columns=["q", "fonte", "tipo", "ano", "ct", "c", "d", "dt", "nsa"]))

        finaldis = pd.concat(dt)

        return finaldis

    resultAll = []
    resultAll.append(discente(filenameDis))
    resultAll.append(docencia(filenameDoc))

    final = pd.concat(resultAll)

    csv_name = "data/file.csv"

    final.to_csv(csv_name, index=False)

    dir_path = os.path.dirname(os.path.realpath(__file__))

    return dir_path+"/"+csv_name

