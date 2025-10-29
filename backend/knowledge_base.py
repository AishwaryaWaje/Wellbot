import json

def load_knowledge_base(path="knowledge_base.json"):
    with open(path, "r") as f:
        return json.load(f)