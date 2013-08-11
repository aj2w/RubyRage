class UsersController < ApplicationController
  skip_before_filter :update_last_seen, only: [:new, :create]

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      session[:user_id] = @user.id
      redirect_to games_dashboard_path, notice: "Signed up!"
    else
      flash[:notice] = "User exists."
      redirect_to new_session_path
    end
  end
end
