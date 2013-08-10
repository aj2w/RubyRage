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
    myFallingRubymonsPosition = params[:myFallingRubymonsPosition].values
    myCurrentXposition        = params[:myCurrentXposition]
    myCurrentYposition        = params[:myCurrentYposition]
    myUpcomingRubymonPair     = params[:myUpcomingRubymonPair]
    # binding.pry
    Pusher['rubyrage_thomas'].trigger('gameBroadcast', {
      mySittingRubymonsPosition: mySittingRubymonsPosition,
      myFallingRubymonsPosition: myFallingRubymonsPosition,
      myCurrentXposition: myCurrentXposition,
      myCurrentYposition: myCurrentYposition,
      myUpcomingRubymonPair: myUpcomingRubymonPair
      })
  end

end


