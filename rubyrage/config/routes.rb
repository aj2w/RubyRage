Rubyrage::Application.routes.draw do
 root :to => 'welcome#index'
 resources :users # change to just show the route needed

 end
