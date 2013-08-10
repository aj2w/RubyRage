Rubyrage::Application.routes.draw do
 root :to => 'welcome#index'

 resources :users

 get "log_out" => "sessions#destroy", as: "log_out"
 get '/sessions/recentsessions' => 'sessions#recentsessions'
 resources :sessions

 get '/games/dashboard' => 'games#dashboard'
 get '/games/single' => 'games#single'
 post '/games/multi/requestBattle' => 'games#requestBattle', as: "requestbattle"
 get '/games/multi/:username' => 'games#multi', as: "games_multi"
 get '/games/pusher' => 'games#pusher'
 post '/games/gameBroadcast' => 'games#gameBroadcast'

 end
