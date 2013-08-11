class SessionsController < ApplicationController
  skip_before_filter :update_last_seen, only: [:new, :create]

  def new
  end

  def create
    user = User.authenticate(params[:username], params[:password])
    if user
      session[:user_id] = user.id
      redirect_to games_dashboard_path, alert: "Login successful"
    else
      flash.now.alert = "Invalid username or password"
      render "new"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url, alert: "Logged out"
  end

  def recentsessions
  end

end