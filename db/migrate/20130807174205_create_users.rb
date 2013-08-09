class CreateUsers < ActiveRecord::Migration
  def up
    create_table :users do |t|
      t.string :username
      t.string :password
      t.string :password_hash
      t.string :password_salt
      t.datetime :last_seen
      t.boolean :is_admin
      t.timestamps
  end
end

  def down
    drop_table :users
  end
end
