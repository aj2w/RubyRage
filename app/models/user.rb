class User < ActiveRecord::Base
  attr_accessor :password
  before_save :encrypt_password

  attr_accessible :username, :password, :password_confirmation, :is_admin
  has_one :stat

  validates :password, confirmation: true
  validates :password, presence: true, on: :create
  validates :username, presence: true
  validates :username, uniqueness: true

  def encrypt_password
    if password.present?
      # This generates a random string that helps me encrypt the password
      self.password_salt = BCrypt::Engine.generate_salt

      # This encrypts the password, using the salt we just created
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  # I can call this with User.authenticate(l,p)
  def self.authenticate(username, password)
    # This will auth a user
    user = User.find_by_username(username)
    if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end
end
