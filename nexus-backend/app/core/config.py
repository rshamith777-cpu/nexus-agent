import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "NEXUS Mission Control"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEFAULT_MODE: str = os.getenv("DEFAULT_MODE", "DEMO") # "DEMO" or "LIVE"
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # External API Keys (Optional - fallbacks to high-fidelity demo mocks when missing)
    GOOGLE_CALENDAR_CREDENTIALS_JSON: str = os.getenv("GOOGLE_CALENDAR_CREDENTIALS_JSON", "")
    GMAIL_CREDENTIALS_JSON: str = os.getenv("GMAIL_CREDENTIALS_JSON", "")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    SLACK_WEBHOOK_URL: str = os.getenv("SLACK_WEBHOOK_URL", "")
    SLACK_BOT_TOKEN: str = os.getenv("SLACK_BOT_TOKEN", "")
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "")
    
    # Storage Paths
    ARTIFACTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "artifacts")

settings = Settings()

os.makedirs(settings.ARTIFACTS_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.ARTIFACTS_DIR, "briefings"), exist_ok=True)
