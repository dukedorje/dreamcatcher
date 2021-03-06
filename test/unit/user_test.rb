require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "follow" do
    geo = User.make
    eph = User.make
    phong = User.make
    eph.following << geo

    assert eph.following == [geo]
    assert eph.following?(geo)

    assert geo.followers == [eph]
    assert geo.followed_by?(eph)

    assert eph.followers.empty?
    assert geo.following.empty?
    assert !eph.friends_with?(geo)
    assert !geo.friends_with?(eph)
    
    phong.following << geo
    geo.reload
    assert geo.followers == [eph, phong]
    assert geo.followed_by?(phong)
    assert phong.following?(geo)
    assert !phong.following?(eph)
    assert geo.followed_by?(eph)
  end
  
  test 'friend' do
    geo = User.make
    eph = User.make
    phong = User.make
    geo.following << eph
    geo.following << phong
    geo.followers << eph
    [geo, eph, phong].map(&:reload)
    
    assert eph.friends_with?(geo)
    assert geo.friends_with?(eph)
    assert !geo.friends_with?(phong)

    assert geo.friends.include?(eph)
    assert !geo.friends.include?(phong)
  end
  
  test 'relationship with' do
    phong = User.make
    geo = User.make
    
    assert_equal phong.relationship_with(geo), :none
    
    phong.following << geo
    [phong, geo].map(&:reload)
    assert_equal phong.relationship_with(geo), :following
    assert_equal geo.relationship_with(phong), :followed_by
    
    geo.following << phong
    [phong, geo].map(&:reload)
    assert_equal phong.relationship_with(geo), :friends
    assert_equal geo.relationship_with(phong), :friends
    
  end

  test "validate_password_confirmation" do
    assert_raise(ActiveRecord::RecordInvalid) { User.make(password: 'pw1', password_confirmation: 'pw2') }
    
    user = User.make
    user.password_confirmation = 'notpassword'
    assert !user.save
    user.password_confirmation = PW
    assert user.save

    user = User.make
    user.old_password = 'notpassword'
    user.password = user.password_confirmation = 'newpass'
    assert !user.save

    user = User.make
    user.old_password = PW
    user.password = user.password_confirmation = 'newpass'
    assert_equal sha1(user.old_password), user.encrypted_password
    assert user.save
    assert_equal sha1('newpass'), user.encrypted_password
    
  end

  test "create_with_omniauth" do
    omniauth = {
      'provider' => 'facebook',
      'uid' => '123456',
      'user_info' => {
        'name' => 'Phong',
        'nickname' => 'phonger'
      }
    }
  end

  test "valid username" do
    user = User.make  

    user.username = 'phong@feh'
    assert_equal false, user.valid?
    user.username = 'spaced phong'
    assert_equal false, user.valid?
    user.username = 'phong.ness'
    assert_equal false, user.valid?  
    user.username = '***_-phongness-_***'
    assert_equal true, user.valid?
  end  
  
end
