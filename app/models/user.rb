class User < ActiveRecord::Base
  include Amistad::FriendModel
  has_many :authentications
  has_many :dreams
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  #devise :database_authenticatable, :registerable,
  #       :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  #attr_accessible :email, :password, :password_confirmation, :remember_me

  attr_accessor :password, :password_confirmation
  before_save :encrypt_password
  validate :validate_password_confirmation
  
  def self.create_from_omniauth(omniauth)
    user = create!(
      :name => omniauth['user_info']['name'],
      :username => (omniauth['user_info']['nickname'] || omniauth['user_info']['name'].gsub(' ', '').downcase)
    )
    user.apply_omniauth!(omniauth)
    # user.image.create!(:url => omniauth['user_info']['image'])
  end

  def self.authenticate(auth_params)
    self.where(:email => auth_params[:email], :encrypted_password => sha1(auth_params[:password])).first
  end
  
  def apply_omniauth(omniauth)
    self.authentications.build(:provider => omniauth['provider'], :uid => omniauth['uid'])
    self
  end

  def apply_omniauth!(omniauth)
    self.apply_omniauth(omniauth).save!
  end
  
  def encrypted_password= *args
    raise "Can't set the encrypted password directly."
  end

protected
  def validate_password_confirmation
    if password && (password != password_confirmation)
      errors.add :password, "should match password confirmation"
    end
  end
  
  def encrypt_password
    if password
      self[:encrypted_password] = sha1(password)
    end
  end
end