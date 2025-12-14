const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postAddThreadHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "GET",
    path: "/threads/{thread_id}",
    handler: handler.getThreadHandler,
  },
];

module.exports = routes;
