Rubyrage::Application.routes.draw do
 root :to => 'welcome#index'

 resources :users #CHANGE TO BE SPECIFIC

 get "log_out" => "sessions#destroy", as: "log_out"
 get '/sessions/recentsessions' => 'sessions#recentsessions'
 resources :sessions #CHANGE TO BE SPECIFIC

 get '/games/dashboard' => 'games#dashboard'
 get '/games/single' => 'games#single'
 get '/games/multi/requestbattle' => 'games#requestBattle', as: "requestbattle"
 get '/games/multi/:username' => 'games#multi', as: "games_multi"
 get '/games/pusher' => 'games#pusher'
 post '/games/gameBroadcast' => 'games#gameBroadcast'

 end
