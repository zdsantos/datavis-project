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
    dt = []

    for file in os.listdir("test"):
        if file.endswith(".pdf"):
            if "_Exercicio_Docencia_" in file:
                print(os.path.join("/test", file))
                filenameDoc.append(os.path.join("test", file))

    for file in os.listdir("test"):
        if file.endswith(".pdf"):
            if "_Exercicio_Docencia_" in file:
                print("aqui")
                filenameDis.append(os.path.join("test", file))

    def docencia(filename):
        for j in range(len(filename)):
            with open(filename[j], "rb") as f:
                pdf = pdftotext.PDF(f)

            print("Quantidade de paginas:")
            print(len(pdf))
            print("\n")
            print(pdf[1])
            print("\n")
            print(pdf[1].split("\n"))
            print("\n")

            questoes = []
            for i in range(16, 29):
                questoes.append(pdf[1].split("\n")[i].split())

            print(questoes)
            print("\n")

            for k in range(len(questoes)):
                for l in range(len(questoes[k])):
                    questoes[k][l] = questoes[k][l].replace(",", ".")
                    questoes[k][l] = questoes[k][l].replace("12", "10")
                    questoes[k][l] = questoes[k][l].replace("13", "11")
                    questoes[k][l] = float(questoes[k][l])

            print(questoes)
            print("\n")

            ' '.join(pdf[1].split("\n")[7].split())
            aux = ' '.join(pdf[1].split("\n")[7].split())
            aux2 = aux.lower()

            fonte = []
            for i in range(len(questoes)):
                fonte.append(aux2)

            print("fonte", fonte)
            print("\n")

            aux3 = "docente"

            tipo = []
            for i in range(len(questoes)):
                tipo.append(aux3.lower())

            print("tipo:", tipo)
            print("\n")

            year = []
            for i in range(len(questoes)):
                year.append(pdf[1].split("\n")[8].split()[2])

            print(year)
            print("\n")

            dt.append(pd.DataFrame(
                [[questoes[i][0], fonte[i], tipo[i], year[i]] + questoes[i][1:] for (i, n) in enumerate(questoes)],
                columns=["q", "fonte", "tipo", "ano", "ct", "c", "d", "dt", "nsa"]))

            print(dt)

            list_df = []

            for array in dt:
                list_df.append(array.drop(array.index[[9, 10]]))
                print(list_df)

            finaldoc = pd.concat(list_df)

            return finaldoc

    def discente(filename):
        for j in range(len(filename)):
            with open(filename[j], "rb") as f:
                pdf = pdftotext.PDF(f)

            # print("Quantidade de paginas:")
            # print(len(pdf))
            # print("\n")
            # print(pdf[1])
            # print("\n")
            # print(pdf[1].split("\n"))
            # print("\n")

            ' '.join(pdf[1].split("\n")[6].split())
            aux = ' '.join(pdf[1].split("\n")[6].split())
            aux2 = aux.lower()
            fonte = []
            for i in range(11):
                fonte.append(aux2)
            # print("\n")
            #
            # print(fonte)

            aux3 = pdf[1].split("\n")[4].split()[-1][:-1]
            tipo = []
            for i in range(11):
                tipo.append(aux3.lower())

            # print(tipo)
            # print("\n")

            year = []
            for i in range(11):
                year.append(pdf[1].split("\n")[7].split()[2])

            # print(year)
            # print("\n")

            questoes = []
            for i in range(15, 26):
                questoes.append(pdf[1].split("\n")[i].split())

            dt.append(pd.DataFrame(
                [[questoes[i][0], fonte[i], tipo[i], year[i]] + questoes[i][1:] for (i, n) in enumerate(questoes)],
                columns=["q", "fonte", "tipo", "ano", "ct", "c", "d", "dt", "nsa"]))
            print(dt)

            finaldis = pd.concat(dt)

            return finaldis

    resultAll = []
    resultAll.append(discente(filenameDis))
    resultAll.append(docencia(filenameDoc))

    final = pd.concat(resultAll)

    csv_name = "file.csv"

    final.to_csv(csv_name, index=False)

    dir_path = os.path.dirname(os.path.realpath(__file__))

    final = pd.concat(dt)

    csv_name = "file.csv"

    final.to_csv(csv_name, index=False)

    dir_path = os.path.dirname(os.path.realpath(__file__))

    return dir_path+"/"+csv_name

