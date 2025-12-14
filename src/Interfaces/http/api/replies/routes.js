const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{thread_id}/comments/{comment_id}/replies",
    handler: handler.postAddReplyHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{thread_id}/comments/{comment_id}/replies/{reply_id}",
    handler: handler.deleteReplyHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

module.exports = routes;
