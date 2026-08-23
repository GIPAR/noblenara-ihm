import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv

from lbp_utils import detectar_e_recortar_rosto, calcular_histograma_lbp, distancia_qui_quadrado

load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["reconhecimento_db"]
collection = db["vetores_faciais"]

app = FastAPI(title="Backend da IHM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Usado só pelo login manual (usuário/senha)
USUARIOS = {
    "gipar": {"senha": "usergipar", "tipo": "admin"},
}

# Quanto MENOR, mais rígido a exigência de parecença (é uma distância, não uma porcentagem de acerto)
LIMIAR_DISTANCIA = 0.15


@app.get("/")
def root():
    return {"mensagem": "Backend da IHM está rodando!"}


@app.post("/api/login-form")
async def login_form(
    username: str = Form(...),
    password: str = Form(...),
    file: UploadFile = File(None)
):
    print(f"Login recebido do usuário: {username}")

    usuario = USUARIOS.get(username)
    if not usuario or usuario["senha"] != password:
        return {"sucesso": False, "mensagem": "Credenciais inválidas"}

    return {
        "sucesso": True,
        "tipo_usuario": usuario["tipo"],
        "username": username
    }


@app.post("/api/login-face")
async def login_face(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        return {"sucesso": False, "mensagem": "Imagem inválida"}

    cinza = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rosto = detectar_e_recortar_rosto(cinza)

    if rosto is None:
        return {"sucesso": False, "mensagem": "Nenhum rosto detectado"}

    vetor_capturado = calcular_histograma_lbp(rosto)

    melhor_tipo = None
    menor_distancia = float("inf")

    for documento in collection.find():
        for vetor_salvo in documento.get("vetores", []):
            distancia = distancia_qui_quadrado(vetor_capturado, vetor_salvo)
            if distancia < menor_distancia:
                menor_distancia = distancia
                melhor_tipo = documento["tipo_usuario"]

    print(f"Melhor correspondência: {melhor_tipo} (distância: {menor_distancia:.4f})")

    if melhor_tipo is None or menor_distancia > LIMIAR_DISTANCIA:
        return {"sucesso": False, "mensagem": "Rosto não reconhecido"}

    return {
        "sucesso": True,
        "tipo_usuario": melhor_tipo
    }