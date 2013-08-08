class CreateStats < ActiveRecord::Migration
  def up
    create_table :stats do |t|
      t.string :times_played
      t.string :total_score
      t.belongs_to :user
      t.timestamps
    end
  end

  def down
    drop_table :stats
  end
end
