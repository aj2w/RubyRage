class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
    # binding.pry
  end

  def pusher
    Pusher['thomas'].trigger('my_event', {
      message: 'hello world'
    })
  end
end

