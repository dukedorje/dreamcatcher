# config valid only for current version of Capistrano
lock '3.4.0'

set :application, "dreamcatcher"

# set :scm, :git
# set :repo_url,  "git@107.170.229.217:dreamcatcher.git"
set :repo_url, "git@github.com:dukejones/dreamcatcher.git"

# set :deploy_via, :remote_cache
set :branch, "master"
set :scm_verbose, true

set :keep_releases, 5

# set :default_stage, "theta"
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
# set :deploy_to, '/var/www/my_app_name'
# set :log_level, :debug
# set :pty, true

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'tmp/puma' 'vendor/bundle', 'public/system', 'public/imagebank', 'public/imagebank-cache', 'public/pdfs')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end

### old ###

# set :stages, %w(theta production)

set :whenever_command, "bundle exec whenever"
require 'whenever/capistrano'


# may help with ubuntu ssh
# ssh_options[:paranoid] = false
# default_run_options[:pty] = true


# before "deploy:symlink", "uploads:symlink"
# before "deploy:restart", "compile:assets"
# before "deploy:restart", "compile:jmvc"
# before "deploy:symlink", "barista:brew"
# before "deploy:symlink", "memcached:restart"

# task :tail_log, :roles => :app do
#   run "tail -f #{shared_path}/log/#{rails_env}.log"
# end
