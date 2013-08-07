Rubyrage::Application.routes.draw do
 root :to => 'welcome#index'
 resources :users #CHANGE
  get "log_out" => "sessions#destroy", as: "log_out"
 resources :sessions #CHANGE
 get '/games/dashboard' => 'games#dashboard'

 end
