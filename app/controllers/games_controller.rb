class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
  end

  def pusher
    Pusher['rubyrage_thomas'].trigger('my_event', { message: 'hello world' })
  end

  def startBroadcasting
    Pusher['rubyrage_thomas'].trigger('broadcasting', {
      message: 'start broadcasting game data'
    })
  end

end

