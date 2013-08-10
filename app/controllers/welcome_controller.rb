class WelcomeController < ApplicationController
  skip_before_filter :update_last_seen, only: [:index]

  def index
  end

end