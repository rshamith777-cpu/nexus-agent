modules = ['fastapi', 'uvicorn', 'pydantic', 'httpx', 'websockets', 'pytest']
for m in modules:
    try:
        __import__(m)
        print(f"{m}: INSTALLED")
    except ImportError:
        print(f"{m}: MISSING")
