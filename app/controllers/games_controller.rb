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

  def gamebroadcast
    opponentChannelName       = params[:opponentChannelName]
    mySittingRubymonsPosition = params[:mySittingRubymonsPosition].values
    myFallingRubymonsPosition = params[:myFallingRubymonsPosition].values
    myCurrentXposition        = params[:myCurrentXposition]
    myCurrentYposition        = params[:myCurrentYposition]
    myUpcomingRubymonPair     = params[:myUpcomingRubymonPair]

    respond_to do |format|
      # format.html
      json_response = Pusher[opponentChannelName].trigger('gamebroadcast', {
        mySittingRubymonsPosition: mySittingRubymonsPosition,
        myFallingRubymonsPosition: myFallingRubymonsPosition,
        myCurrentXposition: myCurrentXposition,
        myCurrentYposition: myCurrentYposition,
        myUpcomingRubymonPair: myUpcomingRubymonPair
      })
      format.json { render :json => json_response }
    end

    # opponentChannelName = params[:opponentChannelName]
    # mySittingRubymonsPosition = params[:mySittingRubymonsPosition].values
    # myFallingRubymonsPosition = params[:myFallingRubymonsPosition].values
    # myCurrentXposition        = params[:myCurrentXposition]
    # myCurrentYposition        = params[:myCurrentYposition]
    # myUpcomingRubymonPair     = params[:myUpcomingRubymonPair]
    # Pusher[opponentChannelName].trigger('gamebroadcast', {
    #   mySittingRubymonsPosition: mySittingRubymonsPosition,
    #   myFallingRubymonsPosition: myFallingRubymonsPosition,
    #   myCurrentXposition: myCurrentXposition,
    #   myCurrentYposition: myCurrentYposition,
    #   myUpcomingRubymonPair: myUpcomingRubymonPair
    #   })

  end


  def requestBattle
    opponentChannelName = params[:opponentChannelName]
    challengerChannelName = params[:challengerChannelName]

    respond_to do |format|
      json_response = Pusher[opponentChannelName].trigger('promptRequestPopup', {
        message: "#{@current_user.username} has requested a battle with you!",
        challengerChannelName: @current_user.username
      })
      format.json { render :json => json_response }
    end
  end

  def challengeResponse
    opponentChannelName = params[:opponentChannelName]
    responseToChallenge = params[:responseToChallenge]
    if responseToChallenge == "true"
      messageToChallenger = "'#{@current_user.username}' has accepted your challenge! \nClick 'Ok' to start the countdown."
    else
      messageToChallenger = "'#{@current_user.username}' has rejected your challenge. \nClick 'Ok' to go back to dashboard."
    end

    respond_to do |format|
      json_response = Pusher[opponentChannelName].trigger('challengeResponse', {
      message: messageToChallenger,
      responseToChallenge: responseToChallenge,
      opponentChannelName: @current_user.username
      })
      format.json { render :json => json_response }
    end
  end

  def triggerBattleGame
    myOwnChannelName = params[:myOwnChannelName]
    opponentChannelName = params[:opponentChannelName]

    respond_to do |format|
      json_response_one = Pusher[myOwnChannelName].trigger('startCountdownAndGo', {message: "Start game!"})
      json_response_two = Pusher[opponentChannelName].trigger('startCountdownAndGo', {message: "Start game!"})
      json_response_total = { :json_response_one => json_response_one, :json_response_two => json_response_two }
      format.json { render :json => json_response_total }
    end
  end

end
