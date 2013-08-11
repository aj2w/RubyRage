Rubyrage::Application.routes.draw do
 root :to => 'welcome#index'

 resources :users #CHANGE TO BE SPECIFIC

 get "log_out" => "sessions#destroy", as: "log_out"
 get '/sessions/recentsessions' => 'sessions#recentsessions'
 resources :sessions #CHANGE TO BE SPECIFIC

 get '/games/dashboard' => 'games#dashboard'
 get '/games/single' => 'games#single'
 post '/games/gamebroadcast' => 'games#gamebroadcast'
 post '/games/multi/triggerBattleGame' => 'games#triggerBattleGame', as: "triggerBattleGame"
 post '/games/multi/requestBattle' => 'games#requestBattle', as: "requestbattle"
 post '/games/multi/challengeResponse' => 'games#challengeResponse', as: "challengeResponse"
 get '/games/multi/:username' => 'games#multi', as: "games_multi"
 get '/games/pusher' => 'games#pusher'

 end
