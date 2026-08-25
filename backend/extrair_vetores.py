"""
Varre fotos_usuarios/fotos_dev/ e fotos_usuarios/fotos_user/, calcula o vetor facial
(histograma LBP) de cada foto e salva no MongoDB Atlas, um documento por TIPO de usuário.

Rode este script sempre que adicionar novas fotos de cadastro.
"""

import os
import cv2
from pymongo import MongoClient
from dotenv import load_dotenv

from lbp_utils import detectar_e_recortar_rosto, calcular_histograma_lbp

load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI)
db = client["reconhecimento_db"]
collection = db["vetores_faciais"]

PASTA_FOTOS = "fotos_usuarios"

# Nome da pasta -> tipo de usuário usado pelo resto do sistema (front espera "admin" ou "comum")
PASTA_PARA_TIPO = {
    "fotos_dev": "admin",
    "fotos_user": "comum",
}


def extrair_vetores_pasta(pasta_usuario: str) -> list[list[float]]:
    """Varre a pasta em busca de fotos. Se houver subpastas (ex: fotos_dev/fotos_gabriele/),
    entra em cada uma delas também — assim funciona com ou sem uma camada extra de pasta."""
    vetores = []

    for raiz, _, arquivos in os.walk(pasta_usuario):
        for nome_arquivo in arquivos:
            if not nome_arquivo.lower().endswith((".jpg", ".jpeg", ".png")):
                continue

            caminho = os.path.join(raiz, nome_arquivo)
            img = cv2.imread(caminho, cv2.IMREAD_GRAYSCALE)
            if img is None:
                continue

            rosto = detectar_e_recortar_rosto(img)
            if rosto is None:
                print(f"  Nenhum rosto detectado em {caminho}, pulando.")
                continue

            vetor = calcular_histograma_lbp(rosto)
            vetores.append(vetor)
            print(f"  Vetor extraído de {caminho}")

    return vetores


def main():
    if not os.path.isdir(PASTA_FOTOS):
        print(f"Pasta '{PASTA_FOTOS}' não encontrada.")
        return

    for nome_pasta, tipo_usuario in PASTA_PARA_TIPO.items():
        caminho_pasta = os.path.join(PASTA_FOTOS, nome_pasta)

        if not os.path.isdir(caminho_pasta):
            print(f"Pasta '{caminho_pasta}' não encontrada, pulando.")
            continue

        print(f"Processando '{nome_pasta}' (tipo: {tipo_usuario})")
        vetores = extrair_vetores_pasta(caminho_pasta)

        if not vetores:
            print(f"  Nenhum vetor extraído para '{nome_pasta}', não será salvo.")
            continue

        collection.update_one(
            {"tipo_usuario": tipo_usuario},
            {"$set": {"tipo_usuario": tipo_usuario, "vetores": vetores}},
            upsert=True
        )
        print(f"  {len(vetores)} vetores salvos no MongoDB para tipo '{tipo_usuario}'.\n")

    print("Extração concluída!")


if __name__ == "__main__":
    main()