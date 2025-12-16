const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{thread_id}/comments",
    handler: handler.postAddCommentHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{thread_id}/comments/{comment_id}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "PUT",
    path: "/threads/{thread_id}/comments/{comment_id}/likes",
    handler: handler.putCommentLikeHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

module.exports = routes;
