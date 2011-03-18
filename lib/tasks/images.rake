namespace :image do
  
  desc 'for each entry main image, generate header, stream_header and dreamfield_header'   
  task :main => :environment do      
    Entry.where(:main_image_id ^ nil).each do |entry|
      image = Image.find_by_id(entry.main_image.id)
      #image = entry.main_image
      puts "processing main images for (id: #{image.id}) #{image.title}.."
      
      puts 'header'
      image.generate_profile(:header, :format => 'jpg')
      puts 'stream'
      image.generate_profile(:stream_header, :format => 'jpg')
      puts 'dream field header'
      image.generate_profile(:dreamfield_header, :format => 'jpg')
      puts 'default thumb' 
      image.generate_profile(:thumb, :format => 'jpg')
          
      thumb_sizes = %w(64 120 122)
      puts 'extra thumbs:'
      options = {}
      thumb_sizes.each do |size|
        puts size
        options[:size] = size
        image.generate_profile(:thumb,options, :format => 'jpg')
      end
    end
    puts 'Done main images.'
  end
   
  desc 'for each avatar image, generate avatar_main, avatar_medium and most popular sizes (32/64)'  
  task :avatar => :environment do      
    Image.where(:title ^ 'Default Avatar',:section => 'Avatar').each do |image|
      puts "processing avatar images for (id: #{image.id}) #{image.title}.."
      
      puts 'avatar'
      image.generate_profile(:avatar, :format => 'jpg')        
      puts 'avatar main'
      image.generate_profile(:avatar_main, :format => 'jpg')
      puts 'avatar medium'
      image.generate_profile(:avatar_medium, :format => 'jpg')
      
      extra_sizes = %w(32x32 64x64)
      puts "Resizing #{image.title}:"
      extra_sizes.each do |size|
        puts size
        # image.resize size
        image.generate_profile(:avatar, :size => size, :format => 'jpg')
      end               
    end
    puts 'Done avatar images.'
  end        
    
  desc 'for each bedsheet generate a jpg'
  task :bedsheet => :environment do
    Image.where(:section => 'Bedsheets').each do |image|
      puts "processing bedsheet jpg (id: #{image.id}) #{image.title}.."
      image.generate_profile(:bedsheet, :format => 'jpg')
      puts 'default thumb' 
      image.generate_profile(:thumb, :format => 'jpg')
      puts 'thumb 120' 
      image.generate_profile(:thumb, :size => 120, :format => 'jpg')
    end
  end
  
  task :all => ['image:main','image:avatar','image:bedsheet']
  
end
