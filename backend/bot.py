import random
from knowledge_base import load_knowledge_base
from translator import translator

knowledge_base = load_knowledge_base()

phrases_dict = {
    "greetings": {
        "keywords": ["hi", "hieee", "hello", "hey", "good morning", "good evening", "good afternoon", "what's up", "howdy"],
        "responses": [
            "Hello! How are you feeling today?",
            "Hi there! Tell me how your health is doing.",
            "Hey! How can I help you with your wellness?"
        ]
    },
    "thanks": {
        "keywords": ["thank you", "thanks", "thx", "thank u", "ty", "much appreciated", "grateful", "thanks a lot", "thnx"],
        "responses": ["You're most welcome! 😊", "Glad I could help!", "Take care and stay healthy!"]
    },
    "okay": {
        "keywords": ["ok", "okay", "fine", "alright"],
        "responses": [
            "Okay, got it!",
            "Alright, tell me more about how you feel.",
            "Sure! What would you like to discuss next?"
        ]
    }
}

LANG_NAME_TO_CODE = {
    "english": "en",
    "hindi": "hi"
}

conversation_context = {}


def wellness_response(message, language="English", user_id=None):
    lang_code = LANG_NAME_TO_CODE.get(language.lower(), "en")

    english_message = message
    if lang_code != "en":
        english_message = translator.translate_text(message, "en")
    english_message = english_message.lower().strip()

    for phrase_type in ["greetings", "thanks", "okay"]:
        keywords = phrases_dict[phrase_type]["keywords"]
        responses = phrases_dict[phrase_type]["responses"]
        if any(word in english_message for word in keywords):
            return translator.translate_response(random.choice(responses), lang_code)

    matched_conditions = []
    for condition, info in knowledge_base.items():
        if condition in english_message:
            matched_conditions.append(condition)

    if matched_conditions:
        combined_response = []
        for condition in matched_conditions:
            info = knowledge_base.get(condition)
            if info:
                section = f"It seems like you might be experiencing {condition.capitalize()}.\nHere’s some advice that may help:\n"
                for advice in info.get("advice", []):
                    section += f"- {advice}\n"
                combined_response.append(section)

        final_message = "\n".join(combined_response)
        return translator.translate_response(final_message.strip(), lang_code)

    if user_id in conversation_context and conversation_context[user_id].get("symptom"):
        symptom = conversation_context[user_id]["symptom"]
        info = knowledge_base.get(symptom)
        if info:
            followup = (
                f"It seems like you might be experiencing {symptom}. "
                f"Here’s some advice that may help:\n" +
                "\n".join(f"- {a}" for a in info.get("advice", []))
            )
            conversation_context.pop(user_id, None)
            return translator.translate_response(followup, lang_code)

    for condition, info in knowledge_base.items():
        if condition in english_message:
            conversation_context[user_id] = {"symptom": condition}
            question = f"I see you mentioned {condition}. How are you feeling right now? Are your {', '.join(info['symptoms'][:2])} severe?"
            return translator.translate_response(question, lang_code)

    non_health_responses = [
        "I can help you with health-related queries. Please tell me about your symptoms.",
        "Please ask me something related to your health or wellness.",
        "I'm designed to help with health concerns — could you share how you're feeling?"
    ]
    return translator.translate_response(random.choice(non_health_responses), lang_code)
