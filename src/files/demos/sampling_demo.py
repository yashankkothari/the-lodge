from ollama_client import chat
prompt = [{"role": "user", "content": "Give a name for a data pipeline monitoring tool. Reply with the name only."}]
for temp in (0.0, 1.2):
    names = [chat(prompt, temperature=temp, seed=i, num_predict=12)["message"]["content"].strip() for i in range(4)]
    print(f"temperature={temp}:", " | ".join(names))
r = chat(prompt, temperature=0)
print(f"prompt tokens={r['prompt_eval_count']}  output tokens={r['eval_count']}")
