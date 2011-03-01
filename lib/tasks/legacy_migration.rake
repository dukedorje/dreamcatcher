namespace :legacy do
  namespace :data do
    desc "import all data from legacy schema"
    task :import => :environment do
      Rake::Task['legacy:data:import:images'].invoke
      Rake::Task['legacy:data:import:users'].invoke
      Rake::Task['legacy:data:import:images_second_pass'].invoke
      Rake::Task['legacy:data:import:dreams'].invoke
      Rake::Task['legacy:data:import:dream_images'].invoke
      Rake::Task['legacy:data:import:comments'].invoke
      Rake::Task['legacy:data:import:emotions'].invoke
      Rake::Task['legacy:data:import:environment_series'].invoke
      Rake::Task['legacy:data:import:user_locations'].invoke
      Rake::Task['legacy:data:import:countries'].invoke
      Rake::Task['legacy:data:import:people'].invoke
    end
    namespace :import do
      task :images do
        Migration::ImageImporter.migrate_all
      end
      task :users => [:images] do
        Migration::UserImporter.migrate_all
      end
      task :images_second_pass => [:users, :images] do
        Legacy::Image.valid.each do |legacy_image|
          image = legacy_image.corresponding_object
          image.uploaded_by = legacy_image.user.corresponding_object
          image.save!
        end
      end
      task :dreams => [:environment, :images, :users] do
        Migration::DreamImporter.migrate_all
      end
      task :dream_images => [:environment] do
        Legacy::DreamImage.all.each do |dream_image|
          next unless dream_image.image._?.valid?

          image = dream_image.image._?.corresponding_object
          puts "Image does not exist!  #{dream_image.image._?.title}  for dream #{dream_image.dream._?.title}" unless image

          entry = dream_image.dream._?.corresponding_object
          puts "Entry does not exist!  #{dream_image.dream._?.title}" unless entry
          

          entry.images << image
        end
      end
      task :comments => [:dreams, :users] do
        Migration::CommentImporter.migrate_all
      end
      task :emotions => [:dreams] do
        Migration::EmotionImporter.migrate_all
      end
      task :emotion_tags => [:dreams, :emotions] do
        Migration::EmotionTagImporter.migrate_all
      end
      task :environment_series => [:dreams] do
        Migration::EnvironmentSeriesImporter.migrate_all
      end
      task :user_locations => [:environment, :users] do
        Migration::UserLocationImporter.migrate_all
      end
      task :countries => :environment do
        Migration::CountryImporter.migrate_all
      end
      task :people => [:environment, :users, :dreams] do
        Migration::PersonImporter.migrate_all
      end
    end
  end
end