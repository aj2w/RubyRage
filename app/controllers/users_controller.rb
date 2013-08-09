class UsersController < ApplicationController
  def new
    @user = User.new
  end

  # This is a POST and doesn't need a view
  # Instead it redirects or renders
  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to games_dashboard_path, notice: "Signed up!"
    else
      render "new"
    end
  end
end