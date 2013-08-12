
// Enable pusher logging - don't include this in production
// Pusher.log = function(message) {
//   if (window.console && window.console.log) {
//     window.console.log(message);
//   }
// };

//////////////////////////////////////////////////////////////////////////////
// DEFINE USER'S CHANNELS
//////////////////////////////////////////////////////////////////////////////
// 'http://d09eb96f1aef0dea4b31:57d70f45d23770529a1e@api.pusherapp.com/apps/51516'
var pusher;
var usernameWithNoSpaces;
var myOwnChannel;
var commonChannel;
var opponentChannelName;
var commonChannelName;

establishMyOwnChannel(); //defined usernamewithnospaces
establishCommonChannel();

myOwnChannel.bind('gamebroadcast', function(rawGameboardData) {
  var atOpponentGameboard = rubyRageBattleMode.returnCtxOpponentGameboard();
  var atOpponentPreview = rubyRageBattleMode.returnCtxOpponentPreview();
  var reassembledGameboard = rubyRageBattleMode.reassembleTwoDimArray(rawGameboardData.mySittingRubymonsPosition);
  var reassembledCurrentRubyBox = rubyRageBattleMode.reassembleTwoDimArray(rawGameboardData.myFallingRubymonsPosition);
  var reassembledUpcomingRubymonPair = _.map(rawGameboardData.myUpcomingRubymonPair,
    function(string) {
      return parseInt(string);
    }
  );
  var myCurrentXposition = parseInt(rawGameboardData.myCurrentXposition);
  var myCurrentYposition = parseInt(rawGameboardData.myCurrentYposition);
  rubyRageBattleMode.paintOverOpponents( atOpponentGameboard, atOpponentPreview);
  rubyRageBattleMode.renderOpponentsSittingRubymons( reassembledGameboard, atOpponentGameboard);
  rubyRageBattleMode.renderOpponentsFallingRubymons( reassembledCurrentRubyBox , atOpponentGameboard, myCurrentXposition, myCurrentYposition);
  rubyRageBattleMode.renderOpponentsNextRubymons( reassembledUpcomingRubymonPair, atOpponentPreview);
});

myOwnChannel.bind('promptRequestPopup', function(data) {
  var response = confirm(data.message);
  var battleGameUrl = '/games/multi/' + data.challengerChannelName;
  var redirectCommand = "window.location.href = '" + battleGameUrl + "';"
  if (response == true) {
    setTimeout(redirectCommand, 50);
    challengeResponse(true, data.challengerChannelName);
  } else {
    challengeResponse(false, data.challengerChannelName);
  }
});

myOwnChannel.bind('challengeResponse', function(data) {
  alert(data.message);
  if (data.responseToChallenge === "true") {
    triggerBattleGame(data.opponentChannelName);
  } else {
    window.location.replace('/games/dashboard');
  }
});

// commonChannel.bind('startCountdownAndGo'), function(data) {
//   startCountdownAndGo();
// }

myOwnChannel.bind('startCountdownAndGo', function(data) {
  startCountdownAndGo();
});

//////////////////////////////////////////////////////////////////////////////
// BATTLE RELATED EVENTS & FUNCTIONS
//////////////////////////////////////////////////////////////////////////////

function startSendingRequest() {
  $.ajax({
    url: "/games/gamebroadcast",
    type: "post",
    dataType: "json",
    data: {"opponentChannelName": opponentChannelName,
           "mySittingRubymonsPosition": gameboardInplay,
           "myFallingRubymonsPosition": currentRubyBox,
           "myCurrentXposition": currentX,
           "myCurrentYposition": currentY,
           "myUpcomingRubymonPair": rubymonPairsPreset[runningRubymonIndex]}
  })
}

function requestBattle(targetPlayerUsername, usernameWithNoSpaces) {
  $.ajax({
    url: "/games/multi/requestBattle",
    type: "post",
    dataType: "json",
    data: {"opponentChannelName": targetPlayerUsername,
           "challengerChannelName": usernameWithNoSpaces}
  })
}

function challengeResponse(answer, challengerUsername) {
  $.ajax({
    url: "/games/multi/challengeResponse",
    type: "post",
    dataType: "json",
    data: {"opponentChannelName": challengerUsername,
           "responseToChallenge": answer}
  })
}

function establishOpponentChannel() {
  var rawOpponentChannelName = $('#channel-name').text();
  opponentChannelName = rawOpponentChannelName.replace(/^\s+|\s+$/g, "");
}

function establishMyOwnChannel() {
  var pusher = new Pusher('d09eb96f1aef0dea4b31');
  var username = $('.menubar_user').text();
  usernameWithNoSpaces = this.username.replace(/^\s+|\s+$/g, "");
  myOwnChannel = this.pusher.subscribe(usernameWithNoSpaces);
}

function establishCommonChannel() {
  establishOpponentChannel();
  if (opponentChannelName < usernameWithNoSpaces) {
    commonChannelName = opponentChannelName + "_" + usernameWithNoSpaces;
  } else {
    commonChannelName = usernameWithNoSpaces + "_" + opponentChannelName;
  }
  commonChannel = pusher.subscribe(commonChannelName);
}

function triggerBattleGame(targetPlayerUsername) {
  $.ajax({
    url: "/games/multi/triggerBattleGame",
    type: "post",
    dataType: "json",
    // data: {"commonChannelName": commonChannelName}
    data: {"opponentChannelName": targetPlayerUsername,
           "myOwnChannelName": usernameWithNoSpaces}
  })
}

function startCountdownAndGo() {
  setInterval(startSendingRequest, 300);
  newGame();
  setInterval( renderAll, 30 );
}


