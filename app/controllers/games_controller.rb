class GamesController < ApplicationController

  def dashboard
  end

  def single
  end

  def multi
    @channelname = params[:username]
  end

  # def pusher
  #   Pusher[params[:username]].trigger('my_event', {
  #     message: 'hello world'
  #   })
  # end

  def multi.gamebroadcast
    opponentChannelName = params[:opponentChannelName]
    mySittingRubymonsPosition = params[:mySittingRubymonsPosition].values
    myFallingRubymonsPosition = params[:myFallingRubymonsPosition].values
    myCurrentXposition        = params[:myCurrentXposition]
    myCurrentYposition        = params[:myCurrentYposition]
    myUpcomingRubymonPair     = params[:myUpcomingRubymonPair]
    Pusher[opponentChannelName].trigger('gamebroadcast', {
      mySittingRubymonsPosition: mySittingRubymonsPosition,
      myFallingRubymonsPosition: myFallingRubymonsPosition,
      myCurrentXposition: myCurrentXposition,
      myCurrentYposition: myCurrentYposition,
      myUpcomingRubymonPair: myUpcomingRubymonPair
      })
  end

  def 'multi/requestBattle'
    opponentChannelName = params[:opponentChannelName]
    challengerChannelName = params[:challengerChannelName]
    Pusher[opponentChannelName].trigger('promptRequestPopup', {
      message: "#{@current_user.username} has requested a battle with you!",
      challengerChannelName: challengerChannelName
      })
  end

  def challengeResponse
    opponentChannelName = params[:opponentChannelName]
    responseToChallenge = params[:responseToChallenge]
    if responseToChallenge == "true"
      messageToChallenger = "'#{@current_user.username}' has accepted your challenge! \nClick 'Ok' to start the countdown."
    else
      messageToChallenger = "'#{@current_user.username}' has rejected your challenge. \nClick 'Ok' to go back to dashboard."
    end
    Pusher[opponentChannelName].trigger('challengeResponse', {
      message: messageToChallenger,
      responseToChallenge: responseToChallenge,
      opponentChannelName: @current_user.username
      })
  end

  def triggerBattleGame
    # commonChannelName = params[:commonChannelName]
    myOwnChannelName = params[:myOwnChannelName]
    opponentChannelName = params[:opponentChannelName]
    binding.pry
    Pusher[myOwnChannelName].trigger('startCountdownAndGo', {message: "Start game!"})
    Pusher[opponentChannelName].trigger('startCountdownAndGo', {message: "Start game!"})
  end

end



