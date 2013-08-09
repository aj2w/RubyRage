class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
  end

  def pusher
    datasent = params[:note]
    Pusher['rubyrage_thomas'].trigger('my_event', { message: "#{datasent}" })
  end

  def gameBroadcast
    mySittingRubymonsPosition = params[:mySittingRubymonsPosition].values
    Pusher['rubyrage_thomas'].trigger('gameBroadcast', mySittingRubymonsPosition)
  end

end


