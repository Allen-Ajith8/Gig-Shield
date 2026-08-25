from slowapi import Limiter
from slowapi.util import get_remote_address

# Use the client's IP address as the identifier for rate limiting
limiter = Limiter(key_func=get_remote_address)
