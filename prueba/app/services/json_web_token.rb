class JsonWebToken
  ALGO = 'HS256'

  def self.secret_key
    Rails.application.credentials.jwt_secret || ENV.fetch("JWT_SECRET")
  end

  def self.encode(payload, exp = 60.minutes.from_now)
    payload = payload.dup
    payload[:exp] = exp.to_i
    JWT.encode(payload, secret_key, ALGO)
  end

  def self.decode(token)
    body, = JWT.decode(token, secret_key, true, { algorithm: ALGO })
    HashWithIndifferentAccess.new(body)
  rescue JWT::ExpiredSignature
    raise JWT::ExpiredSignature, "Token has expired"
  rescue JWT::DecodeError
    raise JWT::DecodeError, "Invalid token"
  end
end