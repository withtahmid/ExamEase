from sentence_transformers import SentenceTransformer,util
model = SentenceTransformer('stsb-bert-base')

def find_similarity(texts):
    response = {"ok": True}
    if(len(texts) < 2):
        response["ok"] = False
        response["error"] = "Less than 2 strings found. Nothing to compare"
        return response
    try:
        tensor = util.cos_sim(model.encode(texts[0]), model.encode(texts[1:]))
        response["result"] = [round(float(x), 2) for x in tensor[0]]
    except Exception as e:
        response["ok"] = False
        response["error"] = str(e)

    return response
