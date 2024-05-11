import customFetch from "../Domain/Utils/ApiUtilies/Fetch/customFetch";

// Tests that a GET request is sent with default headers when only URL is provided
it("should send a GET request with default headers when only URL is provided", () => {
  const fetchMock = jest.spyOn(window, "fetch");
  const url = "https://example.com";
  customFetch(url);
  expect(fetchMock).toHaveBeenCalledWith(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer null",
    },
    body: null,
  });
  fetchMock.mockRestore();
});
