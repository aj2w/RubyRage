class Stat < ActiveRecord::Base
  attr_accessible :times_played, :total_score, :user_id
  belongs_to :user

  # validates :text, :rating, presence: true
  # validates :rating, numericality: true

end