class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def authenticate_user!
    header = request.headers["Authorization"]
    token  = header.split.last if header.present?

    unless token
      return render json: { error: "Falta token (Authorization: Bearer ...)" }, status: :unauthorized
    end

    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:sub]) # subject = user id
    rescue JWT::ExpiredSignature, JWT::DecodeError => e
      render json: { error: e.message }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def render_not_found
    render json: { error: "No encontrado" }, status: :not_found
  end
end
