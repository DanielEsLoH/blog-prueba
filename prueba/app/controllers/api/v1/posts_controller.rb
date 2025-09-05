class Api::V1::PostsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy, :mine]
  before_action :set_post, only: [:show, :update, :destroy]

  # GET /api/v1/posts
  def index
    @posts = Post.includes(:user).order(created_at: :desc)
    render json: @posts.map { |p| serialize_post(p, comments_limit: 3) }
  end

  def mine
    @posts = current_user.posts.includes(:user).order(created_at: :desc)
    render json: @posts.map { |p| serialize_post(p, comments_limit: 3) }
  end

  # GET /api/v1/posts/:id
  def show
    render json: serialize_post(@post, comments_limit: :all)
  end

  # POST /api/v1/posts
  def create
    @post = current_user.posts.build(post_params)
    if @post.save
      @data = serialize_post(@post, comments_limit: :all)
      ActionCable.server.broadcast("posts_channel", { post: @data })
      render json: @data, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/posts/:id
  def update
    return render json: { error: "Not Authorized" }, status: :forbidden unless @post.user == current_user

    if @post.update(post_params)
      @data = serialize_post(@post, comments_limit: :all)
      ActionCable.server.broadcast("posts_channel", { post: @data })
      render json: @data, status: :ok
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/posts/:id
  def destroy
    if @post.destroy
      ActionCable.server.broadcast("posts_channel", { post_id: @post.id, deleted: true })
      render json: { message: "Post deleted" }, status: :ok
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :body)
  end

  def serialize_post(post, comments_limit: nil)
    comments =
      case comments_limit
      when :all
        post.comments.includes(:user).order(created_at: :desc)
      when Integer
        post.comments.includes(:user).order(created_at: :desc).limit(comments_limit)
      else
        []
      end

    {
      id: post.id,
      title: post.title,
      body: post.body,
      created_at: post.created_at,
      updated_at: post.updated_at,
      comments_count: post.comments_count,
      user: post.user && {
        id: post.user.id,
        email: post.user.email,
        name: post.user.name
      },
      comments: comments.map do |c|
        {
          id: c.id,
          body: c.body,
          created_at: c.created_at,
          user: c.user && {
            id: c.user.id,
            email: c.user.email,
            name: c.user.name
          }
        }
      end
    }
  end
end
