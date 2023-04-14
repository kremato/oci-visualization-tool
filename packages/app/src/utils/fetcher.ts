function fetcher(url: string, header: Headers) {
  return fetch(url, {
    headers: header,
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error();
    }
    const responseData = (await response.json()) as {
      message: string;
      data: any;
    };
    return responseData.data;
  });
}

export default fetcher;
