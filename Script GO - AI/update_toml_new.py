content = """[build]
  base = "script-go-ai"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "https://rfxaquxinagsirmrvaaf.supabase.co"
  NEXT_PUBLIC_SITE_URL = "https://scriptgo-ai.netlify.app"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmeGFxdXhpbmFnc2lybXJ2YWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzI0MTYsImV4cCI6MjA4MzQ0ODQxNn0.RlvAjokcMqEzLwrHXc1WzDZP3wSVRxisrqz-KOamErM"
"""
with open("../netlify.toml", "w", encoding="utf-8") as f:
    f.write(content)
