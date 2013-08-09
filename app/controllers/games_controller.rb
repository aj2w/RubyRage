class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
    @channelname = params[:username]
    # @opponent = params[:username]
  end

  def pusher
    Pusher[params[:username]].trigger('my_event', {
      message: 'hello world'
      })
  end
end

