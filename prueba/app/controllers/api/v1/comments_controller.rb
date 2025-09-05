class Api::V1::CommentsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]
  before_action :set_post

  # GET /api/v1/posts/:post_id/comments
  def index
    @comments = @post.comments.includes(:user).order(created_at: :desc)
    render json: @comments.map { |c| serialize_comment(c) }
  end

  # POST /api/v1/posts/:post_id/comments
  def create
    @comment = @post.comments.build(comment_params.merge(user: current_user))
    if @comment.save
      ActionCable.server.broadcast("posts_channel", { post: serialize_post(@post, comments_limit: :all) })
      render json: serialize_comment(@comment), status: :created
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/posts/:post_id/comments/:id
  def destroy
    @comment = @post.comments.find(params[:id])
    return render json: { error: 'Not authorized' }, status: :forbidden unless @comment.user == current_user
    @comment.destroy
    ActionCable.server.broadcast("posts_channel", { post: serialize_post(@post, comments_limit: :all) })

    head :no_content
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def comment_params
    params.require(:comment).permit(:body)
  end

  def serialize_comment(comment)
    {
      id: comment.id,
      body: comment.body,
      created_at: comment.created_at,
      user: comment.user && {
        id: comment.user.id,
        email: comment.user.email,
        name: comment.user.name
      },
    }
  end

  def serialize_post(post, comments_limit: nil)
    comments = 
      case comments_limit
      when :all
        post.comments.includes(:user).order(created_at: :desc)
      when Integer
        post.comments.includes(:user).order(created_at: :desc)
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
            },
          }
        end
      }
  end
end