import json, re
from  ollama import Client
from project_types import ModelResponse

class OllamaLLM():
    _MAX_TOKENS = 127000
    def __init__(self, 
            host='0.0.0.0', 
            port='11434', 
            model='gemma3:1b',
            temprature: float = 0.5,
            num_ctx: int = 7000):
        self._client = Client(host=f'{host}:{port}')
        self._model = model
        self._temprature = temprature
        self._num_ctx = num_ctx

    def get_model_json_response(self, prompt: str) -> str:
        try:
            # response = self._client.generate(
            #     model=self._model,
            #     messages=[{
            #         'role': 'user',
            #         'content': prompt
            #     }],
            #     options={
            #         'temperature': self._temprature,
            #         'num_ctx': self._num_ctx,
            #     },
            #     format='json'
            # )
            response = self._client.generate(
                model=self._model,
                prompt=prompt,
                # format='json'
                format=ModelResponse.model_json_schema()
            )

            response_content = response['response']
            try:
                json.loads(response_content)
                return response_content
            except json.JSONDecodeError:
                json_match = re.search(r'\{.*\}', response_content, re.DOTALL)
                if json_match:
                    try:
                        return json.loads(json_match.group())
                    except:
                        pass
                return json.dumps({"error": "Invalid JSON response from model"})

        except Exception as e:
            print(e)
            return json.dumps({"error": str(e)})