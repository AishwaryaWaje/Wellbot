
from googletrans import Translator

class TranslationService:
    def __init__(self):
        self.translator = Translator()

    def translate_text(self, text, dest_lang):
        try:
            result = self.translator.translate(text, dest=dest_lang)
            return result.text
        except Exception:
            return text

    def translate_response(self, text, dest_lang):
        return self.translate_text(text, dest_lang)

translator = TranslationService()
