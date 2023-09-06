from flask import Flask, request, jsonify
from Face_Recognition import match_face
from Speech_to_Text import extract_text
from Text_Similarity import find_similarity
from Authentication import authenticated

app = Flask(__name__)

@app.before_request
def check_secret_key():
    try:
        if(not authenticated(request)):
            return jsonify({'error': 'Unauthorized'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Expects base64 image array. 
@app.route('/api/facematch', methods=['POST'])
def face_match():
    try:
        data = request.get_json()
        if 'images' not in data:
            return jsonify({'error': 'Missing images in the request JSON'}), 400
        
        images = data['images']
        try:
            return  jsonify(match_face(images))
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/speechtotext', methods=['POST'])
def speech_to_text():
    try:
        data = request.get_json()
        if 'audio' not in data:
            return jsonify({'error': 'Missing audio in the request JSON'}), 400
        
        audio = data['audio']
        try:        
            return jsonify(extract_text(audio))
        except Exception as e:
            return jsonify(print(e))
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/textsimilarity', methods=['POST'])
def check_text_similarity():
    try:
        data = request.get_json()
        if 'texts' not in data:
            return jsonify({'error': 'Missing texts in the request JSON'}), 400
        
        texts = data['texts']
        try:        
            return jsonify(find_similarity(texts))
        except Exception as e:
            return jsonify(print(e))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
 