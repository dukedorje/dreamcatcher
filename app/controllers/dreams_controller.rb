class DreamsController < ApplicationController
  before_filter :require_user
  
  def index
    if params[:username]
      @user = User.find_by_username(params[:username])
      redirect_to :root, :alert => "user #{params[:username]} does not exist." and return unless @user
    else
      @user = current_user
    end

    @dreams = @user.dreams
    
    add_starlight @user, 1 if unique_hit?
  end

  def show
    @dream = Dream.find params[:id]

    if unique_hit?
      add_starlight @dream, 1
      add_starlight current_user, 1
    end
  end
  
  def new
    @dream = Dream.new
  end

  def create
    new_dream = current_user.dreams.create!(params[:dream])
    redirect_to dream_path(new_dream)
  end
end
