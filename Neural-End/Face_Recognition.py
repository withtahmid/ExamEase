import base64
from PIL import Image
from io import BytesIO
import face_recognition as fr
import numpy as np

def encode(image):
    return fr.face_encodings(np.array(Image.open(BytesIO(base64.b64decode(image)))))

def match_face(images): 
    response = {"ok" : True}
    if len(images) < 2 :
        response["ok"] = False
        response["error"] = "Found less than 2 images. Nothing to compare."
        return response
    
    source_image_encodding = encode(images[0])

    if(len(source_image_encodding) != 1):
        response["ok"] = False
        response["error"] = f"Source image contains number of face: {len(source_image_encodding)}"
        return response
    
    response["results"] = []
    try:
        for image in images[1:]:
            encoding = encode(image)
            if len(encoding) == 0:
                response["results"].append({
                        "matches": False,
                        "faces": 0
                    }
                )
                continue
            try:
                match = True in [bool(res) for res in fr.compare_faces(encoding, source_image_encodding[0])]
                response["results"].append({
                            "matches": match,
                            "faces": len(encoding)
                        }
                    )
            except Exception as e:
                response["ok"] = False
                response["error"] = str(e)
                return response
       
    except Exception as e:
        response["ok"] = False
        response["error"] = str(e)
    
    return response