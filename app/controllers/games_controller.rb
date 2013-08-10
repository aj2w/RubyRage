class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
    @channelname = params[:username]
  end

  def pusher
    Pusher[params[:username]].trigger('my_event', {
      message: 'hello world'
    })
  end

  def gameBroadcast
    opponentChannelName = params[:opponentChannelName]
    mySittingRubymonsPosition = params[:mySittingRubymonsPosition].values
    myFallingRubymonsPosition = params[:myFallingRubymonsPosition].values
    myCurrentXposition        = params[:myCurrentXposition]
    myCurrentYposition        = params[:myCurrentYposition]
    myUpcomingRubymonPair     = params[:myUpcomingRubymonPair]
    Pusher[opponentChannelName].trigger('gameBroadcast', {
      mySittingRubymonsPosition: mySittingRubymonsPosition,
      myFallingRubymonsPosition: myFallingRubymonsPosition,
      myCurrentXposition: myCurrentXposition,
      myCurrentYposition: myCurrentYposition,
      myUpcomingRubymonPair: myUpcomingRubymonPair
      })
  end
end



