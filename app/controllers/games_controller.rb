class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
  end

  def pusher
    Pusher['test_channel'].trigger('my_event', {
      message: 'hello world'
    })
  end

end