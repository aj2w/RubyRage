Rubyrage::Application.routes.draw do
 root :to => 'welcome#index'
 resources :users #CHANGE
 resources :sessions #CHANGE

 end
