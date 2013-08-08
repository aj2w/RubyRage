Rubyrage::Application.routes.draw do
 root :to => 'welcome#index'

 resources :users #CHANGE TO BE SPECIFIC

 get "log_out" => "sessions#destroy", as: "log_out"
 resources :sessions #CHANGE TO BE SPECIFIC

 get '/games/dashboard' => 'games#dashboard'
 get '/games/single' => 'games#single'
 get '/games/multi' => 'games#multi'

 end
