class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :current_user
  before_filter :update_last_seen

  private
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def update_last_seen
    # if @current_user == true
      @current_user.last_seen = DateTime.now
      @current_user.save
      # Below needs to be changed to 5 minutes or so in production
      @online_users = User.where("last_seen > ?",120.minutes.ago.to_s(:db))

  end

  def admin
    if @current_user.is_admin == true
      @admin = @current_user
    end
  end

  def require_login
    unless logged_in?
      flash[:error] = "You must be logged in to access this section"
      redirect_to root_path # halts request cycle
    end
  end
end
