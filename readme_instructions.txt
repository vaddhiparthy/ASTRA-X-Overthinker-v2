ASTRA-X Overthinker v2 – Quick Instructions

1) Create and activate venv
   python -m venv .venv
   .venv\Scripts\Activate.ps1

2) Install deps
   pip install -r requirements.txt

3) Run server (port 8432)
   uvicorn app:app --host 0.0.0.0 --port 8432

4) Open UI
   http://localhost:8432/ui/overthinker.html

All private prompts and generated data are kept out of Git by .gitignore:
- prompts/
- data/
- config/
