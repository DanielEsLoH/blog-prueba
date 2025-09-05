class Api::V1::Auth::SessionsController < ApplicationController
  before_action :authenticate_user!, only: [:me]

  # Login
  def create
    user = User.find_by(email: params[:email]&.downcase)
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode({ sub: user.id })
      render json: {
        user: user.slice(:id, :email, :name),
        token: token
      }, status: :ok
    else
      render json: { error: "Correo o contraseña incorrectos" }, status: :unauthorized
    end
  end

  # User Authenticated
  def me
    render json: { user: current_user.slice(:id, :email, :name) }, status: :ok
  end
end
