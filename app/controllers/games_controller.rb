class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
    # binding.pry
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

  def requestBattle
    opponentChannelName = params[:opponentChannelName]
    challengerChannelName = params[:challengerChannelName]
    Pusher[opponentChannelName].trigger('promptRequestPopup', {
      message: "#{@current_user.username} has requested a battle with you!",
      challengerChannelName: challengerChannelName
      })
  end

end



