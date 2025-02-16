# Vault configuration for secret rotation
path "secret/data/zillow-ai-concierge" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

resource "vault_mount" "kv_v2" {
  path        = "secret"
  type        = "kv-v2"
  description = "KV Version 2 secret engine for Zillow AI Concierge"
}

resource "vault_secret" "unsplash_keys" {
  path = "secret/zillow-ai-concierge/unsplash"
  
  data_json = jsonencode({
    access_key = "rotated_access_key",
    secret_key = "rotated_secret_key"
  })
} 