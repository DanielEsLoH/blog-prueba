class Api::V1::Auth::RegistrationsController < ApplicationController
  def create
    user = User.new(user_params)
    if user.save
      token = JsonWebToken.encode({ sub: user.id })
      render json: {
        user: user.slice(:id, :email, :name),
        token: token
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name)
  end
end
