import os
import whisper
import tempfile
import base64
model = whisper.load_model("base")


def process_wav_file(filename):
    response = {}
    mel = whisper.log_mel_spectrogram(whisper.pad_or_trim(
        whisper.load_audio(filename))).to(model.device)
    _, probs = model.detect_language(mel)
    response["lan"] = str(max(probs, key=probs.get))
    result = whisper.decode(model, mel, whisper.DecodingOptions(fp16=False))
    response["text"] = str(result.text)
    return response


def extract_text(audio):
    try:
        decodedData = base64.b64decode(audio)
        webmfile = (f'{os.getcwd()}\\audio.wav')

        ret = {}
        with open(webmfile, 'wb') as file:
            file.write(decodedData)
            res = process_wav_file(webmfile)
            res["ok"] = True
            ret = res
        os.remove(webmfile) if os.path.exists(webmfile) else None
        return ret
    except Exception as e:
        return {"ok": False, "error": str(e)}

    # try:
    #     audio_binary = base64.b64decode(audio)
    #     with tempfile.TemporaryDirectory() as temp_dir:
    #         temp_audio_path = os.path.join(temp_dir, 'temp_audio.wav')
    #         with open(temp_audio_path, 'wb') as temp_audio_file:
    #             temp_audio_file.write(audio_binary)
    #             res = process_wav_file(temp_audio_path)
    #             res["ok"] = True
    #             os.remove(temp_audio_path)
    #             return res
    # except Exception as e:
    #     return {"ok": False, "error": str(e)}


# result = model.transcribe(
#     "C:/Users/Sarwar/Desktop/SS/cse327-exam-ease/Neural-End/lol.wav")
# print(f' The text in video: \n {result["text"]}')
