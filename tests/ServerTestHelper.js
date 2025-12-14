/* istanbul ignore file */

const ServerTestHelper = {
  async getCredential(server) {
    const requestPayload = {
      username: Math.random().toString(36).substring(8, 17),
      password: "secret",
      fullname: "Random User",
    };

    // Register
    const newUserResponse = await server.inject({
      method: "POST",
      url: "/users",
      payload: requestPayload,
    });

    // Login
    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: requestPayload,
    });

    const responseJson = JSON.parse(response.payload).data;
    const responseUser = JSON.parse(newUserResponse.payload).data.addedUser;

    return { token: responseJson.accessToken, user_id: responseUser.id };
  },
};

module.exports = ServerTestHelper;
